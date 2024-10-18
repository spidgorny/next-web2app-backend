"use client";

import { useSwrApi } from "@/app/use-swr-api";
import Link from "next/link";
import { Button, Card, CardBody } from "@nextui-org/react";
import {
  ShowProjectJobs,
  useJobList,
} from "@/app/project/[id]/show-project-jobs";
import { useAsyncWorking } from "spidgorny-react-helpers/use-async-working";
import axios from "axios";

import type { Project } from "@/app/project";

export default function Project({ params }: { params: { id: string } }) {
  const { item } = useSwrApi<Project>(`/api/project`, params.id);
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
      <div className="flex justify-end my-3">
        {item.data && <BuildButton project={item.data} />}
      </div>
      {item.data && <ShowProjectJobs project={item.data} />}
    </div>
  );
}

export function BuildButton(props: { project: Project }) {
  const list = useJobList(props.project.id);

  const { isWorking, error, run } = useAsyncWorking(async () => {
    await axios.post(`/api/project/${props.project.id}/queue`, props.project);
    await list.mutate();
  });
  return (
    <div>
      <Button onClick={run} isLoading={isWorking}>
        Build Now
      </Button>
      <ErrorAlert error={error} />
    </div>
  );
}

export function ErrorAlert(props: { error?: Error }) {
  if (!props.error) {
    return;
  }
  return (
    <Card>
      <CardBody className="text-red-500">
        <p>
          {props.error.message} [{props.error.name}]
        </p>
      </CardBody>
    </Card>
  );
}
