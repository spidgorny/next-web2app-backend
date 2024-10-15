import { NextRequest, NextResponse } from "next/server";
import Queue from "bee-queue";
import { Logger } from "@/lib/splunk";
import invariant from "tiny-invariant";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const queue = new Queue("build-android");
    queue.on("ready", async () => {
      Logger.info("ready");
    });
    await queue.ready();
    const job = queue.createJob({ title: "test from job" });
    Logger.info("saving");
    await job.timeout(100_000).retries(2).save();
    Logger.info("Created job", job.id);
    return NextResponse.json({
      id: job.id,
      progress: job.progress,
      data: job.data,
      options: job.options,
      status: job.status,
    });
  } catch (e) {
    Logger.error(e);
    invariant(e instanceof Error);
    return NextResponse.json({
      status: "error",
      message: e.message,
      stack: e.stack?.split("\n").slice(1).join("\n"),
    });
  }
}
