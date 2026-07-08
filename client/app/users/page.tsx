"use client";

import { useGetUsersQuery, User } from "@/state/api";
import Header from "@/components/Header";
import { CustomTable, ColumnDef } from "@/components/CustomTable";
import Image from "next/image";

const columns: ColumnDef<User>[] = [
  {
    headerName: "ID",
    field: "userId",
    className: "font-semibold text-gray-500",
  },
  {
    headerName: "Username",
    field: "username",
    className: "font-bold text-gray-900 dark:text-white text-sm",
  },
  {
    headerName: "Profile Picture",
    field: "profilePictureUrl",
    renderCell: ({ value, row }) => {
      if (value) {
        return (
          <div className="h-9 w-9 overflow-hidden rounded-full border-2 border-white dark:border-stroke-dark shadow-sm">
            <Image
              src={`/${value}`}
              alt={row.username}
              width={36}
              height={36}
              className="h-full w-full object-cover"
            />
          </div>
        );
      }
      const initials = (row.username || "").substring(0, 2).toUpperCase();
      return (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300 font-extrabold text-sm border-2 border-white dark:border-stroke-dark shadow-sm">
          {initials}
        </div>
      );
    },
  },
];

const Users = () => {
  const { data: users, isLoading, isError } = useGetUsersQuery();

  if (isLoading) return <div className="p-8 text-center text-sm text-gray-400">Loading users...</div>;
  if (isError || !users) return <div className="p-8 text-center text-sm text-red-400">Error fetching users</div>;

  return (
    <div className="flex w-full flex-col p-8 bg-gray-50/30 dark:bg-dark-bg min-h-screen">
      <Header name="Users" />
      <div className="shadow-sm border border-gray-205/60 dark:border-stroke-dark rounded-xl overflow-hidden mt-6 bg-white dark:bg-dark-secondary">
        <CustomTable
          data={users || []}
          columns={columns}
          searchPlaceholder="Search usernames..."
          searchField="username"
        />
      </div>
    </div>
  );
};

export default Users;
