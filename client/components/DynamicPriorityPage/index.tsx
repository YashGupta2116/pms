"use client";

import { Priority, useGetUserTasksQuery, Task } from "@/state/api";
import { useState } from "react";
import ModalNewTask from "../Modal/ModalNewTask";
import Header from "../Header";
import TaskCard from "../TaskCard";
import { CustomTable, ColumnDef } from "@/components/CustomTable";
import { format } from "date-fns";
import { Tag, Calendar, User } from "lucide-react";

type Props = {
  priority: Priority;
};

const columns: ColumnDef<Task>[] = [
  {
    headerName: "Title",
    field: "title",
    className: "font-semibold text-gray-900 dark:text-white text-sm",
  },
  {
    headerName: "Description",
    field: "description",
    className: "text-gray-500 max-w-[200px] truncate",
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
    headerName: "Tags",
    field: "tags",
    renderCell: ({ value }) => {
      if (!value) return "-";
      return (
        <div className="flex flex-wrap gap-1 max-w-[150px]">
          {String(value)
            .split(",")
            .map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-0.5 rounded-full bg-blue-50/50 px-2 py-0.5 text-[10px] font-semibold text-blue-600 dark:bg-blue-950/20 dark:text-blue-300 border border-blue-100/30"
              >
                <Tag className="h-2 w-2 shrink-0" />
                {tag.trim()}
              </span>
            ))}
        </div>
      );
    },
  },
  {
    headerName: "Start Date",
    field: "startDate",
    renderCell: ({ value }) => {
      if (!value) return "-";
      try {
        return (
          <span className="inline-flex items-center gap-1 text-gray-500 dark:text-neutral-400">
            <Calendar className="h-3 w-3 shrink-0" />
            {format(new Date(String(value)), "MMM dd, yyyy")}
          </span>
        );
      } catch {
        return String(value);
      }
    },
  },
  {
    headerName: "Due Date",
    field: "dueDate",
    renderCell: ({ value }) => {
      if (!value) return "-";
      try {
        return (
          <span className="inline-flex items-center gap-1 text-gray-500 dark:text-neutral-400">
            <Calendar className="h-3 w-3 shrink-0 text-red-400/80" />
            {format(new Date(String(value)), "MMM dd, yyyy")}
          </span>
        );
      } catch {
        return String(value);
      }
    },
  },
  {
    headerName: "Author",
    field: "author",
    renderCell: ({ row }) => {
      return (
        <span className="inline-flex items-center gap-1">
          <User className="h-3.5 w-3.5 text-gray-400" />
          {row.author?.username || "Unknown"}
        </span>
      );
    },
  },
  {
    headerName: "Assignee",
    field: "assignee",
    renderCell: ({ row }) => {
      return (
        <span className="inline-flex items-center gap-1 font-semibold text-gray-800 dark:text-gray-200">
          <User className="h-3.5 w-3.5 text-blue-500" />
          {row.assignee?.username || "Unassigned"}
        </span>
      );
    },
  },
];

const DynamicPriorityPage = ({ priority }: Props) => {
  const [view, setView] = useState("list");
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);

  const userId = 1;
  const {
    data: userTasksData,
    isLoading,
    isError: isTasksError,
  } = useGetUserTasksQuery(userId, {
    skip: userId === null,
  });

  const filteredTask = userTasksData?.filter(
    (task) => task.priority === priority,
  );

  if (isTasksError || !userTasksData) return <div className="p-8 text-center text-sm text-red-400">Error fetching tasks</div>;

  return (
    <div className="m-5 p-4">
      <ModalNewTask
        isOpen={isModalNewTaskOpen}
        onClose={() => setIsModalNewTaskOpen(false)}
      />
      <Header
        name="Priority Page"
        buttonComponent={
          <button
            className="mr-3 rounded-lg bg-blue-primary px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 transition-colors shadow-sm"
            onClick={() => setIsModalNewTaskOpen(true)}
          >
            Add Task
          </button>
        }
      />

      <div className="mb-4 mt-4 flex justify-start gap-1 p-1 bg-gray-100 dark:bg-dark-secondary rounded-lg w-fit border border-gray-200/50 dark:border-stroke-dark/50 select-none">
        <button
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${view === "list"
            ? "bg-white text-gray-900 shadow-sm dark:bg-dark-tertiary dark:text-white"
            : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            }`}
          onClick={() => setView("list")}
        >
          List
        </button>
        <button
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${view === "table"
            ? "bg-white text-gray-900 shadow-sm dark:bg-dark-tertiary dark:text-white"
            : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            }`}
          onClick={() => setView("table")}
        >
          Table
        </button>
      </div>
      {isLoading ? (
        <div className="p-8 text-center text-sm text-gray-400">Loading tasks....</div>
      ) : view === "list" ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredTask?.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        view === "table" &&
        filteredTask && (
          <div className="shadow-sm border border-gray-205/60 dark:border-stroke-dark rounded-xl overflow-hidden bg-white dark:bg-dark-secondary">
            <CustomTable
              data={filteredTask}
              columns={columns}
              searchPlaceholder="Search task titles..."
              searchField="title"
            />
          </div>
        )
      )}
    </div>
  );
};

export default DynamicPriorityPage;
