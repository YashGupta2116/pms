import { prisma } from "../../prisma/prisma.js";

export const safeUserSelect = {
  userId: true,
  username: true,
  email: true,
  profilePictureUrl: true,
  teamId: true,
} as const;

export type SafeUser = {
  userId: number;
  username: string;
  email: string;
  profilePictureUrl: string | null;
  teamId: number | null;
};

export type UserRole = "Product Owner" | "Project Manager" | "Team Member" | "Unassigned";

export type EnrichedUser = SafeUser & {
  role: UserRole;
  isLeader: boolean;
  leaderTeamIds: number[];
};

export async function getLeaderTeamIds(userId: number): Promise<number[]> {
  const teams = await prisma.team.findMany({
    where: {
      OR: [
        { productOwnerUserId: userId },
        { projectManagerUserId: userId },
      ],
    },
    select: { id: true },
  });
  return teams.map((t) => t.id);
}

export async function isAnyTeamLeader(userId: number): Promise<boolean> {
  const count = await prisma.team.count({
    where: {
      OR: [
        { productOwnerUserId: userId },
        { projectManagerUserId: userId },
      ],
    },
  });
  return count > 0;
}

export async function isTeamLeaderOf(
  userId: number,
  teamId: number,
): Promise<boolean> {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    select: { productOwnerUserId: true, projectManagerUserId: true },
  });
  if (!team) return false;
  return (
    team.productOwnerUserId === userId ||
    team.projectManagerUserId === userId
  );
}

export async function getUserRole(
  userId: number,
  teamId: number | null,
): Promise<UserRole> {
  if (!teamId) return "Unassigned";

  const team = await prisma.team.findUnique({
    where: { id: teamId },
    select: { productOwnerUserId: true, projectManagerUserId: true },
  });

  if (!team) return "Team Member";
  if (team.productOwnerUserId === userId) return "Product Owner";
  if (team.projectManagerUserId === userId) return "Project Manager";
  return "Team Member";
}

export async function enrichUser(user: SafeUser): Promise<EnrichedUser> {
  const leaderTeamIds = await getLeaderTeamIds(user.userId);
  const role = await getUserRole(user.userId, user.teamId);
  return {
    ...user,
    role,
    isLeader: leaderTeamIds.length > 0,
    leaderTeamIds,
  };
}

export async function getAccessibleProjectIds(
  userId: number,
): Promise<number[] | "all"> {
  const user = await prisma.user.findUnique({
    where: { userId },
    select: { teamId: true },
  });

  if (!user?.teamId) return [];

  const links = await prisma.projectTeam.findMany({
    where: { teamId: user.teamId },
    select: { projectId: true },
  });

  return links.map((l) => l.projectId);
}

export async function userHasProjectAccess(
  userId: number,
  projectId: number,
): Promise<boolean> {
  const accessible = await getAccessibleProjectIds(userId);
  if (accessible === "all") return true;
  return accessible.includes(projectId);
}

export async function getTaskProjectId(taskId: number): Promise<number | null> {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: { projectId: true },
  });
  return task?.projectId ?? null;
}
