"use client";

import {
  Priority,
  Project,
  Task,
  useGetProjectsQuery,
  useGetTasksQuery,
} from "@/state/api";
import React from "react";
import { useAppSelector } from "../redux";
import Header from "@/components/Header";
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
      let colorClass = "bg-slate-100 text-slate-800 dark:bg-slate-900/40 dark:text-slate-300";
      if (statusStr === "WorkInProgress") {
        colorClass = "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300";
      } else if (statusStr === "UnderReview") {
        colorClass = "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
      } else if (statusStr === "Completed") {
        colorClass = "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
      }
      return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${colorClass}`}>
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
      let colorClass = "bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-300";
      if (priorityStr === "Urgent") {
        colorClass = "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300";
      } else if (priorityStr === "High") {
        colorClass = "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
      } else if (priorityStr === "Medium") {
        colorClass = "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
      } else if (priorityStr === "Low") {
        colorClass = "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300";
      }
      return (
        <span className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold uppercase ${colorClass}`}>
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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const HomePage = () => {
  const {
    data: tasks,
    isLoading: tasksLoading,
    isError: tasksError,
  } = useGetTasksQuery({ projectId: parseInt("1") });
  const { data: projects, isLoading: isProjectsLoading } =
    useGetProjectsQuery();

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  if (tasksLoading || isProjectsLoading) return <div className="p-8 text-center text-sm font-semibold text-gray-500">Loading Dashboard...</div>;
  if (tasksError || !tasks || !projects) return <div className="p-8 text-center text-sm font-semibold text-gray-500">Error fetching dashboard data</div>;

  // Stat metrics calculations
  const totalProjects = projects.length;
  const totalTasks = tasks.length;
  const urgentTasks = tasks.filter((t) => t.priority === "Urgent").length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;

  const priorityCount = tasks.reduce(
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

  const statusCount = projects.reduce(
    (acc: Record<string, number>, project: Project) => {
      const status = project.endDate ? "Completed" : "Active";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {},
  );

  const projectStatus = Object.keys(statusCount).map((key) => ({
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
      <div className="mb-6">
        <Header name="Project Management Dashboard" />
        <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1.5">
          Overview of your team's project pipeline, core metrics, and immediate assignments.
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {/* Projects Card */}
        <div className="dark:bg-dark-secondary rounded-xl bg-white p-5 border border-gray-200/50 dark:border-stroke-dark shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-300">
          <div>
            <p className="text-xs font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-wider">Total Projects</p>
            <h4 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{totalProjects}</h4>
          </div>
          <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 flex items-center justify-center font-bold">P</div>
        </div>
        {/* Tasks Card */}
        <div className="dark:bg-dark-secondary rounded-xl bg-white p-5 border border-gray-200/50 dark:border-stroke-dark shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-300">
          <div>
            <p className="text-xs font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-wider">Total Tasks</p>
            <h4 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{totalTasks}</h4>
          </div>
          <div className="h-10 w-10 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 flex items-center justify-center font-bold">T</div>
        </div>
        {/* Urgent Card */}
        <div className="dark:bg-dark-secondary rounded-xl bg-white p-5 border border-gray-200/50 dark:border-stroke-dark shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-300">
          <div>
            <p className="text-xs font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-wider">Urgent Tasks</p>
            <h4 className="text-2xl font-extrabold text-red-650 dark:text-red-405 mt-1">{urgentTasks}</h4>
          </div>
          <div className="h-10 w-10 rounded-lg bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 flex items-center justify-center font-bold">!</div>
        </div>
        {/* Completed Card */}
        <div className="dark:bg-dark-secondary rounded-xl bg-white p-5 border border-gray-200/50 dark:border-stroke-dark shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-300">
          <div>
            <p className="text-xs font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-wider">Completed Tasks</p>
            <h4 className="text-2xl font-extrabold text-emerald-650 dark:text-emerald-405 mt-1">{completedTasks}</h4>
          </div>
          <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 flex items-center justify-center font-bold">✓</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Task Priority Distribution Chart */}
        <div className="dark:bg-dark-secondary rounded-xl border border-gray-200/50 dark:border-stroke-dark bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Task Priority Distribution
            </h3>
            <p className="text-[11px] text-gray-500 dark:text-neutral-400 mb-6">Tasks categorized by urgency and severity.</p>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={taskDistribution}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={chartColors.barGrid}
                vertical={false}
              />
              <XAxis dataKey="name" stroke={chartColors.text} fontSize={11} tickLine={false} />
              <YAxis stroke={chartColors.text} fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? "#1d1f21" : "#ffffff",
                  borderColor: isDarkMode ? "#2d3135" : "#e5e7eb",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              <Bar dataKey="count" fill={chartColors.bar} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Project Status Donut Chart */}
        <div className="dark:bg-dark-secondary rounded-xl border border-gray-200/50 dark:border-stroke-dark bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Project Status Distribution
            </h3>
            <p className="text-[11px] text-gray-500 dark:text-neutral-400 mb-6">Status breakdown for active initiatives.</p>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                dataKey="count"
                data={projectStatus}
                innerRadius={60}
                outerRadius={85}
                paddingAngle={4}
                label={false}
              >
                {projectStatus.map((entry, index) => (
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
        </div>

        {/* Your Tasks Table */}
        <div className="dark:bg-dark-secondary rounded-xl border border-gray-200/50 dark:border-stroke-dark bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 md:col-span-2">
          <div className="mb-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Your Tasks
            </h3>
            <p className="text-[11px] text-gray-500 dark:text-neutral-400">Complete listing of high priority assignments.</p>
          </div>
          <div className="shadow-sm border border-gray-200/50 dark:border-stroke-dark rounded-xl overflow-hidden bg-white dark:bg-dark-secondary">
            <CustomTable
              data={tasks}
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
