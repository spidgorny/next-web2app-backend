"use client";

import { useSwrApi } from "@/app/use-swr-api";
import Link from "next/link";
import { Button } from "@nextui-org/react";
import { ShowProjectJobs } from "@/app/project/[id]/show-project-jobs";

export default function Project({ params }: { params: { id: string } }) {
  const { item } = useSwrApi(`/api/project`, params.id);
  return (
    <div>
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl">{item.data?.name}</h1>
          <div className="text-gray-500">ID: {params.id}</div>
        </div>
        <div>
          <Link href={`/project/${params.id}/edit`}>
            <Button>Edit Project</Button>
          </Link>
        </div>
      </div>
      <pre className="my-3">data: {JSON.stringify(item.data, null, 2)}</pre>
      {item.data && <ShowProjectJobs project={item.data} />}
    </div>
  );
}
