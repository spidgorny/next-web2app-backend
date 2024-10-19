import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/json-store";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  let storedData = await store.get(`project:${params.id}`);
  storedData = { id: params.id, ...storedData };
  // console.log(storedData);
  return NextResponse.json(storedData);
}
