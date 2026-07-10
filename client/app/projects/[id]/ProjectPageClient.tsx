"use client";

import React, { useState } from "react";
import ProjectHeader from "@/app/projects/ProjectHeader";
import Board from "../../../components/BoardView";
import List from "../../../components/ListView";
import Timeline from "../../../components/TimelineView";
import Table from "../../../components/TableView";
import ModalNewTask from "@/components/Modal/ModalNewTask";
import { useGetProjectsQuery } from "@/state/api";

const ProjectPageClient = ({ id }: { id: string }) => {
  const [activeTab, setActiveTab] = useState("Board");
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);
  const { data: projects } = useGetProjectsQuery();
  const currentProject = projects?.find((p) => p.id === Number(id));
  const projectName = currentProject?.name || "Project";

  return (
    <div className="flex w-full flex-col min-h-screen bg-gray-50/30 dark:bg-dark-bg">
      <ModalNewTask
        id={id}
        isOpen={isModalNewTaskOpen}
        onClose={() => setIsModalNewTaskOpen(false)}
      />

      <ProjectHeader 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        setIsModalNewTaskOpen={setIsModalNewTaskOpen} 
        projectName={projectName}
      />

      <div className="flex-1 p-6 lg:p-8">
        {activeTab === "Board" && (
          <Board id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
        )}

        {activeTab === "List" && (
          <List id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
        )}

        {activeTab === "Timeline" && (
          <Timeline id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
        )}

        {activeTab === "Table" && (
          <Table id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
        )}
      </div>
    </div>
  );
};

export default ProjectPageClient;
