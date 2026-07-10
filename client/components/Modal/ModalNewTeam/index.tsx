import { useCreateTeamMutation } from "@/state/api";
import { useAppDispatch } from "@/app/redux";
import { updateUserTeamId } from "@/state/authSlice";
import React, { useState } from "react";
import Modal from "..";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const ModalNewTeam = ({ isOpen, onClose }: Props) => {
  const [createTeam, { isLoading }] = useCreateTeamMutation();
  const dispatch = useAppDispatch();
  const [teamName, setTeamName] = useState("");

  const handleSubmit = async () => {
    if (!teamName) return;

    try {
      const newTeam = await createTeam({
        teamName,
      }).unwrap();

      dispatch(updateUserTeamId({ teamId: newTeam.id }));

      setTeamName("");
      onClose();
    } catch (err: any) {
      alert(err?.data?.message || "Failed to create team");
    }
  };

  const inputStyles =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm shadow-sm transition-all placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-stroke-dark dark:bg-dark-tertiary dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-500 dark:focus:ring-blue-500 focus:outline-none";

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Create New Team">
      <form
        className="mt-2 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-wider">
            Team Name
          </label>
          <input
            className={inputStyles}
            type="text"
            placeholder="Enter team name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className={`bg-blue-primary hover:bg-blue-600 transition-colors w-full rounded-xl py-3 mt-4 text-sm font-semibold text-white shadow-md flex items-center justify-center gap-1.5 ${!teamName || isLoading ? "cursor-not-allowed opacity-50" : ""}`}
          disabled={!teamName || isLoading}
        >
          {isLoading ? "Creating..." : "Create Team"}
        </button>
      </form>
    </Modal>
  );
};

export default ModalNewTeam;
