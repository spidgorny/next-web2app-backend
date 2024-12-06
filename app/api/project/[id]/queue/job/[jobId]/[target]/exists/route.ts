import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { queue } from "@/lib/queue";
import { getTargetArtifactPath } from "@/lib/getTargetArtifactPath";
import { invariant } from "@/lib/invariant";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; jobId: string }> },
) {
  const { jobId } = await params;
  console.log("download", { jobId });
  const job = await queue.getJob(jobId);
  invariant(job, "job not found");

  // You'll need to adjust this path based on where your artifacts are stored
  const artifactPath = getTargetArtifactPath(job);

  return NextResponse.json({ exists: fs.existsSync(artifactPath) });
}
