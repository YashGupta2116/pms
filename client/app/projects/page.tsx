"use client";

import { useGetProjectsQuery } from "@/state/api";
import React, { useState } from "react";
import { useAppSelector } from "@/app/redux";
import Header from "@/components/Header";
import ModalNewProject from "@/components/Modal/ModalNewProject";
import ModalNewTeam from "@/components/Modal/ModalNewTeam";
import { Briefcase, Calendar, Plus } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

const ProjectsPage = () => {
  const currentUser = useAppSelector((state) => state.auth.user);
  const [isModalNewProjectOpen, setIsModalNewProjectOpen] = useState(false);
  const [isModalNewTeamOpen, setIsModalNewTeamOpen] = useState(false);

  const {
    data: projects,
    isLoading,
    isError,
  } = useGetProjectsQuery();

  if (isLoading) {
    return <div className="p-8 text-center text-sm text-gray-400">Loading projects...</div>;
  }

  if (isError) {
    return <div className="p-8 text-center text-sm text-red-400">Failed to load projects. Please try again.</div>;
  }

  return (
    <div className="flex w-full flex-col p-8 bg-gray-50/30 dark:bg-dark-bg min-h-screen">
      <ModalNewProject
        isOpen={isModalNewProjectOpen}
        onClose={() => setIsModalNewProjectOpen(false)}
      />
      <ModalNewTeam
        isOpen={isModalNewTeamOpen}
        onClose={() => setIsModalNewTeamOpen(false)}
      />

      <div className="flex items-center justify-between">
        <Header name="Projects" />
        {currentUser?.teamId && (
          <button
            onClick={() => setIsModalNewProjectOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-blue-primary px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-600 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Create Project
          </button>
        )}
      </div>

      {!currentUser?.teamId ? (
        <div className="mt-8 flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-dark-secondary rounded-2xl border border-gray-200/60 dark:border-stroke-dark shadow-sm max-w-xl mx-auto w-full">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 mb-4">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Not Part of a Team</h3>
          <p className="mt-2 text-xs text-gray-500 dark:text-neutral-400 max-w-sm">
            To view or create projects, you need to belong to a team. Create a team or join an existing one to proceed.
          </p>
          <div className="mt-5 flex gap-3">
            <button
              onClick={() => setIsModalNewTeamOpen(true)}
              className="flex items-center justify-center rounded-xl bg-blue-primary px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-600 transition-all cursor-pointer"
            >
              Create Team
            </button>
            <Link
              href="/teams"
              className="flex items-center justify-center rounded-xl border border-gray-200 bg-white dark:border-stroke-dark dark:bg-dark-tertiary px-4 py-2 text-xs font-bold text-gray-700 dark:text-white shadow-sm hover:bg-gray-50 dark:hover:bg-dark-secondary transition-all"
            >
              Join Team
            </Link>
          </div>
        </div>
      ) : !projects || projects.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-dark-secondary rounded-2xl border border-gray-200/60 dark:border-stroke-dark shadow-sm max-w-xl mx-auto w-full">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 mb-4">
            <Briefcase className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">No Projects Found</h3>
          <p className="mt-2 text-xs text-gray-500 dark:text-neutral-400 max-w-sm">
            Your team doesn't have any projects assigned to it yet. Create your first project to start tracking your work.
          </p>
          <button
            onClick={() => setIsModalNewProjectOpen(true)}
            className="mt-5 flex items-center justify-center rounded-xl bg-blue-primary px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-600 transition-all cursor-pointer"
          >
            Create Project
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            let dateStr = "";
            if (project.startDate && project.endDate) {
              try {
                dateStr = `${format(new Date(project.startDate), "MMM dd")} - ${format(new Date(project.endDate), "MMM dd, yyyy")}`;
              } catch {
                dateStr = `${project.startDate} - ${project.endDate}`;
              }
            }

            return (
              <Link key={project.id} href={`/projects/${project.id}`} className="group">
                <div className="h-full rounded-2xl border border-gray-200/60 dark:border-stroke-dark bg-white dark:bg-dark-secondary p-6 shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md hover:border-blue-500/30 dark:hover:border-blue-500/20">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 group-hover:text-blue-primary dark:text-white transition-colors">
                        {project.name}
                      </h4>
                      {dateStr && (
                        <div className="mt-1 flex items-center gap-1 text-[10px] text-gray-400 dark:text-neutral-500">
                          <Calendar className="h-3 w-3" />
                          <span>{dateStr}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {project.description && (
                    <p className="mt-4 text-xs text-gray-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  )}
                  <div className="mt-6 flex items-center justify-end text-[10px] font-bold text-blue-primary group-hover:underline">
                    View Project Details →
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
