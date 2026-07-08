import { Task } from "@/state/api";
import { format } from "date-fns";
import Image from "next/image";
import React from "react";
import { Calendar, User, Tag, Shield, Bookmark } from "lucide-react";

type Props = {
  task: Task;
};

const TaskCard = ({ task }: Props) => {
  const formattedStartDate = task.startDate
    ? format(new Date(task.startDate), "MMM dd, yyyy")
    : null;
  const formattedDueDate = task.dueDate
    ? format(new Date(task.dueDate), "MMM dd, yyyy")
    : null;

  return (
    <div className="dark:bg-dark-secondary mb-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-stroke-dark dark:text-white">
      {task.attachments && task.attachments.length > 0 && (
        <div className="mb-4 overflow-hidden rounded-lg">
          <Image
            src={`/${task.attachments[0].fileUrl}`}
            alt={task.attachments[0].fileName}
            width={400}
            height={200}
            className="h-48 w-full object-cover transition-transform hover:scale-105 duration-300"
          />
        </div>
      )}

      <div className="flex flex-col gap-3">
        {/* Header: Title and ID */}
        <div className="flex items-start justify-between gap-4">
          <h4 className="text-base font-bold text-gray-900 dark:text-white transition-colors">
            {task.title}
          </h4>
          <span className="shrink-0 rounded-full bg-gray-150/60 px-2 py-0.5 text-xs font-semibold text-gray-700 dark:bg-dark-tertiary dark:text-gray-300">
            N-{task.id}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-neutral-400 line-clamp-3">
          {task.description || "No description provided"}
        </p>

        <div className="my-1 border-t border-gray-100 dark:border-stroke-dark" />

        {/* Metadata Details Grid */}
        <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-xs">
          {/* Status */}
          <div className="flex items-center gap-2 text-gray-500 dark:text-neutral-400">
            <Bookmark className="h-4 w-4 shrink-0 text-blue-500" />
            <div className="truncate">
              <span className="font-medium text-gray-400">Status:</span>{" "}
              <span className="rounded bg-sky-50 px-1.5 py-0.5 text-[10px] font-semibold text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 uppercase">
                {task.status}
              </span>
            </div>
          </div>

          {/* Priority */}
          <div className="flex items-center gap-2 text-gray-500 dark:text-neutral-400">
            <Shield className="h-4 w-4 shrink-0 text-purple-500" />
            <div className="truncate">
              <span className="font-medium text-gray-400">Priority:</span>{" "}
              <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${task.priority === "Urgent"
                  ? "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300"
                  : task.priority === "High"
                    ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                    : task.priority === "Medium"
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                      : "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                }`}>
                {task.priority || "None"}
              </span>
            </div>
          </div>

          {/* Start Date */}
          <div className="flex items-center gap-2 text-gray-500 dark:text-neutral-400">
            <Calendar className="h-4 w-4 shrink-0 text-gray-400" />
            <div className="truncate">
              <span className="font-medium text-gray-400">Started:</span>{" "}
              <span className="text-gray-700 dark:text-gray-300">{formattedStartDate || "Not set"}</span>
            </div>
          </div>

          {/* Due date */}
          <div className="flex items-center gap-2 text-gray-500 dark:text-neutral-400">
            <Calendar className="h-4 w-4 shrink-0 text-red-400" />
            <div className="truncate">
              <span className="font-medium text-gray-400">Due:</span>{" "}
              <span className="text-gray-700 dark:text-gray-300">{formattedDueDate || "Not set"}</span>
            </div>
          </div>
        </div>

        <div className="mt-1 border-t border-gray-100 dark:border-stroke-dark" />

        {/* Stakeholders and Tags */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
          {/* People */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-gray-500 dark:text-neutral-400">
              <User className="h-3.5 w-3.5" />
              <span>Assignee: <span className="font-semibold text-gray-700 dark:text-gray-300">{task.assignee?.username || "Unassigned"}</span></span>
            </div>
            <div className="text-[10px] text-gray-400">
              By: {task.author?.username || "Unknown"}
            </div>
          </div>

          {/* Tags Badge */}
          {task.tags && (
            <div className="flex flex-wrap gap-1">
              {task.tags.split(",").map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-semibold text-blue-600 dark:bg-blue-950/40 dark:text-blue-300"
                >
                  <Tag className="h-2.5 w-2.5 shrink-0" />
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
