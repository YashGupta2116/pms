import { CustomTable, ColumnDef } from "@/components/CustomTable";
import Header from "@/components/Header";
import { useGetTasksQuery, Task } from "@/state/api";
import React from "react";
import { format } from "date-fns";
import { Tag, Shield, Bookmark, Calendar, User } from "lucide-react";

type Props = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
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

const TableView = ({ id, setIsModalNewTaskOpen }: Props) => {
  const {
    data: tasks,
    error,
    isLoading,
  } = useGetTasksQuery({ projectId: Number(id) });

  if (isLoading) return <div className="p-8 text-center text-sm text-gray-400">Loading tasks...</div>;
  if (error || !tasks) return <div className="p-8 text-center text-sm text-red-400">An error occurred while fetching tasks</div>;

  return (
    <div className="w-full px-4 pb-8 xl:px-6">
      <div className="pt-4 pb-4">
        <Header
          name="Table View"
          buttonComponent={
            <button
              className="bg-blue-primary flex items-center rounded-lg px-4 py-2 text-white hover:bg-blue-600 transition-colors text-sm font-semibold shadow-sm"
              onClick={() => setIsModalNewTaskOpen(true)}
            >
              Add Task
            </button>
          }
          isSmallText
        />
      </div>
      <div className="shadow-sm border border-gray-205/60 dark:border-stroke-dark rounded-xl overflow-hidden bg-white dark:bg-dark-secondary">
        <CustomTable
          data={tasks || []}
          columns={columns}
          searchPlaceholder="Search task titles..."
          searchField="title"
        />
      </div>
    </div>
  );
};

export default TableView;
