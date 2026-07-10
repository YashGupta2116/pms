import Header from "@/components/Header";
import {
  Clock,
  Filter,
  Grid3x3,
  List,
  PlusSquare,
  Share2,
  Table,
} from "lucide-react";
import React from "react";

type Props = {
  activeTab: string;
  setActiveTab: (tabName: string) => void;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
  projectName: string;
};

const ProjectHeader = ({ activeTab, setActiveTab, setIsModalNewTaskOpen, projectName }: Props) => {
  return (
    <div className="px-4 xl:px-6">
      <div className="pt-6 pb-6 lg:pt-8 lg:pb-4">
        <Header
          name={projectName}
          buttonComponent={
            <button
              className="bg-blue-primary flex items-center rounded-md px-3 py-2 text-white hover:bg-blue-600 cursor-pointer"
              onClick={() => setIsModalNewTaskOpen(true)}
            >
              <PlusSquare className="mr-2 h-5 w-5" /> New Task
            </button>
          }
        />
      </div>

      {/* TABS */}
      <div className="dark:border-stroke-dark flex flex-col gap-3 border-y border-gray-200 py-2 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-1 md:pb-0 scrollbar-none">
          <TabButton
            name="Board"
            icon={<Grid3x3 className="h-5 w-5" />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
          <TabButton
            name="List"
            icon={<List className="h-5 w-5" />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
          <TabButton
            name="Timeline"
            icon={<Clock className="h-5 w-5" />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
          <TabButton
            name="Table"
            icon={<Table className="h-5 w-5" />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
        </div>
        <div className="flex items-center gap-3 self-end md:self-auto w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-2">
            <button className="text-gray-500 hover:text-gray-600 dark:text-neutral-500 dark:hover:text-gray-300">
              <Filter className="h-5 w-5" />
            </button>
            <button className="text-gray-500 hover:text-gray-600 dark:text-neutral-500 dark:hover:text-gray-300">
              <Share2 className="h-5 w-5" />
            </button>
          </div>
          <div className="relative flex-1 md:flex-initial max-w-[200px]">
            <input
              type="text"
              placeholder="Search Task"
              className="w-full dark:border-stroke-dark dark:bg-dark-secondary rounded-lg border border-gray-200 py-1.5 pr-4 pl-10 text-sm focus:border-blue-500 focus:outline-none dark:text-white dark:placeholder-gray-400"
            />
            <Grid3x3 className="absolute top-2.5 left-3.5 h-4 w-4 text-gray-450 dark:text-neutral-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

type TabButtonProps = {
  name: string;
  icon: React.ReactNode;
  setActiveTab: (tabName: string) => void;
  activeTab: string;
};

const TabButton = ({ name, icon, setActiveTab, activeTab }: TabButtonProps) => {
  const isActive = activeTab === name;

  return (
    <button
      className={`relative flex items-center gap-2 px-1.5 py-2 text-gray-500 after:absolute after:-bottom-[9px] after:left-0 after:h-[2px] after:w-full transition-colors duration-200 hover:text-blue-600 sm:px-2.5 lg:px-4 dark:text-neutral-400 dark:hover:text-white ${isActive ? "text-blue-600 after:bg-blue-600 dark:text-white" : "after:bg-transparent"
        }`}
      onClick={() => setActiveTab(name)}
    >
      {icon}
      {name}
    </button>
  );
};

export default ProjectHeader;
