"use client";

import React, { useState } from "react";
import { useGetTeamsQuery, Team, useJoinTeamMutation } from "@/state/api";
import Header from "@/components/Header";
import { CustomTable, ColumnDef } from "@/components/CustomTable";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { updateUserTeamId } from "@/state/authSlice";
import ModalNewTeam from "@/components/Modal/ModalNewTeam";
import ModalInviteTeam from "@/components/Modal/ModalInviteTeam";
import { Plus } from "lucide-react";

type TeamWithUsernames = Team & {
  productOwnerUsername?: string;
  projectManagerUsername?: string;
};

const Teams = () => {
  const currentUser = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const [isModalNewTeamOpen, setIsModalNewTeamOpen] = useState(false);
  const [isModalInviteOpen, setIsModalInviteOpen] = useState(false);
  const [selectedInviteTeam, setSelectedInviteTeam] = useState<Team | null>(null);

  const { data: teams, isLoading, isError } = useGetTeamsQuery();
  const [joinTeam, { isLoading: isJoining }] = useJoinTeamMutation();

  const handleJoinTeam = async (teamId: number) => {
    if (!currentUser?.userId) return;
    try {
      await joinTeam(teamId).unwrap();

      dispatch(updateUserTeamId({ teamId }));
      alert("Joined team successfully!");
    } catch (err: any) {
      alert(err.data?.message || "Failed to join team");
    }
  };

  const columns: ColumnDef<TeamWithUsernames>[] = [
    {
      headerName: "Team ID",
      field: "id",
      className: "font-semibold text-gray-500",
    },
    {
      headerName: "Team Name",
      field: "teamName",
      className: "font-bold text-gray-900 dark:text-white text-sm",
    },
    {
      headerName: "Product Owner",
      field: "productOwnerUsername",
      className: "text-gray-700 dark:text-gray-355 dark:text-gray-300",
    },
    {
      headerName: "Project Manager",
      field: "projectManagerUsername",
      className: "text-gray-700 dark:text-gray-355 dark:text-gray-300",
    },
    {
      headerName: "Action",
      field: "id",
      renderCell: ({ row }) => {
        const isMyTeam = row.id === currentUser?.teamId;
        return (
          <div className="flex items-center gap-2">
            {isMyTeam ? (
              <>
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                  Current Team
                </span>
                <button
                  onClick={() => {
                    setSelectedInviteTeam(row);
                    setIsModalInviteOpen(true);
                  }}
                  className="cursor-pointer rounded-lg border border-gray-250/60 dark:border-stroke-dark bg-white dark:bg-dark-tertiary px-2.5 py-1 text-xs font-bold text-gray-650 dark:text-white hover:bg-gray-50 dark:hover:bg-dark-secondary transition-colors shadow-sm"
                >
                  Invite
                </button>
              </>
            ) : null}
          </div>
        );
      },
    },
  ];

  if (isLoading) return <div className="p-8 text-center text-sm text-gray-400">Loading teams...</div>;
  if (isError || !teams) return <div className="p-8 text-center text-sm text-red-400">Error fetching teams</div>;

  return (
    <div className="flex w-full flex-col p-8 bg-gray-50/30 dark:bg-dark-bg min-h-screen">
      <ModalNewTeam
        isOpen={isModalNewTeamOpen}
        onClose={() => setIsModalNewTeamOpen(false)}
      />
      {selectedInviteTeam && (
        <ModalInviteTeam
          isOpen={isModalInviteOpen}
          onClose={() => {
            setIsModalInviteOpen(false);
            setSelectedInviteTeam(null);
          }}
          team={selectedInviteTeam}
        />
      )}

      <div className="mb-6 flex items-center justify-between">
        <Header name="Teams" />
        <div className="flex gap-3">
          <button
            onClick={() => {
              const id = prompt("Enter the ID of the team you want to join:");
              if (id && !isNaN(Number(id))) {
                handleJoinTeam(Number(id));
              }
            }}
            className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white dark:border-stroke-dark dark:bg-dark-tertiary px-4 py-2.5 text-xs font-bold text-gray-700 dark:text-white shadow-sm hover:bg-gray-50 dark:hover:bg-dark-secondary transition-all cursor-pointer"
          >
            Join Team (by ID)
          </button>
          <button
            onClick={() => setIsModalNewTeamOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-blue-primary px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-600 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Create Team
          </button>
        </div>
      </div>

      {!currentUser?.teamId && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/50 p-4 text-sm font-semibold text-blue-700 dark:border-blue-950/30 dark:bg-blue-950/20 dark:text-blue-400">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40 text-xs font-black">!</span>
          <span>You are not currently member of any team. Create a new team, enter a Team ID in "Join Team (by ID)" at the top, or ask an existing member to invite you.</span>
        </div>
      )}

      <div className="shadow-sm border border-gray-200/60 dark:border-stroke-dark rounded-xl overflow-hidden bg-white dark:bg-dark-secondary">
        <CustomTable
          data={teams || []}
          columns={columns}
          searchPlaceholder="Search team names..."
          searchField="teamName"
        />
      </div>
    </div>
  );
};

export default Teams;
