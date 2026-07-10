"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/state";
import { useGetProjectsQuery, useGetActivitiesQuery, useGetTeamsQuery } from "@/state/api";
import { format } from "date-fns";
import {
  AlertCircle,
  AlertOctagon,
  AlertTriangle,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Home,
  Layers3,
  LockIcon,
  LucideIcon,
  Search,
  Settings,
  ShieldAlert,
  User,
  Users,
  X,
  PlusSquare,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import ModalNewProject from "./Modal/ModalNewProject/index";

const Sidebar = () => {
  const [showProjects, setShowProjects] = useState(true);
  const [showPriority, setShowPriority] = useState(true);
  const [showActivities, setShowActivities] = useState(true);
  const [isModalNewProjectOpen, setIsModalNewProjectOpen] = useState(false);

  const currentUser = useAppSelector((state) => state.auth.user);
  const { data: projects } = useGetProjectsQuery();
  const { data: teams } = useGetTeamsQuery();
  const { data: activities } = useGetActivitiesQuery(undefined, {
    pollingInterval: 60000 * 10,
  });

  const userTeam = teams?.find((t) => t.id === currentUser?.teamId);

  const isLeader = !!currentUser?.isLeader;

  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );

  const sidebarClassNames = `fixed flex flex-col h-[100%] justify-between shadow-xl
    transition-all duration-300 h-full z-50 dark:bg-dark-bg overflow-y-auto bg-white
    ${isSidebarCollapsed ? "w-0 hidden" : "w-64"}
  `;

  return (
    <div className={sidebarClassNames}>
      <ModalNewProject
        isOpen={isModalNewProjectOpen}
        onClose={() => setIsModalNewProjectOpen(false)}
      />
      <div className="flex h-[100%] w-full flex-col justify-start">
        {/* TOP LOGO */}
        <div className="z-50 flex min-h-[56px] w-64 items-center justify-between bg-white px-6 pt-3 dark:bg-dark-bg">
          <div className="text-xl font-black tracking-wider bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">
            PROMANAGE
          </div>
          {isSidebarCollapsed ? null : (
            <button
              className="py-3"
              onClick={() => {
                dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
              }}
            >
              <X className="h-5 w-5 text-gray-800 hover:text-gray-500 dark:text-neutral-300 dark:hover:text-white" />
            </button>
          )}
        </div>
        {/* TEAM */}
        <div className="flex items-center gap-5 border-y-[1.5px] border-gray-200 px-8 py-4 dark:border-gray-700">
          <Image src="/logo.png" alt="Logo" width={40} height={40} />
          <div>
            <h3 className="text-md font-bold tracking-wide dark:text-gray-200">
              {userTeam?.teamName?.toUpperCase() || "WORKSPACE"}
            </h3>
            <div className="mt-1 flex items-start gap-2">
              <LockIcon className="mt-[0.1rem] h-3 w-3 text-gray-500 dark:text-gray-400" />
              <p className="text-xs text-gray-500">Private</p>
            </div>
          </div>
        </div>
        {/* NAVBAR LINKS */}
        <nav className="z-10 w-full">
          <SidebarLink icon={Home} label="Home" href="/" />
          <SidebarLink icon={Briefcase} label="Timeline" href="/timeline" />
          <SidebarLink icon={Search} label="Search" href="/search" />
          <SidebarLink icon={Settings} label="Settings" href="/settings" />
          <SidebarLink icon={User} label="Users" href="/users" />
          <SidebarLink icon={Users} label="Teams" href="/teams" />
        </nav>

        {/* PROJECTS LINKS */}
        <div className="flex w-full items-center justify-between px-8 py-3.5 text-gray-500 border-t border-gray-100 dark:border-stroke-dark/30 mt-2">
          <button
            onClick={() => setShowProjects((prev) => !prev)}
            className="flex items-center gap-2 hover:text-gray-900 dark:hover:text-white"
          >
            <span className="font-semibold text-sm">Projects</span>
            {showProjects ? (
              <ChevronUp className="h-4.5 w-4.5" />
            ) : (
              <ChevronDown className="h-4.5 w-4.5" />
            )}
          </button>
          <button
            onClick={() => setIsModalNewProjectOpen(true)}
            className="p-1 hover:bg-gray-100 rounded-md transition-colors dark:hover:bg-dark-secondary hover:text-gray-900 dark:hover:text-white cursor-pointer"
            title="Create Project"
          >
            <PlusSquare className="h-4.5 w-4.5 text-blue-500 hover:text-blue-600" />
          </button>
        </div>
        {/* PROJECTS LIST */}
        {showProjects &&
          projects?.map((project) => (
            <SidebarLink
              key={project.id}
              icon={Briefcase}
              label={project.name}
              href={`/projects/${project.id}`}
            />
          ))}
        {/* PRIORITIES LINKS */}
        <button
          onClick={() => setShowPriority((prev) => !prev)}
          className="flex w-full items-center justify-between px-8 py-3 text-gray-500"
        >
          <span className="">Priority</span>
          {showPriority ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>
        {showPriority && (
          <>
            <SidebarLink
              icon={AlertCircle}
              label="Urgent"
              href="/priority/urgent"
            />
            <SidebarLink
              icon={ShieldAlert}
              label="High"
              href="/priority/high"
            />
            <SidebarLink
              icon={AlertTriangle}
              label="Medium"
              href="/priority/medium"
            />
            <SidebarLink icon={AlertOctagon} label="Low" href="/priority/low" />
            <SidebarLink
              icon={Layers3}
              label="Backlog"
              href="/priority/backlog"
            />
          </>
        )}

        {/* RECENT ACTIVITY */}
        <button
          onClick={() => setShowActivities((prev) => !prev)}
          className="flex w-full items-center justify-between px-8 py-3 text-gray-505 dark:text-neutral-400 border-t border-gray-100 dark:border-stroke-dark/30 mt-2"
        >
          <span className="font-semibold text-sm">Recent Activity</span>
          {showActivities ? (
            <ChevronUp className="h-4.5 w-4.5" />
          ) : (
            <ChevronDown className="h-4.5 w-4.5" />
          )}
        </button>

        {showActivities && (
          <div className="px-8 py-2 space-y-4 max-h-[220px] overflow-y-auto pr-2">
            {activities && activities.length > 0 ? (
              activities.slice(0, 8).map((activity) => (
                <div key={activity.id} className="relative pl-4 border-l-2 border-blue-100 dark:border-stroke-dark/50 pb-2">
                  <div className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-blue-500" />
                  <p className="text-[10px] font-bold text-gray-800 dark:text-gray-200">
                    {activity.username}
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-neutral-400 leading-tight">
                    {activity.action}
                  </p>
                  <span className="text-[8px] text-gray-400 dark:text-neutral-500">
                    {format(new Date(activity.timestamp), "HH:mm")}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-[10px] text-gray-400 dark:text-neutral-500">No recent activity.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

const SidebarLink = ({ href, icon: Icon, label }: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive =
    pathname === href || (pathname === "/" && href === "/dashboard");

  return (
    <Link href={href} className="w-full">
      <div
        className={`relative flex cursor-pointer items-center gap-3.5 transition-all duration-200 justify-start px-8 py-3
          ${isActive
            ? "bg-blue-50/60 text-blue-600 dark:bg-blue-950/15 dark:text-blue-400"
            : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-dark-secondary/40"
          }`}
      >
        {isActive && (
          <div className="absolute top-0 left-0 h-full w-[4px] bg-blue-600 dark:bg-blue-500" />
        )}

        <Icon className={`h-5 w-5 transition-colors ${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}`} />
        <span className={`font-semibold text-sm transition-colors ${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-200"}`}>
          {label}
        </span>
      </div>
    </Link>
  );
};

export default Sidebar;
