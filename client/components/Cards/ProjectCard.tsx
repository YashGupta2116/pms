import { Project } from "@/state/api";
import React from "react";
import { Calendar, Briefcase, ChevronRight } from "lucide-react";

type Props = {
  project: Project;
};

const ProjectCard = ({ project }: Props) => {
  return (
    <div className="dark:bg-dark-secondary rounded-xl border border-gray-150 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-blue-500/35 dark:hover:border-blue-500/35 hover:shadow-blue-500/5 dark:hover:shadow-blue-500/5 dark:border-stroke-dark dark:text-white">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
          <Briefcase className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-bold text-gray-950 dark:text-white text-base">
            {project.name}
          </h3>
          <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-mono dark:bg-dark-tertiary dark:text-gray-400">
            ID: {project.id}
          </span>
        </div>
      </div>

      <p className="text-sm text-gray-600 dark:text-neutral-400 mb-4 line-clamp-2 h-10 overflow-hidden">
        {project.description || "No description provided."}
      </p>

      <div className="flex items-center justify-between text-xs border-t border-gray-100 dark:border-stroke-dark pt-3 text-gray-500 dark:text-neutral-400">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-gray-400" />
            <span>Start: <span className="font-semibold text-gray-700 dark:text-gray-300">{project.startDate || "Not set"}</span></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-red-400" />
            <span>End: <span className="font-semibold text-gray-700 dark:text-gray-300">{project.endDate || "Not set"}</span></span>
          </div>
        </div>

        <ChevronRight className="h-5 w-5 text-gray-400 dark:text-neutral-500 hover:text-blue-600 dark:hover:text-white transition-colors" />
      </div>
    </div>
  );
};

export default ProjectCard;
