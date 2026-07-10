import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, clearCredentials } from "./authSlice";

export interface Project {
  id: number;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export enum Status {
  ToDo = "To Do",
  WorkInProgress = "Work In Progress",
  UnderReview = "Under Review",
  Completed = "Completed",
}

export enum Priority {
  Urgent = "Urgent",
  High = "High",
  Medium = "Medium",
  Low = "Low",
  Backlog = "Backlog",
}

export interface User {
  userId?: number;
  username: string;
  email: string;
  profilePictureUrl?: string;
  teamId?: number;
  role?: "Product Owner" | "Project Manager" | "Team Member" | "Unassigned";
  isLeader?: boolean;
}

export interface Comment {
  id: number;
  text: string;
  taskId: number;
  userId: number;
  user?: {
    username: string;
    profilePictureUrl?: string;
  };
}

export interface Attachment {
  id: number;
  fileURL: string;
  fileName?: string;
  taskId: number;
  uploadedById: number;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status?: Status;
  priority?: Priority;
  tags?: string;
  startDate?: string;
  dueDate?: string;
  points?: number;
  projectId: number;
  authorUserId?: number;
  assignedUserId?: number;

  author?: User;
  assignee?: User;
  comments?: Comment[];
  attachments?: Attachment[];
}

export interface SearchResults {
  tasks?: Task[];
  projects?: Project[];
  users?: User[];
}

export interface ActivityLog {
  id: number;
  action: string;
  username: string;
  timestamp: string;
}

export interface Team {
  id: number;
  teamName: string;
  productOwnerUserId?: number;
  projectManagerUserId?: number;
}

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as any).auth?.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    // Attempt token refresh
    const refreshResult = await baseQuery(
      {
        url: "auth/refresh",
        method: "POST",
      },
      api,
      extraOptions,
    );
    if (refreshResult.data) {
      const data = refreshResult.data as { token: string; user: User };
      api.dispatch(setCredentials({ token: data.token, user: data.user }));
      // Retry original request
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(clearCredentials());
    }
  }
  return result;
};

export const api = createApi({
  baseQuery: baseQueryWithReauth,
  reducerPath: "api",
  tagTypes: ["Projects", "Tasks", "Users", "Teams"],
  endpoints: (build) => ({
    getProjects: build.query<Project[], void>({
      query: () => "projects",
      providesTags: ["Projects"],
    }),

    createProject: build.mutation<Project, Partial<Project>>({
      query: (project) => ({
        url: "projects",
        method: "POST",
        body: project,
      }),
      invalidatesTags: ["Projects"],
    }),

    getTasks: build.query<Task[], { projectId: number }>({
      query: ({ projectId }) => `tasks?projectId=${projectId}`,
      providesTags: (result) =>
        result
          ? result.map(({ id }) => ({ type: "Tasks" as const, id }))
          : [{ type: "Tasks" as const }],
    }),

    getUserTasks: build.query<Task[], number>({
      query: (userId) => `tasks/user/${userId}`,
      providesTags: (result, error, userId) =>
        result
          ? result.map(({ id }) => ({ type: "Tasks", id }))
          : [{ type: "Tasks", id: userId }],
    }),

    createTask: build.mutation<Task, Partial<Task>>({
      query: (task) => ({
        url: "tasks",
        method: "POST",
        body: task,
      }),
      invalidatesTags: ["Tasks"],
    }),

    updateTaskStatus: build.mutation<Task, { taskId: number; status: string }>({
      query: ({ taskId, status }) => ({
        url: `tasks/${taskId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: "Tasks", id: taskId },
      ],
    }),

    search: build.query<SearchResults, string>({
      query: (query) => `search?query=${query}`,
    }),

    getUsers: build.query<User[], void>({
      query: () => "users",
      providesTags: ["Users"],
    }),

    getTeams: build.query<Team[], void>({
      query: () => "teams",
      providesTags: ["Teams"],
    }),

    createTeam: build.mutation<Team, Partial<Team>>({
      query: (team) => ({
        url: "teams",
        method: "POST",
        body: team,
      }),
      invalidatesTags: ["Teams", "Users", "Projects"],
    }),

    joinTeam: build.mutation<{ message: string; user: User }, number>({
      query: (teamId) => ({
        url: `teams/${teamId}/join`,
        method: "POST",
      }),
      invalidatesTags: ["Teams", "Users", "Projects"],
    }),

    login: build.mutation<{ message: string; token: string; user: User }, any>({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    register: build.mutation<
      { message: string; token: string; user: User },
      any
    >({
      query: (userData) => ({
        url: "auth/register",
        method: "POST",
        body: userData,
      }),
    }),

    logout: build.mutation<{ message: string }, void>({
      query: () => ({
        url: "auth/logout",
        method: "POST",
      }),
    }),

    refresh: build.mutation<{ token: string; user: User }, void>({
      query: () => ({
        url: "auth/refresh",
        method: "POST",
      }),
    }),

    createComment: build.mutation<
      Comment,
      { taskId: number; text: string; userId?: number }
    >({
      query: ({ taskId, text, userId }) => ({
        url: `tasks/${taskId}/comments`,
        method: "POST",
        body: { text, userId },
      }),
      invalidatesTags: ["Tasks"],
    }),

    createAttachment: build.mutation<
      Attachment,
      {
        taskId: number;
        fileURL: string;
        fileName?: string;
        uploadedById?: number;
      }
    >({
      query: ({ taskId, fileURL, fileName, uploadedById }) => ({
        url: `tasks/${taskId}/attachments`,
        method: "POST",
        body: { fileURL, fileName, uploadedById },
      }),
      invalidatesTags: ["Tasks"],
    }),

    updateUserTeam: build.mutation<
      User,
      { userId: number; teamId: number | null }
    >({
      query: ({ userId, teamId }) => ({
        url: `users/${userId}/team`,
        method: "PATCH",
        body: { teamId },
      }),
      invalidatesTags: ["Users"],
    }),

    updateTeamLeadership: build.mutation<
      Team,
      {
        teamId: number;
        productOwnerUserId: number | null;
        projectManagerUserId: number | null;
      }
    >({
      query: ({ teamId, productOwnerUserId, projectManagerUserId }) => ({
        url: `teams/${teamId}/leadership`,
        method: "PATCH",
        body: { productOwnerUserId, projectManagerUserId },
      }),
      invalidatesTags: ["Teams"],
    }),

    assignTeamToProject: build.mutation<
      any,
      { projectId: number; teamId: number }
    >({
      query: ({ projectId, teamId }) => ({
        url: `projects/${projectId}/teams`,
        method: "POST",
        body: { teamId },
      }),
      invalidatesTags: ["Projects", "Teams"],
    }),

    removeTeamFromProject: build.mutation<
      any,
      { projectId: number; teamId: number }
    >({
      query: ({ projectId, teamId }) => ({
        url: `projects/${projectId}/teams/${teamId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Projects", "Teams"],
    }),

    getActivities: build.query<ActivityLog[], void>({
      query: () => "activities",
      providesTags: ["Tasks", "Projects", "Users", "Teams"],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskStatusMutation,
  useSearchQuery,
  useGetUsersQuery,
  useGetTeamsQuery,
  useCreateTeamMutation,
  useJoinTeamMutation,
  useGetUserTasksQuery,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useRefreshMutation,
  useCreateCommentMutation,
  useCreateAttachmentMutation,
  useUpdateUserTeamMutation,
  useUpdateTeamLeadershipMutation,
  useAssignTeamToProjectMutation,
  useRemoveTeamFromProjectMutation,
  useGetActivitiesQuery,
} = api;
