"use client";
import { PropsWithChildren, use } from "react";

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
import Image from "next/image";

export default function Project(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
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
      <div className="flex justify-end my-3 gap-3">
        {item.data && (
          <>
            <BuildButton project={item.data} target="apk">
              <Image src="/img/apk.png" width={32} height={32} alt="apk" />{" "}
              Build APK
            </BuildButton>
            <BuildButton project={item.data} target="aab">
              <Image src="/img/aab.png" width={32} height={32} alt="aab" />{" "}
              Build AAB
            </BuildButton>
            <BuildButton project={item.data} target="ipa">
              <Image src="/img/ipa.png" width={32} height={32} alt="ipa" />{" "}
              Build IPA
            </BuildButton>
          </>
        )}
      </div>
      {item.data && <ShowProjectJobs project={item.data} />}
    </div>
  );
}

export function BuildButton(
  props: PropsWithChildren<{ project: Project; target: string }>,
) {
  const list = useJobList(props.project.id);

  const { isWorking, error, run } = useAsyncWorking(async () => {
    await axios.post(`/api/project/${props.project.id}/queue`, {
      ...props.project,
      target: props.target,
    });
    await list.mutate();
  });
  return (
    <div>
      <Button onClick={run} isLoading={isWorking}>
        {props.children}
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
