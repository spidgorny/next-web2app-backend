import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/json-store";

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  let storedData = await store.get(`project:${params.id}`);
  storedData = { id: params.id, ...storedData };
  // console.log(storedData);
  return NextResponse.json(storedData);
}
