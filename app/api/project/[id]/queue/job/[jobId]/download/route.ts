import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    // You'll need to adjust this path based on where your artifacts are stored
    const artifactPath = path.join(process.cwd(), "artifacts", `${id}`);

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
        "Content-Disposition": `attachment; filename="artifact-${id}"`,
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
