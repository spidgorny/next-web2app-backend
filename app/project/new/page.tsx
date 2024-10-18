"use client";

import { Button, Input } from "@nextui-org/react";
import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createProject } from "@/app/project/new/project-actions";

export default function NewProjectPage() {
  const router = useRouter();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let formData = Object.fromEntries(new FormData(e.target).entries()) as {
      name: string;
    };
    console.log(formData);
    const { id } = await createProject(formData);
    router.push(`/project/${id}`);
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="mb-3">
        <label>
          Name
          <Input name="name" required />
        </label>
      </div>
      <div className="mb-3">
        <Button type="submit">Create</Button>
      </div>
    </form>
  );
}
