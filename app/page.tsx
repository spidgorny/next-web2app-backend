"use client";

import { ListProjects } from "@/app/list-projects";

export type Project = {
  id: string;
  name: string;
  url: string;
  title: string;
  color?: string;
  status: string;
};

export default function Home() {
  return <ListProjects />;
}
