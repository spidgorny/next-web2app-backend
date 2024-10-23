import { NextRequest, NextResponse } from "next/server";
import { queue } from "@/lib/queue";

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string; jobId: string }> }
) {
  const params = await props.params;
  let job = await queue.getJob(params.jobId);
  let status = await job?.getState();
  let logs = await queue.getJobLogs(params.jobId);
  return NextResponse.json({
    data: job,
    status,
    logs,
  });
}
