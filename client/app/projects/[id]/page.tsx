import React from "react";
import ProjectPageClient from "./ProjectPageClient";

type Props = {
  params: Promise<{ id: string }>;
};

const Project = async ({ params }: Props) => {
  const { id } = await params;

  return <ProjectPageClient id={id} />;
};

export default Project;
