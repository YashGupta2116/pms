"use client";

import { useGetTeamsQuery, Team } from "@/state/api";
import Header from "@/components/Header";
import { CustomTable, ColumnDef } from "@/components/CustomTable";

type TeamWithUsernames = Team & {
  productOwnerUsername?: string;
  projectManagerUsername?: string;
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
    className: "text-gray-700 dark:text-gray-300",
  },
  {
    headerName: "Project Manager",
    field: "projectManagerUsername",
    className: "text-gray-700 dark:text-gray-350 dark:text-gray-300",
  },
];

const Teams = () => {
  const { data: teams, isLoading, isError } = useGetTeamsQuery();

  if (isLoading) return <div className="p-8 text-center text-sm text-gray-400">Loading teams...</div>;
  if (isError || !teams) return <div className="p-8 text-center text-sm text-red-400">Error fetching teams</div>;

  return (
    <div className="flex w-full flex-col p-8 bg-gray-50/30 dark:bg-dark-bg min-h-screen">
      <Header name="Teams" />
      <div className="shadow-sm border border-gray-205/60 dark:border-stroke-dark rounded-xl overflow-hidden mt-6 bg-white dark:bg-dark-secondary">
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
