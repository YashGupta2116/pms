import { useCreateProjectMutation } from "@/state/api";
import React, { useState } from "react";
import Modal from "..";
import { formatISO } from "date-fns";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const ModalNewProject = ({ isOpen, onClose }: Props) => {
  const [createProject, { isLoading }] = useCreateProjectMutation();
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = async () => {
    if (!projectName || !startDate || !endDate) return;

    const formatedStartDate = formatISO(new Date(startDate), {
      representation: "complete",
    });
    const formatedEndDate = formatISO(new Date(endDate), {
      representation: "complete",
    });

    try {
      await createProject({
        name: projectName,
        description,
        startDate: formatedStartDate,
        endDate: formatedEndDate,
      }).unwrap();

      // Reset state fields
      setProjectName("");
      setDescription("");
      setStartDate("");
      setEndDate("");
      onClose();
    } catch (err: any) {
      alert(err?.data?.message || "Failed to create project");
    }
  };

  const isFormValid = () => {
    return projectName && description && startDate && endDate;
  };

  const inputStyles =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm shadow-sm transition-all placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-stroke-dark dark:bg-dark-tertiary dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-500 dark:focus:ring-blue-500 focus:outline-none";

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Create New Project">
      <form
        className="mt-2 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-wider">Project Name</label>
          <input
            className={inputStyles}
            type="text"
            placeholder="Enter project name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-wider">Description</label>
          <textarea
            className={inputStyles}
            rows={3}
            placeholder="Describe the project goals"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-wider">Start Date</label>
            <input
              className={inputStyles}
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-wider">End Date</label>
            <input
              className={inputStyles}
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          className={`bg-blue-primary hover:bg-blue-600 transition-colors w-full rounded-xl py-3 mt-4 text-sm font-semibold text-white shadow-md flex items-center justify-center gap-1.5 ${!isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""}`}
          disabled={!isFormValid() || isLoading}
        >
          {isLoading ? "Creating..." : "Create Project"}
        </button>
      </form>
    </Modal>
  );
};

export default ModalNewProject;
