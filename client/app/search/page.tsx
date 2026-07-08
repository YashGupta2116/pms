"use client";

import ProjectCard from "@/components/Cards/ProjectCard";
import UserCard from "@/components/Cards/UserCard";
import Header from "@/components/Header";
import TaskCard from "@/components/TaskCard";
import { useSearchQuery } from "@/state/api";
import { debounce } from "lodash";
import React, { useEffect, useState } from "react";
import { Search as SearchIcon } from "lucide-react";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: searchResults,
    isLoading,
    isError,
  } = useSearchQuery(searchTerm, {
    skip: searchTerm.length < 3,
  });

  const handleSearch = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    },
    500,
  );

  useEffect(() => {
    return handleSearch.cancel;
  }, [handleSearch.cancel]);

  return (
    <div className="container h-full w-[100%] p-8">
      <div className="mb-6">
        <Header name="Search" />
        <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1.5">
          Find tasks, projects, and users across your entire work workspace.
        </p>
      </div>

      <div className="relative max-w-xl mb-8">
        <SearchIcon className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-300 pointer-events-none" />
        <input
          type="text"
          placeholder="Type at least 3 characters to search tasks, projects, and users..."
          className="w-full rounded-xl border border-gray-200 bg-white p-3.5 pl-12 text-sm shadow-sm transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-stroke-dark dark:bg-dark-secondary dark:text-white dark:placeholder-gray-400 hover:shadow-md focus:shadow-md"
          onChange={handleSearch}
        />
      </div>

      <div className="py-2">
        {isLoading && (
          <div className="flex items-center gap-2 text-gray-500 dark:text-neutral-400">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
            Loading results...
          </div>
        )}
        {isError && (
          <p className="text-red-500 font-medium">
            An error occurred while fetching search results.
          </p>
        )}
        {!isLoading && !isError && searchResults && (
          <div className="space-y-8">
            {/* TASKS SECTION */}
            {searchResults.tasks && searchResults.tasks.length > 0 && (
              <div>
                <h2 className="mb-4 text-base font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2 border-b border-gray-100 dark:border-stroke-dark pb-2">
                  Tasks
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600 dark:bg-dark-secondary dark:text-gray-400">
                    {searchResults.tasks.length}
                  </span>
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {searchResults.tasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
            )}

            {/* PROJECTS SECTION */}
            {searchResults.projects && searchResults.projects.length > 0 && (
              <div>
                <h2 className="mb-4 text-base font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2 border-b border-gray-100 dark:border-stroke-dark pb-2">
                  Projects
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600 dark:bg-dark-secondary dark:text-gray-400">
                    {searchResults.projects.length}
                  </span>
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {searchResults.projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </div>
            )}

            {/* USERS SECTION */}
            {searchResults.users && searchResults.users.length > 0 && (
              <div>
                <h2 className="mb-4 text-base font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2 border-b border-gray-100 dark:border-stroke-dark pb-2">
                  Users
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600 dark:bg-dark-secondary dark:text-gray-400">
                    {searchResults.users.length}
                  </span>
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {searchResults.users.map((user) => (
                    <UserCard key={user.userId} user={user} />
                  ))}
                </div>
              </div>
            )}

            {(!searchResults.tasks?.length && !searchResults.projects?.length && !searchResults.users?.length) && searchTerm.length >= 3 && (
              <p className="text-gray-500 dark:text-neutral-400">No results found matching search query.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
