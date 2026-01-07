import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { kv } from "@vercel/kv";

async function checkRateLimit(ip: string): Promise<boolean> {
  try {
    const key = `ratelimit:events:${ip}`;
    const count = await kv.incr(key); // Increment counter

    // Set expiry on first request (1 hour = 3600 seconds)
    if (count === 1) {
      await kv.expire(key, 3600);
    }

    return count <= 50; // Allow up to 100 requests per hour
  } catch (error) {
    console.error("Rate limit check failed:", error);
    return true; // If KV fails, allow request (fail open)
  }
}

export async function GET(request: Request) {
  // API key Verification
  const apiKey = request.headers.get("x-api-key");
  if (!apiKey || apiKey !== process.env.ANALYTICS_API_KEY) {
    return NextResponse.json(
      {
        error: "Unauthorized",
        message: "Invalid or missing API key",
      },
      { status: 401 }
    );
  }
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  let startDate: Date;
  let endDate: Date;

  if (!from || !to) {
    return NextResponse.json(
      { error: "Missing required parameters: 'from' and 'to'" },
      { status: 400 }
    );
  }

  try {
    startDate = new Date(from);
    endDate = new Date(to);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error("Invalid date");
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid date format. Use ISO format (e.g., 2025-01-01)" },
      { status: 400 }
    );
  }

  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const ip = forwardedFor?.split(",")[0] || realIp || "unknown";

  console.log("This is the ip -----", ip);
  // Check rate limit
  const allowed = await checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      {
        error: "Rate limit exceeded",
        message: "Maximum 50 requests per hour. Please try again later.",
      },
      { status: 429 }
    );
  }

  const events = await prisma.event.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 1000,
    include: {
      student: false,
      advice: false,
    },
  });

  const response = NextResponse.json({
    success: true,
    data: events,
    metadata: {
      from,
      to,
      count: events.length,
      limited: events.length === 1000,
    },
  });

  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "x-api-key, Content-Type"
  );

  response.headers.set("Cache-Control", "s-maxage=60, stale-while-revalidate");

  return response;
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "x-api-key, Content-Type",
    },
  });
}
