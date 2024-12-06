import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { queue } from "@/lib/queue";
import { getTargetArtifactPath } from "@/lib/getTargetArtifactPath";
import { invariant } from "@/lib/invariant";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; jobId: string }> },
) {
  console.log("==========", process.env.NODE_ENV, process.env.NEXT_RUNTIME);
  if (process.env.NODE_ENV === "production" && !process.env.NEXT_RUNTIME) {
    return NextResponse.json(
      { message: "This API route is not available during build" },
      { status: 403 },
    );
  }

  try {
    const { jobId } = await params;
    console.log("download", { jobId });
    const job = await queue.getJob(jobId);
    invariant(job, "job not found");

    // You'll need to adjust this path based on where your artifacts are stored
    const artifactPath = getTargetArtifactPath(job);

    if (!fs.existsSync(artifactPath)) {
      return NextResponse.json(
        { message: "Artifact not found" },
        { status: 404 },
      );
    }

    // Read the file
    const file = await fs.promises.readFile(artifactPath);

    // Create and return the response with the file
    return new NextResponse(file, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${path.basename(artifactPath)}"`,
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { message: "Error downloading artifact" },
      { status: 500 },
    );
  }
}
