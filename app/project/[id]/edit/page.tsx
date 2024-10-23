import { ProjectForm } from "@/app/project/new/project-form";
import { store } from "@/lib/json-store";

export default async function NewProjectPage(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = await props.params;
  const project = await store.get(`project:${params.id}`);
  return <ProjectForm initialData={project} />;
}
