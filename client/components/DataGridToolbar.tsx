import React from "react";
import {
    ExportCsv,
    FilterPanelTrigger,
    Toolbar,
    ToolbarButton,
} from "@mui/x-data-grid";
import { Filter, Download } from "lucide-react";

const DataGridToolbar = () => {
    const btnClasses =
        "flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:text-gray-900 dark:border-stroke-dark dark:bg-dark-tertiary dark:text-gray-300 dark:hover:bg-dark-secondary dark:hover:text-white";

    return (
        <Toolbar className="flex items-center justify-between border-b border-gray-100 bg-transparent px-4 py-2 dark:border-stroke-dark mb-1">
            <div className="flex items-center gap-1.5">
                <FilterPanelTrigger
                    render={
                        <ToolbarButton className={btnClasses}>
                            <Filter className="h-3.5 w-3.5" />
                            <span>Filters</span>
                        </ToolbarButton>
                    }
                />
                <ExportCsv
                    render={
                        <ToolbarButton className={btnClasses}>
                            <Download className="h-3.5 w-3.5" />
                            <span>Export</span>
                        </ToolbarButton>
                    }
                />
            </div>
            <div className="flex items-center gap-1.5 opacity-90 pr-2">
                <div className="h-2 w-2 rounded-full bg-blue-primary animate-pulse" />
                <span className="text-[10px] font-extrabold tracking-wider text-gray-400 dark:text-neutral-500 uppercase select-none">
                    PROMANAGE
                </span>
            </div>
        </Toolbar>
    );
};

export default DataGridToolbar;
