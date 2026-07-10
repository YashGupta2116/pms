"use client";

import Header from "@/components/Header";
import React, { useState } from "react";
import { User, Mail, Shield, Briefcase, Settings2, Users2, ShieldAlert } from "lucide-react";
import { useAppSelector } from "@/app/redux";
import {
  useGetTeamsQuery,
  useGetUsersQuery,
  useGetProjectsQuery,
  useUpdateUserTeamMutation,
  useUpdateTeamLeadershipMutation,
  useAssignTeamToProjectMutation,
  useRemoveTeamFromProjectMutation,
} from "@/state/api";

const Settings = () => {
  const currentUser = useAppSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = useState("personal");

  const { data: teams, isLoading: isTeamsLoading } = useGetTeamsQuery();
  const { data: users, isLoading: isUsersLoading } = useGetUsersQuery();
  const { data: projects, isLoading: isProjectsLoading } = useGetProjectsQuery();

  const [updateUserTeam, { isLoading: isUserTeamUpdating }] = useUpdateUserTeamMutation();
  const [updateTeamLeadership, { isLoading: isLeadershipUpdating }] = useUpdateTeamLeadershipMutation();
  const [assignTeamToProject, { isLoading: isAssigningTeam }] = useAssignTeamToProjectMutation();
  const [removeTeamFromProject, { isLoading: isRemovingTeam }] = useRemoveTeamFromProjectMutation();

  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState("");

  const [leadTeamId, setLeadTeamId] = useState("");
  const [productOwnerId, setProductOwnerId] = useState("");
  const [projectManagerId, setProjectManagerId] = useState("");

  const [projProjectId, setProjProjectId] = useState("");
  const [projTeamId, setProjTeamId] = useState("");

  const userTeam = teams?.find((t) => t.id === currentUser?.teamId);

  const roleName = currentUser?.role || (currentUser?.teamId ? "Team Member" : "No Team Assigned");

  const isLeader = !!currentUser?.isLeader;

  const handleUpdateUserTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !selectedTeamId) return;
    try {
      await updateUserTeam({
        userId: Number(selectedUserId),
        teamId: selectedTeamId === "none" ? null : Number(selectedTeamId),
      }).unwrap();
      alert("User team updated successfully!");
    } catch (err: any) {
      alert(`Error updating user team: ${err.data?.message || err.message}`);
    }
  };

  const handleUpdateTeamLeadership = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadTeamId) return;
    try {
      await updateTeamLeadership({
        teamId: Number(leadTeamId),
        productOwnerUserId: productOwnerId ? Number(productOwnerId) : null,
        projectManagerUserId: projectManagerId ? Number(projectManagerId) : null,
      }).unwrap();
      alert("Team leadership re-assigned successfully!");
    } catch (err: any) {
      alert(`Error updating team leadership: ${err.data?.message || err.message}`);
    }
  };

  const handleProjectTeamAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projProjectId || !projTeamId) return;
    try {
      await assignTeamToProject({
        projectId: Number(projProjectId),
        teamId: Number(projTeamId),
      }).unwrap();
      alert("Team linked to project successfully!");
    } catch (err: any) {
      alert(`Error linking team: ${err.data?.message || err.message}`);
    }
  };

  const handleProjectTeamRemove = async () => {
    if (!projProjectId || !projTeamId) return;
    try {
      await removeTeamFromProject({
        projectId: Number(projProjectId),
        teamId: Number(projTeamId),
      }).unwrap();
      alert("Team unassigned from project successfully!");
    } catch (err: any) {
      alert(`Error unlinking team: ${err.data?.message || err.message}`);
    }
  };

  const labelStyles = "block text-xs font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-wider mb-1.5";
  const containerStyles = "flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg p-3 dark:bg-dark-secondary dark:border-stroke-dark transition-all hover:bg-gray-100/50 dark:hover:bg-dark-secondary/80";
  const textStyles = "text-sm font-medium text-gray-900 dark:text-white";
  const selectStyles = "w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm shadow-sm transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-stroke-dark dark:bg-dark-tertiary dark:text-white focus:outline-none cursor-pointer";
  const buttonStyles = "bg-blue-primary hover:bg-blue-600 transition-colors rounded-xl px-6 py-2.5 text-sm font-semibold text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <Header name="Settings" />
        <div className="flex border border-gray-200/80 dark:border-stroke-dark rounded-xl overflow-hidden shadow-sm bg-white dark:bg-dark-secondary">
          <button
            onClick={() => setActiveTab("personal")}
            className={`px-4 py-2.5 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${activeTab === "personal" ? "bg-blue-primary text-white" : "text-gray-500 hover:text-gray-900 dark:hover:text-white"}`}
          >
            <Settings2 className="h-4 w-4" /> Personal
          </button>
          <button
            onClick={() => setActiveTab("workspace")}
            className={`px-4 py-2.5 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${activeTab === "workspace" ? "bg-blue-primary text-white" : "text-gray-500 hover:text-gray-900 dark:hover:text-white"}`}
          >
            <Users2 className="h-4 w-4" /> Workspace Admin
          </button>
        </div>
      </div>

      {activeTab === "personal" ? (
        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm dark:bg-dark-bg dark:border-stroke-dark space-y-6 mt-6 max-w-2xl">
          <div>
            <label className={labelStyles}>Username</label>
            <div className={containerStyles}>
              <User className="h-4 w-4 text-gray-400 shrink-0" />
              <div className={textStyles}>{currentUser?.username || "N/A"}</div>
            </div>
          </div>
          <div>
            <label className={labelStyles}>Email Address</label>
            <div className={containerStyles}>
              <Mail className="h-4 w-4 text-gray-400 shrink-0" />
              <div className={textStyles}>{currentUser?.email || "N/A"}</div>
            </div>
          </div>
          <div>
            <label className={labelStyles}>Team</label>
            <div className={containerStyles}>
              <Briefcase className="h-4 w-4 text-gray-400 shrink-0" />
              <div className={textStyles}>
                {isTeamsLoading ? "Loading..." : userTeam?.teamName || "No Team Assigned"}
              </div>
            </div>
          </div>
          <div>
            <label className={labelStyles}>Role</label>
            <div className={containerStyles}>
              <Shield className="h-4 w-4 text-gray-405 shrink-0" />
              <div className={textStyles}>{roleName}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col items-center justify-center p-8 bg-white border border-gray-205 rounded-xl shadow-sm dark:bg-dark-secondary dark:border-stroke-dark space-y-4 max-w-md mt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-500 dark:bg-amber-950/40 dark:text-amber-400">
              <svg className="h-6 w-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Workspace Admin Panel</h3>
            <p className="text-xs text-gray-500 dark:text-neutral-400 text-center max-w-xs leading-relaxed">
              We are currently redesigning the workspace administrative controls to support dynamic self-service roles. This page is under construction.
            </p>
            <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold uppercase text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 font-mono">
              Work in Progress
            </span>
          </div>

          {/* Commented out original forms for future integration */}
          {/*
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-40 pointer-events-none">
            <div className="bg-white dark:bg-dark-secondary rounded-xl border border-gray-200/50 dark:border-stroke-dark p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Settings2 className="h-5 w-5 text-blue-primary" /> Assign Team Members
              </h3>
              <form onSubmit={handleUpdateUserTeam} className="space-y-4">
                <div>
                  <label className={labelStyles}>Select User</label>
                  <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    required
                    className={selectStyles}
                  >
                    <option value="">-- Choose User --</option>
                    {users?.map((u) => (
                      <option key={u.userId} value={u.userId}>
                        {u.username} (Team ID: {u.teamId || "None"})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelStyles}>Select Target Team</label>
                  <select
                    value={selectedTeamId}
                    onChange={(e) => setSelectedTeamId(e.target.value)}
                    required
                    className={selectStyles}
                  >
                    <option value="">-- Choose Team --</option>
                    <option value="none">None (Remove from team)</option>
                    {teams?.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.teamName}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={true}
                  className={buttonStyles}
                >
                  Save Member assignment
                </button>
              </form>
            </div>

            <div className="bg-white dark:bg-dark-secondary rounded-xl border border-gray-200/50 dark:border-stroke-dark p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-amber-500" /> Manage Team Leadership
              </h3>
              <form onSubmit={handleUpdateTeamLeadership} className="space-y-4">
                <div>
                  <label className={labelStyles}>Select Team</label>
                  <select
                    value={leadTeamId}
                    onChange={(e) => setLeadTeamId(e.target.value)}
                    required
                    className={selectStyles}
                  >
                    <option value="">-- Choose Team --</option>
                    {teams?.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.teamName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelStyles}>Product Owner (PO)</label>
                  <select
                    value={productOwnerId}
                    onChange={(e) => setProductOwnerId(e.target.value)}
                    className={selectStyles}
                  >
                    <option value="">-- Unassigned --</option>
                    {users?.map((u) => (
                      <option key={u.userId} value={u.userId}>
                        {u.username}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelStyles}>Project Manager (PM)</label>
                  <select
                    value={projectManagerId}
                    onChange={(e) => setProjectManagerId(e.target.value)}
                    className={selectStyles}
                  >
                    <option value="">-- Unassigned --</option>
                    {users?.map((u) => (
                      <option key={u.userId} value={u.userId}>
                        {u.username}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={true}
                  className={buttonStyles}
                >
                  Save Leadership
                </button>
              </form>
            </div>

            <div className="bg-white dark:bg-dark-secondary rounded-xl border border-gray-200/50 dark:border-stroke-dark p-6 shadow-sm space-y-4 md:col-span-2">
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-emerald-500" /> Delegate Projects to Teams
              </h3>
              <form onSubmit={handleProjectTeamAssign} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelStyles}>Select Project</label>
                    <select
                      value={projProjectId}
                      onChange={(e) => setProjProjectId(e.target.value)}
                      required
                      className={selectStyles}
                    >
                      <option value="">-- Choose Project --</option>
                      {projects?.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={labelStyles}>Select Team</label>
                    <select
                      value={projTeamId}
                      onChange={(e) => setProjTeamId(e.target.value)}
                      required
                      className={selectStyles}
                    >
                      <option value="">-- Choose Team --</option>
                      {teams?.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.teamName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={true}
                    className="bg-emerald-500 hover:bg-emerald-600 transition-colors rounded-xl px-6 py-2.5 text-sm font-semibold text-white shadow-md cursor-pointer disabled:opacity-50"
                  >
                    Link Team to Project
                  </button>
                  <button
                    type="button"
                    onClick={handleProjectTeamRemove}
                    disabled={true}
                    className="bg-red-500 hover:bg-red-600 transition-colors rounded-xl px-6 py-2.5 text-sm font-semibold text-white shadow-md cursor-pointer disabled:opacity-50"
                  >
                    Unlink Team from Project
                  </button>
                </div>
              </form>
            </div>
          </div>
          */}
        </div>
      )}
    </div>
  );
};

export default Settings;
