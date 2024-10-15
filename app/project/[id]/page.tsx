"use client";

import { useSwrApi } from "@/app/use-swr-api";
import { Input } from "@nextui-org/react";

export default function Project({ params }: { params: { id: string } }) {
  const { item } = useSwrApi(`/api/project`, params.id);
  return (
    <div>
      <div>ID: {params.id}</div>
      <pre>data: {JSON.stringify(item.data, null, 2)}</pre>
      <form>
        <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
          <Input type="email" label="Email" />
          <Input type="email" label="Email" placeholder="Enter your email" />
        </div>
      </form>
    </div>
  );
}
