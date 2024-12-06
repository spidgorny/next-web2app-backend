import { NextRequest, NextResponse } from "next/server";
import { invariant } from "@/lib/invariant";
import { redis, store } from "@/lib/json-store";

export const dynamic = "force-dynamic";

export async function GET() {
  // const data = await redis.keys("*");
  let data = await redis.keys("jc:project:*");
  data = data.filter((x) => !x.endsWith("_t")).map((x) => x.replace("jc:", ""));
  const fullData = await Promise.all(
    data.map(async (key) => ({
      id: key.replace("project:", ""),
      ...(await store.get(key)),
    })),
  );
  return NextResponse.json({ data: fullData });
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  invariant(data.id, "data.id missing");
  await store.set(`project:${data.id}`, data);
  return NextResponse.json({ data }, { status: 201 });
}
