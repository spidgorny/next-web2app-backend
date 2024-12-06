"use client";
import {use} from "react";

import {useSwrApi} from "@/app/use-swr-api";
import Link from "next/link";
import {Button} from "@nextui-org/react";
import {ShowProjectJobs} from "@/app/project/[id]/show-project-jobs";

import type {Project} from "@/app/project";
import Image from "next/image";
import {BuildButton} from "@/app/project/[id]/build-button";

export default function ProjectPage(props: { params: Promise<{ id: string }> }) {
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
