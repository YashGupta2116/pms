"use client";

import {
  Priority,
  Project,
  Task,
  useGetProjectsQuery,
  useGetTasksQuery,
} from "@/state/api";
import React, { useMemo, useState } from "react";
import { useAppSelector } from "../redux";
import Header from "@/components/Header";
import ModalNewTeam from "@/components/Modal/ModalNewTeam";
import ModalNewProject from "@/components/Modal/ModalNewProject";
import { CustomTable, ColumnDef } from "@/components/CustomTable";
import { format } from "date-fns";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const taskColumns: ColumnDef<Task>[] = [
  {
    headerName: "Title",
    field: "title",
    className: "font-semibold text-gray-900 dark:text-white text-sm",
  },
  {
    headerName: "Status",
    field: "status",
    renderCell: ({ value }) => {
      const statusStr = String(value);
      let colorClass =
        "bg-slate-100 text-slate-800 dark:bg-slate-900/40 dark:text-slate-300";
      if (statusStr === "WorkInProgress" || statusStr === "Work In Progress") {
        colorClass =
          "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300";
      } else if (statusStr === "UnderReview" || statusStr === "Under Review") {
        colorClass =
          "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
      } else if (statusStr === "Completed") {
        colorClass =
          "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
      }
      return (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${colorClass}`}
        >
          {statusStr}
        </span>
      );
    },
  },
  {
    headerName: "Priority",
    field: "priority",
    renderCell: ({ value }) => {
      const priorityStr = String(value);
      let colorClass =
        "bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-300";
      if (priorityStr === "Urgent") {
        colorClass =
          "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300";
      } else if (priorityStr === "High") {
        colorClass =
          "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
      } else if (priorityStr === "Medium") {
        colorClass =
          "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
      } else if (priorityStr === "Low") {
        colorClass =
          "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300";
      }
      return (
        <span
          className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold uppercase ${colorClass}`}
        >
          {priorityStr}
        </span>
      );
    },
  },
  {
    headerName: "Due Date",
    field: "dueDate",
    renderCell: ({ value }) => {
      if (!value) return "-";
      try {
        return format(new Date(String(value)), "MMM dd, yyyy");
      } catch {
        return String(value);
      }
    },
  },
];

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const HomePage = () => {
  const currentUser = useAppSelector((state) => state.auth.user);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null,
  );
  const [filterMyTasks, setFilterMyTasks] = useState(true);
  const [isModalNewTeamOpen, setIsModalNewTeamOpen] = useState(false);
  const [isModalNewProjectOpen, setIsModalNewProjectOpen] = useState(false);

  const {
    data: projects,
    isLoading: isProjectsLoading,
    isError: isProjectsError,
  } = useGetProjectsQuery();

  React.useEffect(() => {
    if (projects && projects.length > 0 && selectedProjectId === null) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId]);

  const {
    data: tasks,
    isLoading: tasksLoading,
    isError: tasksError,
  } = useGetTasksQuery(
    { projectId: selectedProjectId ?? 0 },
    { skip: selectedProjectId === null },
  );

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  // Filter tasks table
  const displayedTasks = useMemo(() => {
    if (!tasks) return [];
    if (filterMyTasks && currentUser?.userId) {
      return tasks.filter((t) => t.assignedUserId === currentUser.userId);
    }
    return tasks;
  }, [tasks, filterMyTasks, currentUser]);

  if (isProjectsLoading) {
    return <div className="p-8 text-center text-sm text-gray-400">Loading Dashboard...</div>;
  }

  if (isProjectsError) {
    return <div className="p-8 text-center text-sm text-red-400">Failed to load projects. Please try again.</div>;
  }

  if (!currentUser?.teamId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] p-8 text-center bg-gray-50/10 dark:bg-dark-bg transition-colors duration-300">
        <ModalNewTeam
          isOpen={isModalNewTeamOpen}
          onClose={() => setIsModalNewTeamOpen(false)}
        />
        <div className="relative w-full max-w-md p-8 rounded-2xl border border-white/20 bg-white/70 shadow-2xl backdrop-blur-xl dark:border-neutral-800/40 dark:bg-neutral-900/60 transition-all hover:scale-[1.01]">
          {/* Accent decoration */}
          <div className="absolute -top-10 -left-10 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl dark:bg-blue-600/10"></div>
          <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-purple-500/10 blur-2xl dark:bg-purple-600/10"></div>

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 mb-5">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Welcome to PROMANAGE!</h2>
          <p className="mt-3 text-sm text-gray-500 dark:text-neutral-400 leading-relaxed">
            To get started, you need to be part of a team. Create a new team or join an existing one to begin managing projects and tasks.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() => setIsModalNewTeamOpen(true)}
              className="flex items-center justify-center rounded-xl bg-blue-primary px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-600 transition-all cursor-pointer"
            >
              Create a Team
            </button>
            <a
              href="/teams"
              className="flex items-center justify-center rounded-xl border border-gray-200 bg-white dark:border-stroke-dark dark:bg-dark-tertiary px-5 py-2.5 text-xs font-bold text-gray-700 dark:text-white shadow-sm hover:bg-gray-50 dark:hover:bg-dark-secondary transition-all cursor-pointer"
            >
              Join a Team
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] p-8 text-center bg-gray-50/10 dark:bg-dark-bg transition-colors duration-300">
        <ModalNewProject
          isOpen={isModalNewProjectOpen}
          onClose={() => setIsModalNewProjectOpen(false)}
        />
        <div className="relative w-full max-w-md p-8 rounded-2xl border border-white/20 bg-white/70 shadow-2xl backdrop-blur-xl dark:border-neutral-800/40 dark:bg-neutral-900/60 transition-all hover:scale-[1.01]">
          {/* Accent decoration */}
          <div className="absolute -top-10 -left-10 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl dark:bg-blue-600/10"></div>
          <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-purple-500/10 blur-2xl dark:bg-purple-600/10"></div>

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 mb-5">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">No Projects Yet</h2>
          <p className="mt-3 text-sm text-gray-500 dark:text-neutral-400 leading-relaxed">
            Your team doesn't have any projects yet. Create a new project to start scheduling tasks and viewing analytics.
          </p>
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setIsModalNewProjectOpen(true)}
              className="flex items-center justify-center rounded-xl bg-blue-primary px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-blue-600 transition-all cursor-pointer"
            >
              Create a Project
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Stat metrics calculations
  const totalProjects = projects?.length || 0;
  const totalTasks = tasks?.length || 0;
  const urgentTasks = tasks?.filter((t) => t.priority === "Urgent").length || 0;
  const completedTasks =
    tasks?.filter((t) => t.status === "Completed").length || 0;

  const priorityCount = (tasks || []).reduce(
    (acc: Record<string, number>, task: Task) => {
      const { priority } = task;
      acc[priority as Priority] = (acc[priority as Priority] || 0) + 1;
      return acc;
    },
    {},
  );

  const taskDistribution = Object.keys(priorityCount).map((key) => ({
    name: key,
    count: priorityCount[key],
  }));

  const statusCount = (tasks || []).reduce(
    (acc: Record<string, number>, task: Task) => {
      const status = task.status || "To Do";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {},
  );

  const taskStatusData = Object.keys(statusCount).map((key) => ({
    name: key,
    count: statusCount[key],
  }));

  const chartColors = isDarkMode
    ? {
        bar: "#3b82f6",
        barGrid: "#2d3135",
        text: "#9ca3af",
      }
    : {
        bar: "#2563eb",
        barGrid: "#e5e7eb",
        text: "#4b5563",
      };

  return (
    <div className="container h-full w-[100%] p-8">
      {/* HEADER SECTION */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Header name="Project Management Dashboard" />
          <p className="mt-1.5 text-xs text-gray-500 dark:text-neutral-400">
            Real-time charts, metrics, and assignments for your workspace.
          </p>
        </div>

        {/* PROJECT SWITCHER DROPDOWN */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold tracking-wider text-gray-400 uppercase dark:text-neutral-500">
            Project:
          </span>
          <select
            value={selectedProjectId ?? ""}
            onChange={(e) => setSelectedProjectId(Number(e.target.value))}
            className="dark:border-stroke-dark dark:bg-dark-secondary cursor-pointer rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-700 shadow-sm transition-all focus:border-blue-500 focus:outline-none dark:text-white"
          >
            {projects?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Projects Card */}
        <div className="dark:bg-dark-secondary dark:border-stroke-dark flex items-center justify-between rounded-xl border border-gray-200/50 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md">
          <div>
            <p className="text-xs font-bold tracking-wider text-gray-400 uppercase dark:text-neutral-500">
              Total Projects
            </p>
            <h4 className="mt-1 text-2xl font-extrabold text-gray-900 dark:text-white">
              {totalProjects}
            </h4>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 font-bold text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
            P
          </div>
        </div>
        {/* Tasks Card */}
        <div className="dark:bg-dark-secondary dark:border-stroke-dark flex items-center justify-between rounded-xl border border-gray-200/50 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md">
          <div>
            <p className="text-xs font-bold tracking-wider text-gray-400 uppercase dark:text-neutral-500">
              Project Tasks
            </p>
            <h4 className="mt-1 text-2xl font-extrabold text-gray-900 dark:text-white">
              {totalTasks}
            </h4>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 font-bold text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
            T
          </div>
        </div>
        {/* Urgent Card */}
        <div className="dark:bg-dark-secondary dark:border-stroke-dark flex items-center justify-between rounded-xl border border-gray-200/50 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md">
          <div>
            <p className="text-xs font-bold tracking-wider text-gray-400 uppercase dark:text-neutral-500">
              Urgent Tasks
            </p>
            <h4 className="text-red-650 dark:text-red-405 mt-1 text-2xl font-extrabold">
              {urgentTasks}
            </h4>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 font-bold text-red-600 dark:bg-red-950/40 dark:text-red-400">
            !
          </div>
        </div>
        {/* Completed Card */}
        <div className="dark:bg-dark-secondary dark:border-stroke-dark flex items-center justify-between rounded-xl border border-gray-200/50 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md">
          <div>
            <p className="text-xs font-bold tracking-wider text-gray-400 uppercase dark:text-neutral-500">
              Completed Tasks
            </p>
            <h4 className="text-emerald-650 dark:text-emerald-405 mt-1 text-2xl font-extrabold">
              {completedTasks}
            </h4>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 font-bold text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
            ✓
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Task Priority Distribution Chart */}
        <div className="dark:bg-dark-secondary dark:border-stroke-dark rounded-xl border border-gray-200/50 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Task Priority Distribution
            </h3>
            <p className="mb-6 text-[11px] text-gray-500 dark:text-neutral-400">
              Tasks categorized by priority urgency.
            </p>
          </div>
          {taskDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={taskDistribution}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={chartColors.barGrid}
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke={chartColors.text}
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  stroke={chartColors.text}
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? "#1d1f21" : "#ffffff",
                    borderColor: isDarkMode ? "#2d3135" : "#e5e7eb",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar
                  dataKey="count"
                  fill={chartColors.bar}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-gray-450 flex h-[260px] items-center justify-center text-xs dark:text-neutral-500">
              No data available
            </div>
          )}
        </div>

        {/* Task Status Donut Chart */}
        <div className="dark:bg-dark-secondary dark:border-stroke-dark rounded-xl border border-gray-200/50 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Task Status Distribution
            </h3>
            <p className="mb-6 text-[11px] text-gray-500 dark:text-neutral-400">
              Tasks breakdown by current process state.
            </p>
          </div>
          {taskStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  dataKey="count"
                  data={taskStatusData}
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  label={false}
                >
                  {taskStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? "#1d1f21" : "#ffffff",
                    borderColor: isDarkMode ? "#2d3135" : "#e5e7eb",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-gray-450 flex h-[260px] items-center justify-center text-xs dark:text-neutral-500">
              No data available
            </div>
          )}
        </div>

        {/* Your Tasks Table */}
        <div className="dark:bg-dark-secondary dark:border-stroke-dark rounded-xl border border-gray-200/50 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md md:col-span-2">
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Workspace Tasks
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-neutral-400">
                Complete listing of tasks in this project.
              </p>
            </div>

            {/* MY TASKS FILTER SWITCH */}
            <div className="dark:border-stroke-dark dark:bg-dark-tertiary flex h-fit overflow-hidden rounded-lg border border-gray-200/80 bg-gray-50">
              <button
                type="button"
                onClick={() => setFilterMyTasks(true)}
                className={`cursor-pointer px-3 py-1.5 text-[10px] font-bold transition-colors ${filterMyTasks ? "bg-blue-primary text-white" : "text-gray-500 hover:text-gray-900 dark:hover:text-white"}`}
              >
                My Tasks
              </button>
              <button
                type="button"
                onClick={() => setFilterMyTasks(false)}
                className={`cursor-pointer px-3 py-1.5 text-[10px] font-bold transition-colors ${!filterMyTasks ? "bg-blue-primary text-white" : "text-gray-500 hover:text-gray-900 dark:hover:text-white"}`}
              >
                All Tasks
              </button>
            </div>
          </div>
          <div className="dark:border-stroke-dark dark:bg-dark-secondary overflow-hidden rounded-xl border border-gray-200/50 bg-white shadow-sm">
            <CustomTable
              data={displayedTasks}
              columns={taskColumns}
              searchPlaceholder="Search task titles..."
              searchField="title"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
