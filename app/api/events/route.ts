import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET(request: Request) {
  // API key Verification
  const apiKey = request.headers.get("x-api-key");
  if (!apiKey || apiKey !== "wqjhdfiou2weqwddjikshdoiu") {
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

//  const ip = request.ip ?? '127.0.0.1';
//   const { success } = await ratelimit.limit(ip);
//   if (!success) {
//     return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
//   }

// const { searchParams } = new URL(request.url);
// const startDate = searchParams.get("startDate");
// const endDate = searchParams.get("endDate") || new Date().toISOString();

//  headers: {
//     'x-api-key': 'wqjhdfiou2weqwddjikshdoiu'
//   }

// import { kv } from "@vercel/kv";

// async function checkRateLimit(identifier: string) {
//   const key = `ratelimit:${identifier}`;
//   const count = await kv.incr(key);

//   if (count === 1) {
//     await kv.expire(key, 3600); // 1 hour
//   }

//   return count <= 100; // 100 requests per hour
// }3

// // In your route:
// const allowed = await checkRateLimit(ip);
// if (!allowed) {
//   return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
// }

//  curl "http://localhost:3000/api/events?from=2025-07-01&to=2026-01-07" \
//     -H "x-api-key: wqjhdfiou2weqwddjikshdoiu"

// process.env.ANALYTICS_API_KEY
