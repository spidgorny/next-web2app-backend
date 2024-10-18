"use server";

import { nanoid } from "nanoid";
import { store } from "@/lib/json-store";
import { Project } from "@/app/page";

export async function createProject(data: Project) {
  let id = nanoid();
  await store.set(`project:${id}`, { ...data, id });
  return { id };
}

export async function updateProject(id: string, data: Project) {
  let projectKey = `project:${id}`;
  const prev = await store.get(projectKey);
  await store.set(projectKey, { ...prev, ...data });
  return { id };
}
