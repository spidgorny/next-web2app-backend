import { NextRequest, NextResponse } from "next/server";
import { queue } from "@/lib/queue";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string; jobId: string }> },
) {
  const params = await props.params;
  const job = await queue.getJob(params.jobId);
  const status = await job?.getState();
  const logs = await queue.getJobLogs(params.jobId);
  return NextResponse.json({
    data: job,
    status,
    logs,
  });
}
