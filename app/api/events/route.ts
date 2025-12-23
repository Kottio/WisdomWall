import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET(request: Request) {
  // const apiKey = request.headers.get("x-api-key");
  // if (apiKey != process.env.ANALYTICS_API_KEY) {
  //   return NextResponse.json({ error: "Invalid API key" }, { status: 400 });
  // }
  const events = await prisma.event.findMany({
    include: {
      student: false,
      advice: false,
    },
  });
  return NextResponse.json({ status: 200, events });
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

import { kv } from "@vercel/kv";

// async function checkRateLimit(identifier: string) {
//   const key = `ratelimit:${identifier}`;
//   const count = await kv.incr(key);

//   if (count === 1) {
//     await kv.expire(key, 3600); // 1 hour
//   }

//   return count <= 100; // 100 requests per hour
// }

// // In your route:
// const allowed = await checkRateLimit(ip);
// if (!allowed) {
//   return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
// }
