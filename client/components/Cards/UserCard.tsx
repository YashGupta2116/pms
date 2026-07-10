import { User } from "@/state/api";
import Image from "next/image";
import React from "react";
import { Mail, CheckCircle2 } from "lucide-react";

type Props = {
  user: User;
};

const UserCard = ({ user }: Props) => {
  const initials = user.username
    ? user.username
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
    : "U";

  return (
    <div className="dark:bg-dark-secondary flex items-center gap-4 rounded-xl border border-gray-150 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md dark:border-stroke-dark dark:text-white">
      {user.profilePictureUrl ? (
        <Image
          src={`/${user.profilePictureUrl}`}
          alt={`${user.username} profile`}
          width={44}
          height={44}
          className="h-11 w-11 rounded-full object-cover border-2 border-blue-100 dark:border-dark-tertiary"
        />
      ) : (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600 dark:bg-blue-950/60 dark:text-blue-300 text-sm">
          {initials}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h3 className="truncate font-bold text-gray-905 dark:text-white text-sm flex items-center gap-1.5">
          {user.username}
          <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-500 fill-blue-500/20" />
        </h3>
        <p className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-neutral-400 mt-0.5 truncate">
          <Mail className="h-3.5 w-3.5 text-gray-400 shrink-0" />
          {user.email || "No email provided"}
        </p>
      </div>
    </div>
  );
};

export default UserCard;
