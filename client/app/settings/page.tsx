import Header from "@/components/Header";
import React from "react";
import { User, Mail, Shield, Briefcase } from "lucide-react";

type Props = {};

const Settings = (props: Props) => {
  const userSettings = {
    username: "johndoe",
    email: "john.doe@example.com",
    teamName: "Development Team",
    roleName: "Developer",
  };

  const labelStyles = "block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5";
  const containerStyles = "flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg p-3 dark:bg-dark-secondary dark:border-stroke-dark transition-all hover:bg-gray-100/50 dark:hover:bg-dark-secondary/80";
  const textStyles = "text-sm font-medium text-gray-900 dark:text-white";

  return (
    <div className="p-8 max-w-2xl">
      <Header name="Settings" />
      <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm dark:bg-dark-bg dark:border-stroke-dark space-y-6">
        <div>
          <label className={labelStyles}>Username</label>
          <div className={containerStyles}>
            <User className="h-4 w-4 text-gray-400 shrink-0" />
            <div className={textStyles}>{userSettings.username}</div>
          </div>
        </div>
        <div>
          <label className={labelStyles}>Email Address</label>
          <div className={containerStyles}>
            <Mail className="h-4 w-4 text-gray-400 shrink-0" />
            <div className={textStyles}>{userSettings.email}</div>
          </div>
        </div>
        <div>
          <label className={labelStyles}>Team</label>
          <div className={containerStyles}>
            <Briefcase className="h-4 w-4 text-gray-405 shrink-0" />
            <div className={textStyles}>{userSettings.teamName}</div>
          </div>
        </div>
        <div>
          <label className={labelStyles}>Role</label>
          <div className={containerStyles}>
            <Shield className="h-4 w-4 text-gray-405 shrink-0" />
            <div className={textStyles}>{userSettings.roleName}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
