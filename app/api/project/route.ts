import Redis from "ioredis";
import JSONStore from "redis-json";
import { NextRequest, NextResponse } from "next/server";
import invariant from "tiny-invariant";

const redis = new Redis();
const store = new JSONStore(redis);

export async function GET() {
  // const data = await redis.keys("*");
  let data = await redis.keys("jc:project:*");
  data = data.filter((x) => !x.endsWith("_t")).map((x) => x.replace("jc:", ""));
  console.log(data);
  const fullData = await Promise.all(
    data.map(async (key) => await store.get(key)),
  );
  return NextResponse.json({ data: fullData });
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  invariant(data.id, "data.id missing");
  const res = await store.set(`project:${data.id}`, data);
  return NextResponse.json({ res, data }, { status: 201 });
}
