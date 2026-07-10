"use client";

import React, { useState } from "react";
import Modal from "..";
import {
  Task,
  useCreateCommentMutation,
  useCreateAttachmentMutation,
} from "@/state/api";
import { useAppSelector } from "@/app/redux";
import { format } from "date-fns";
import { Send, Paperclip, CheckCircle2, AlertTriangle, Calendar, User as UserIcon } from "lucide-react";

type Props = {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
};

const ModalTaskDetail = ({ task, isOpen, onClose }: Props) => {
  const currentUser = useAppSelector((state) => state.auth.user);
  const [commentText, setCommentText] = useState("");
  const [createComment, { isLoading: isCommentLoading }] = useCreateCommentMutation();
  const [createAttachment, { isLoading: isAttachmentLoading }] = useCreateAttachmentMutation();

  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [showAttachmentForm, setShowAttachmentForm] = useState(false);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await createComment({
        taskId: task.id,
        text: commentText,
        userId: currentUser?.userId,
      }).unwrap();
      setCommentText("");
    } catch (err) {
      console.error("Failed to post comment:", err);
    }
  };

  const handleAddAttachment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName.trim() || !fileUrl.trim()) return;

    try {
      await createAttachment({
        taskId: task.id,
        fileURL: fileUrl,
        fileName: fileName,
        uploadedById: currentUser?.userId,
      }).unwrap();
      setFileName("");
      setFileUrl("");
      setShowAttachmentForm(false);
    } catch (err) {
      console.error("Failed to add attachment:", err);
    }
  };

  const formattedDueDate = task.dueDate
    ? format(new Date(task.dueDate), "MMM dd, yyyy")
    : "No due date";
  const formattedStartDate = task.startDate
    ? format(new Date(task.startDate), "MMM dd, yyyy")
    : "No start date";

  return (
    <Modal isOpen={isOpen} onClose={onClose} name={`Task Details: ${task.title}`}>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6 max-h-[80vh] overflow-y-auto pr-1">
        {/* MAIN DETAILS */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <h4 className="text-xs font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-wider">Description</h4>
            <p className="mt-1.5 text-sm text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50/50 dark:bg-dark-tertiary p-3.5 rounded-xl border border-gray-100 dark:border-stroke-dark/30">
              {task.description || "No description provided for this task."}
            </p>
          </div>

          {/* COMMENTS FEED */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-wider">Discussion</h4>
            <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1.5">
              {task.comments && task.comments.length > 0 ? (
                task.comments.map((comment) => (
                  <div key={comment.id} className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
                      {comment.user?.username.charAt(0).toUpperCase() || <UserIcon className="h-3 w-3" />}
                    </div>
                    <div className="bg-gray-50 dark:bg-dark-tertiary rounded-xl px-4 py-2.5 border border-gray-100 dark:border-stroke-dark/30 flex-1">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-xs font-bold text-gray-900 dark:text-white">
                          {comment.user?.username || `User #${comment.userId}`}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                        {comment.text}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-450 dark:text-neutral-500 text-center py-4">
                  No comments yet. Start the conversation below!
                </p>
              )}
            </div>

            {/* WRITE COMMENT */}
            <form onSubmit={handlePostComment} className="flex gap-2">
              <input
                type="text"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm transition-all placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-stroke-dark dark:bg-dark-tertiary dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={isCommentLoading || !commentText.trim()}
                className="bg-blue-primary text-white p-2.5 rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        {/* METADATA SIDEBAR */}
        <div className="space-y-6 bg-gray-50/50 dark:bg-dark-tertiary/40 p-4 rounded-xl border border-gray-100 dark:border-stroke-dark/20 h-fit">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 dark:text-neutral-500 font-semibold">Status</span>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300`}>
                {task.status || "To Do"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 dark:text-neutral-500 font-semibold">Priority</span>
              <span className="inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold uppercase bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300">
                {task.priority || "Medium"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 dark:text-neutral-500 font-semibold">Assignee</span>
              <span className="text-xs text-gray-700 dark:text-gray-300 font-bold">
                {task.assignee?.username || "Unassigned"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 dark:text-neutral-500 font-semibold">Points</span>
              <span className="text-xs text-gray-700 dark:text-gray-300 font-bold">
                {task.points !== null && task.points !== undefined ? task.points : "-"}
              </span>
            </div>
            <hr className="border-gray-200 dark:border-stroke-dark/30" />
            <div className="flex items-center gap-2.5 text-xs text-gray-650 dark:text-neutral-400">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>Start: {formattedStartDate}</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-gray-650 dark:text-neutral-400">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>Due: {formattedDueDate}</span>
            </div>
          </div>

          {/* ATTACHMENTS LIST */}
          <div className="pt-4 border-t border-gray-200 dark:border-stroke-dark/30">
            <div className="flex items-center justify-between mb-2">
              <h5 className="text-xs font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-wider">Attachments</h5>
              <button
                type="button"
                onClick={() => setShowAttachmentForm(!showAttachmentForm)}
                className="text-[10px] text-blue-primary hover:underline font-bold"
              >
                {showAttachmentForm ? "Cancel" : "+ Add"}
              </button>
            </div>

            {showAttachmentForm && (
              <form onSubmit={handleAddAttachment} className="mb-4 space-y-2 bg-white dark:bg-dark-secondary p-3 rounded-lg border border-gray-200/50 dark:border-stroke-dark">
                <input
                  type="text"
                  placeholder="File Name (e.g. Design Spec)"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs placeholder:text-gray-450 dark:border-stroke-dark dark:bg-dark-tertiary dark:text-white focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Mock URL (e.g. docs.google.com/file)"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs placeholder:text-gray-450 dark:border-stroke-dark dark:bg-dark-tertiary dark:text-white focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isAttachmentLoading}
                  className="w-full bg-blue-primary text-white py-1 rounded-lg hover:bg-blue-600 transition-colors text-xs font-semibold"
                >
                  {isAttachmentLoading ? "Adding..." : "Add Attachment"}
                </button>
              </form>
            )}

            <div className="space-y-2">
              {task.attachments && task.attachments.length > 0 ? (
                task.attachments.map((attachment) => (
                  <a
                    key={attachment.id}
                    href={attachment.fileURL.startsWith("http") ? attachment.fileURL : `https://${attachment.fileURL}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-dark-secondary border border-gray-200/30 dark:border-stroke-dark/40 hover:border-blue-500 transition-colors text-xs text-gray-700 dark:text-gray-300"
                  >
                    <Paperclip className="h-3.5 w-3.5 text-gray-400" />
                    <span className="truncate flex-1 font-semibold">{attachment.fileName || "File"}</span>
                  </a>
                ))
              ) : (
                <p className="text-[10px] text-gray-450 dark:text-neutral-500">No attachments found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalTaskDetail;
