import { NextRequest, NextResponse } from "next/server";
import { Logger } from "@/lib/splunk";
import invariant from "tiny-invariant";
import { queue } from "@/lib/queue";

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
  return NextResponse.json({
    data: jobs,
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    Logger.info("create queue");
    Logger.info("saving");
    const job = await queue.add({ title: "test from job" });
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
