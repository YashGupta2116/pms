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
    "mb-4 block w-full rounded border border-gray-300 px-3 py-2 dark:border-dark-tertairy dark:bg-dark-tertairy dark:text-white dark:focus:outline-none";

  const inputStyles =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Create New Task">
      <form
        className="mt-4 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <input
          className={inputStyles}
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className={inputStyles}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
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

        <input
          className={inputStyles}
          type="text"
          placeholder="Tags (Comma Seperated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <input
            className={inputStyles}
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            className={inputStyles}
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <input
          className={inputStyles}
          type="text"
          placeholder="Author User Id"
          value={authorUserId}
          onChange={(e) => setAuthorUserId(e.target.value)}
        />
        <input
          className={inputStyles}
          type="text"
          placeholder="Assigned User Id"
          value={assignedUserId}
          onChange={(e) => setAssignedUserId(e.target.value)}
        />
        {id === null && (
          <input
            className={inputStyles}
            type="text"
            placeholder="Project Id"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          />
        )}
        <button
          type="submit"
          className={`bg-blue-primary focus:outline-non focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:ring-2 focus:ring-blue-600 focus:outline-none ${!isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""}`}
          disabled={!isFormValid() || isLoading}
        >
          {isLoading ? "Creating..." : "Create Task"}
        </button>
      </form>
    </Modal>
  );
};

export default ModalNewTask;
