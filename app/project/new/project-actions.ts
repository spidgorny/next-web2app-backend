"use server";

import { nanoid } from "nanoid";
import { store } from "@/lib/json-store";

export async function createProject(data: { name: string }) {
  let id = nanoid();
  await store.set(`project:${id}`, { id, ...data });
  return { id };
}
