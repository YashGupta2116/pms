import {
  Priority,
  Status,
  useCreateProjectMutation,
  useCreateTaskMutation,
} from "@/state/api";
import React, { useState } from "react";
import Modal from "..";
import { formatISO } from "date-fns";

type Props = {
  id?: string | null;
  isOpen: boolean;
  onClose: () => void;
  selectedStatus?: typeof Status;
};

const ModalNewTask = ({ id = null, isOpen, onClose }: Props) => {
  const [createTask, { isLoading }] = useCreateTaskMutation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Status>(Status.ToDo);
  const [priority, setPriority] = useState<Priority>(Priority.Backlog);
  const [tags, setTags] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [authorUserId, setAuthorUserId] = useState("");
  const [assignedUserId, setAssignedUserId] = useState("");
  const [projectId, setProjectId] = useState("");

  const handleSubmit = async () => {
    if (!title && !authorUserId) return;

    const formatedStartDate = formatISO(new Date(startDate), {
      representation: "complete",
    });
    const formatedDueDate = formatISO(new Date(dueDate), {
      representation: "complete",
    });

    await createTask({
      title,
      description,
      status,
      priority,
      tags,
      startDate: formatedStartDate,
      dueDate: formatedDueDate,
      projectId: id !== null ? Number(id) : Number(projectId),
      authorUserId: parseInt(authorUserId),
      assignedUserId: parseInt(assignedUserId),
    });
  };

  const isFormValid = () => {
    return !!title.trim() && !!authorUserId && !(id !== null || projectId);
  };

  const selectStyles =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm shadow-sm transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-stroke-dark dark:bg-dark-tertiary dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500 focus:outline-none";

  const inputStyles =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm shadow-sm transition-all placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-stroke-dark dark:bg-dark-tertiary dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-500 dark:focus:ring-blue-500 focus:outline-none";

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Create New Task">
      <form
        className="mt-2 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-wider">Title</label>
          <input
            className={inputStyles}
            type="text"
            placeholder="Enter task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-wider">Description</label>
          <textarea
            className={inputStyles}
            rows={2}
            placeholder="Describe the task instructions"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-wider">Status</label>
            <select
              className={selectStyles}
              value={status}
              onChange={(e) =>
                setStatus(Status[e.target.value as keyof typeof Status])
              }
            >
              <option value="">Select Status</option>
              <option value={Status.ToDo}>To Do</option>
              <option value={Status.WorkInProgress}>Work In Progress</option>
              <option value={Status.UnderReview}>Under Review</option>
              <option value={Status.Completed}>Completed</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-wider">Priority</label>
            <select
              className={selectStyles}
              value={priority}
              onChange={(e) =>
                setPriority(Priority[e.target.value as keyof typeof Priority])
              }
            >
              <option value="">Select Priority</option>
              <option value={Priority.Urgent}>Urgent</option>
              <option value={Priority.High}>High</option>
              <option value={Priority.Medium}>Medium</option>
              <option value={Priority.Low}>Low</option>
              <option value={Priority.Backlog}>Backlog</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-wider">Tags (Comma Separated)</label>
          <input
            className={inputStyles}
            type="text"
            placeholder="e.g. Frontend, Design, Bug"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
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
            <label className="text-[11px] font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-wider">Due Date</label>
            <input
              className={inputStyles}
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-wider">Author User ID</label>
            <input
              className={inputStyles}
              type="text"
              placeholder="e.g. 18"
              value={authorUserId}
              onChange={(e) => setAuthorUserId(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-wider">Assigned User ID</label>
            <input
              className={inputStyles}
              type="text"
              placeholder="e.g. 19"
              value={assignedUserId}
              onChange={(e) => setAssignedUserId(e.target.value)}
            />
          </div>
        </div>

        {id === null && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-wider">Project ID</label>
            <input
              className={inputStyles}
              type="text"
              placeholder="Enter numerical project ID"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
            />
          </div>
        )}

        <button
          type="submit"
          className={`bg-blue-primary hover:bg-blue-600 transition-colors w-full rounded-xl py-3 mt-4 text-sm font-semibold text-white shadow-md flex items-center justify-center gap-1.5 ${!isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""}`}
          disabled={!isFormValid() || isLoading}
        >
          {isLoading ? "Creating..." : "Create Task"}
        </button>
      </form>
    </Modal>
  );
};

export default ModalNewTask;
