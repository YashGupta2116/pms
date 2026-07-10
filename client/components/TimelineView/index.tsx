import { useAppSelector } from "@/app/redux";
import { useGetTasksQuery } from "@/state/api";
import { DisplayOption, Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import React, { useMemo, useState } from "react";

type Props = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

type TaskTypeItems = "task" | "milestone" | "project";

const index = ({ id, setIsModalNewTaskOpen }: Props) => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const {
    data: tasks,
    error,
    isLoading,
  } = useGetTasksQuery({ projectId: Number(id) });

  const [displayOptions, setDisplayOptions] = useState<DisplayOption>({
    viewMode: ViewMode.Month,
    locale: "en-US",
  });

  const ganttTasks = useMemo(() => {
    return (
      tasks
        ?.filter((task) => {
          if (!task.startDate || !task.dueDate) return false;
          const start = new Date(task.startDate);
          const end = new Date(task.dueDate);
          return !isNaN(start.getTime()) && !isNaN(end.getTime());
        })
        .map((task) => ({
          start: new Date(task.startDate as string),
          end: new Date(task.dueDate as string),
          name: task.title,
          id: `Task-${task.id}`,
          type: "task" as TaskTypeItems,
          progress: task.points ? (task.points / 10) * 100 : 0,
          isDisabled: false,
        })) || []
    );
  }, [tasks]);

  const handleViewModeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setDisplayOptions((prev) => ({
      ...prev,
      viewMode: event.target.value as ViewMode,
    }));
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occured while fetching tasks</div>;

  if (ganttTasks.length === 0) {
    return (
      <div className="px-4 xl:px-6 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
            Project Tasks Timeline
          </h1>
          <button
            className="bg-blue-primary flex items-center rounded-lg px-4 py-2 text-white hover:bg-blue-600 transition-colors text-sm font-semibold shadow-sm cursor-pointer"
            onClick={() => setIsModalNewTaskOpen(true)}
          >
            Add New Task
          </button>
        </div>
        <div className="mt-6 text-center text-sm font-semibold text-gray-500 dark:text-neutral-400 bg-white dark:bg-dark-secondary rounded-xl border border-gray-200/50 dark:border-stroke-dark p-8 shadow-sm">
          No tasks found with valid start and due dates. Create a task to view the timeline.
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 xl:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4 py-6">
        <h1 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
          Project Tasks Timeline
        </h1>
        <div className="relative inline-block w-40">
          <select
            className="w-full h-9 rounded-lg border border-gray-200/80 dark:border-stroke-dark/80 bg-white dark:bg-dark-secondary pl-3 pr-8 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 focus:border-blue-500 focus:outline-none shadow-sm focus:ring-1 focus:ring-blue-500/20 appearance-none cursor-pointer transition-colors duration-200"
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
      </div>

      <div className="dark:bg-dark-secondary overflow-hidden rounded-xl border border-gray-200/50 dark:border-stroke-dark bg-white shadow-sm dark:text-white">
        <div className="timeline">
          <Gantt
            tasks={ganttTasks}
            {...displayOptions}
            columnWidth={displayOptions.viewMode === ViewMode.Month ? 150 : 100}
            listCellWidth="100px"
            barBackgroundColor={isDarkMode ? "#1e293b" : "#e2e8f0"}
            barBackgroundSelectedColor={isDarkMode ? "#334155" : "#cbd5e1"}
            barProgressColor={isDarkMode ? "#2563eb" : "#3b82f6"}
            barProgressSelectedColor={isDarkMode ? "#3b82f6" : "#60a5fa"}
          />
        </div>
        <div className="px-5 pt-3 pb-5">
          <button
            className="bg-blue-primary flex items-center rounded-lg px-4 py-2 text-white hover:bg-blue-600 transition-colors text-sm font-semibold shadow-sm"
            onClick={() => setIsModalNewTaskOpen(true)}
          >
            Add New Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default index;
