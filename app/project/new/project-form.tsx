"use client";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import {
  createProject,
  updateProject,
} from "@/app/project/new/project-actions";
import { Button, Input, Link } from "@nextui-org/react";
import { Project } from "@/app/project";

export function ProjectForm(props: { initialData?: Project }) {
  const router = useRouter();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let formData = Object.fromEntries(
      new FormData(e.target as HTMLFormElement).entries(),
    ) as {
      name: string;
    } as Project;
    console.log(formData);
    if (props.initialData?.id) {
      await updateProject(props.initialData.id, formData);
      router.push(`/project/${props.initialData.id}`);
    } else {
      const { id } = await createProject(formData);
      router.push(`/project/${id}`);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="mb-3">
        <label>
          Name (should start with &apos;com.androidfromfrankfurt.&apos;):
          <Input
            name="name"
            required
            defaultValue={props.initialData?.name ?? ""}
            pattern="com\.androidfromfrankfurt\..*"
          />
        </label>
      </div>
      <div className="mb-3">
        <label>
          Website URL: (
          <Link href={props.initialData?.url} target="_blank">
            Open
          </Link>
          )
          <Input
            name="url"
            required
            type="url"
            defaultValue={props.initialData?.url ?? ""}
          />
        </label>
      </div>
      <div className="mb-3">
        <label>
          Application Title
          <Input
            name="title"
            required
            defaultValue={props.initialData?.title ?? ""}
          />
        </label>
      </div>
      <div className="mb-3">
        <label>
          Theme Color
          <Input
            name="color"
            type="color"
            defaultValue={props.initialData?.color ?? ""}
          />
        </label>
      </div>
      <div className="mb-3">
        <Button type="submit">
          {props.initialData?.id ? "Update" : "Create"}{" "}
        </Button>
      </div>
    </form>
  );
}
