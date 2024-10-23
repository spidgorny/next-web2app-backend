import { NextRequest, NextResponse } from "next/server";
import { Logger } from "@/lib/splunk";
import invariant from "tiny-invariant";
import { queue } from "@/lib/queue";
import { Project } from "@/app/project";
import { Job } from "bull";
import { sort } from "radash";

export async function GET() {
  let jobs = await queue.getJobs(["completed", "active", "failed"]);
  jobs = await Promise.all(
    jobs.map(async (job) => {
      return {
        ...job,
        status: await job.getState(),
      };
    }),
  );
  jobs = sort(jobs, (a: Job<Project>) => Number(a.id)).reverse();
  return NextResponse.json({
    data: jobs,
  });
}

export async function POST(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    Logger.info("create queue");
    const formData = await request.json();
    Logger.info("saving");
    const job = await queue.add(formData);
    Logger.info("Created job", job.id);
    return NextResponse.json(job.toJSON());
  } catch (e) {
    Logger.error(e);
    invariant(e instanceof Error);
    Logger.error(e.stack);
    return NextResponse.json({
      status: "error",
      message: e.message,
      stack: e.stack?.split("\n").slice(1).join("\n"),
    });
  }
}
