"use client";

import React, { useState } from "react";
import Modal from "..";
import { Team, useGetUsersQuery, useUpdateUserTeamMutation } from "@/state/api";
import { Copy, Check, Search, UserPlus } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  team: Team;
};

const ModalInviteTeam = ({ isOpen, onClose, team }: Props) => {
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: users, isLoading: isUsersLoading } = useGetUsersQuery();
  const [updateUserTeam, { isLoading: isUpdating }] = useUpdateUserTeamMutation();

  const handleCopyId = () => {
    navigator.clipboard.writeText(String(team.id));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddUser = async (userId: number) => {
    try {
      await updateUserTeam({
        userId,
        teamId: team.id,
      }).unwrap();
      alert("User added to team successfully!");
    } catch (err: any) {
      alert(err?.data?.message || "Failed to add user to team");
    }
  };

  // Filter users: exclude those already in the team and match search query
  const eligibleUsers = React.useMemo(() => {
    if (!users) return [];
    return users.filter((u) => {
      const isAlreadyInTeam = u.teamId === team.id;
      const matchesSearch =
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase());
      return !isAlreadyInTeam && matchesSearch;
    });
  }, [users, team.id, searchQuery]);

  const searchInputStyles =
    "w-full rounded-xl border border-gray-200 bg-white px-9 py-2 text-xs placeholder-gray-400 outline-none transition-all focus:border-blue-500 dark:border-stroke-dark dark:bg-dark-tertiary dark:text-white dark:placeholder-neutral-500";

  return (
    <Modal isOpen={isOpen} onClose={onClose} name={`Invite to "${team.teamName}"`}>
      <div className="space-y-6">
        {/* SHARE TEAM ID */}
        <div className="rounded-xl bg-gray-50 p-4 dark:bg-dark-tertiary/40 border border-gray-100 dark:border-stroke-dark/30">
          <h4 className="text-xs font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-wider mb-2">
            Share Team ID
          </h4>
          <p className="text-xs text-gray-500 dark:text-neutral-400 mb-3">
            Give this ID to other users so they can join this team using the "Join Team (by ID)" button.
          </p>
          <div className="flex items-center justify-between bg-white dark:bg-dark-secondary rounded-lg border border-gray-200/65 dark:border-stroke-dark p-2">
            <span className="font-mono text-sm font-bold text-gray-900 dark:text-white pl-2">
              {team.id}
            </span>
            <button
              onClick={handleCopyId}
              className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold bg-gray-50 hover:bg-gray-100 dark:bg-dark-tertiary dark:hover:bg-dark-secondary text-gray-700 dark:text-white border border-gray-200/50 dark:border-stroke-dark/50 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy ID</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ADD MEMBERS DIRECTLY */}
        <div>
          <h4 className="text-xs font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-wider mb-3">
            Add Members Directly
          </h4>

          {/* Search bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400 dark:text-neutral-500" />
            <input
              type="text"
              placeholder="Search user by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={searchInputStyles}
            />
          </div>

          {/* Users List */}
          <div className="max-h-[220px] overflow-y-auto pr-1 space-y-2">
            {isUsersLoading ? (
              <p className="text-xs text-gray-405 text-center py-4">Loading users...</p>
            ) : eligibleUsers.length === 0 ? (
              <p className="text-xs text-gray-450 dark:text-neutral-500 text-center py-4">
                No users found.
              </p>
            ) : (
              eligibleUsers.map((user) => (
                <div
                  key={user.userId}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-gray-200/30 dark:border-stroke-dark bg-white dark:bg-dark-secondary hover:border-gray-300 dark:hover:border-neutral-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-gray-900 dark:text-white">
                        {user.username}
                      </h5>
                      <p className="text-[10px] text-gray-500 dark:text-neutral-500">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddUser(user.userId!)}
                    disabled={isUpdating}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-bold bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/30 dark:hover:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-950/50 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalInviteTeam;
