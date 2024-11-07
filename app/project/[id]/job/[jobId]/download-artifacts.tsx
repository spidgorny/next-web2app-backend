import { ProjectJob } from "@/app/project/[id]/project-job";
import { useState } from "react";
import { useStateObj } from "spidgorny-react-helpers/use-state-obj";
import useSWR from "swr";
import { Job } from "bull";
import { ErrorAlert } from "@/app/project/[id]/page";

export function DownloadArtifacts(props: { job: ProjectJob }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const error = useStateObj<Error>();
  const exists = useSWR(
    `/api/project/${props.job.data.id}/queue/job/${props.job.id}/${props.job.data.target}/exists`,
  );

  const getFilenameFromContentDisposition = (
    header: string | null,
  ): string | null => {
    if (!header) return null;
    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    const matches = filenameRegex.exec(header);
    if (matches != null && matches[1]) {
      return matches[1].replace(/['"]/g, "");
    }
    return null;
  };

  const handleDownload = async () => {
    error.reset();
    try {
      setIsDownloading(true);

      const response = await fetch(
        `/api/project/${props.job.data.id}/queue/job/${props.job.id}/${props.job.data.target}/download`,
      );

      if (!response.ok) {
        throw new Error("Download failed");
      }
      const contentDisposition = response.headers.get("content-disposition");
      const fileName =
        getFilenameFromContentDisposition(contentDisposition) ||
        `download.${props.job.data.target}`;

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (e) {
      console.error("Download error:", e);
      error.set(e as Error);
    } finally {
      setIsDownloading(false);
    }
  };

  const isComplete = (job: Job | null) => {
    return Boolean(job?.finishedOn);
  };

  return (
    <div>
      {isComplete(props.job) && (
        <div>
          <button
            onClick={handleDownload}
            disabled={isDownloading || exists.data?.exists === false}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isDownloading
              ? "Downloading..."
              : `Download ${props.job.data.target} Artifact`}
          </button>
          <ErrorAlert error={error.value} />
        </div>
      )}
    </div>
  );
}
