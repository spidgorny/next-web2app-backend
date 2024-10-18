import { NextRequest, NextResponse } from "next/server";
import Redis from "ioredis";
import JSONStore from "redis-json";

const redis = new Redis();
const store = new JSONStore(redis);

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  let storedData = await store.get(`project:${params.id}`);
  storedData = { id: params.id, ...storedData };
  // console.log(storedData);
  return NextResponse.json(storedData);
}
