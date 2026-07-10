"use client";

import { useAppSelector } from "@/app/redux";
import Header from "@/components/Header";
import { useGetProjectsQuery } from "@/state/api";
import { DisplayOption, Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import React, { useMemo, useState } from "react";

type TaskTypeItems = "task" | "milestone" | "project";

const index = () => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const { data: projects, isLoading, isError } = useGetProjectsQuery();

  const [displayOptions, setDisplayOptions] = useState<DisplayOption>({
    viewMode: ViewMode.Month,
    locale: "en-US",
  });

  const ganttTasks = useMemo(() => {
    return (
      projects
        ?.filter((project) => {
          if (!project.startDate || !project.endDate) return false;
          const start = new Date(project.startDate);
          const end = new Date(project.endDate);
          return !isNaN(start.getTime()) && !isNaN(end.getTime());
        })
        .map((project) => ({
          start: new Date(project.startDate as string),
          end: new Date(project.endDate as string),
          name: project.name,
          id: `Project-${project.id}`,
          type: "project" as TaskTypeItems,
          progress: 50,
          isDisabled: false,
        })) || []
    );
  }, [projects]);

  const handleViewModeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setDisplayOptions((prev) => ({
      ...prev,
      viewMode: event.target.value as ViewMode,
    }));
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError || !projects)
    return <div>An error occured while fetching projects</div>;

  if (ganttTasks.length === 0) {
    return (
      <div className="max-w-full p-8">
        <Header name="Projects Timeline" />
        <div className="mt-6 text-center text-sm font-semibold text-gray-500 dark:text-neutral-400 bg-white dark:bg-dark-secondary rounded-xl border border-gray-200/50 dark:border-stroke-dark p-8 shadow-sm">
          No projects with valid start and end dates found. Create a project to view the timeline.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full p-8">
      <header className="mb-6 flex items-center justify-between gap-4">
        <Header name="Projects Timeline" />
        <div className="relative inline-block w-40">
          <select
            className="w-full h-9 rounded-lg border border-gray-200/80 dark:border-stroke-dark/80 bg-white dark:bg-dark-secondary pl-3 pr-8 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-205 focus:border-blue-500 focus:outline-none shadow-sm focus:ring-1 focus:ring-blue-500/20 appearance-none cursor-pointer transition-colors duration-200"
            value={displayOptions.viewMode}
            onChange={handleViewModeChange}
          >
            <option value={ViewMode.Day}>Daily View</option>
            <option value={ViewMode.Week}>Weekly View</option>
            <option value={ViewMode.Month}>Monthly View</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-gray-400 dark:text-neutral-500">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </header>

      <div className="dark:bg-dark-secondary overflow-hidden rounded-xl border border-gray-200/50 dark:border-stroke-dark bg-white shadow-sm dark:text-white">
        <div className="timeline">
          <Gantt
            tasks={ganttTasks}
            {...displayOptions}
            columnWidth={displayOptions.viewMode === ViewMode.Month ? 150 : 100}
            listCellWidth="100px"
            projectBackgroundColor={isDarkMode ? "#1e293b" : "#e2e8f0"}
            projectProgressColor={isDarkMode ? "#2563eb" : "#3b82f6"}
            projectProgressSelectedColor={isDarkMode ? "#3b82f6" : "#60a5fa"}
          />
        </div>
      </div>
    </div>
  );
};

export default index;
