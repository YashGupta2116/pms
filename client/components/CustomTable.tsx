"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

export type ColumnDef<T> = {
    headerName: string;
    field: keyof T | string;
    className?: string;
    renderCell?: (params: { value: any; row: T }) => React.ReactNode;
};

type Props<T> = {
    data: T[];
    columns: ColumnDef<T>[];
    searchPlaceholder?: string;
    searchField?: keyof T;
    onRowClick?: (row: T) => void;
};

export function CustomTable<T extends { id?: number | string; userId?: number | string; teamId?: number | string }>({
    data,
    columns,
    searchPlaceholder = "Search...",
    searchField,
    onRowClick,
}: Props<T>) {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const filteredData = React.useMemo(() => {
        if (!searchQuery.trim() || !searchField) return data;
        return data.filter((row) => {
            const val = row[searchField];
            if (val === null || val === undefined) return false;
            return String(val).toLowerCase().includes(searchQuery.toLowerCase());
        });
    }, [data, searchQuery, searchField]);

    const totalPages = Math.ceil(filteredData.length / rowsPerPage) || 1;
    const paginatedData = React.useMemo(() => {
        const start = (currentPage - 1) * rowsPerPage;
        return filteredData.slice(start, start + rowsPerPage);
    }, [filteredData, currentPage]);

    const handlePageChange = (pageNum: number) => {
        if (pageNum >= 1 && pageNum <= totalPages) {
            setCurrentPage(pageNum);
        }
    };

    return (
        <div className="flex w-full flex-col h-full bg-white dark:bg-dark-secondary rounded-xl transition-all duration-300">
            {searchField && (
                <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-3 dark:border-stroke-dark">
                    <div className="relative flex flex-1 max-w-xs">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-neutral-500" />
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full rounded-lg border border-gray-250/50 bg-gray-50/30 pl-9 pr-4 py-1.5 text-xs text-gray-700 placeholder-gray-400/80 outline-none transition-all focus:border-blue-500 dark:border-stroke-dark dark:bg-dark-tertiary dark:text-white dark:placeholder-neutral-500 dark:focus:border-blue-500"
                        />
                    </div>
                </div>
            )}

            <div className="flex-1 overflow-x-auto min-h-0 select-text">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-100 dark:border-stroke-dark bg-transparent">
                            {columns.map((col, idx) => (
                                <th
                                    key={idx}
                                    className={`py-4 px-6 text-[10px] font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-wider select-none ${col.className || ""}`}
                                >
                                    {col.headerName}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-stroke-dark">
                        {paginatedData.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="py-12 text-center text-sm font-medium text-gray-400 dark:text-neutral-500"
                                >
                                    No records found.
                                </td>
                            </tr>
                        ) : (
                            paginatedData.map((row, rowIdx) => {
                                const rowId = row.id !== undefined ? row.id : row.userId !== undefined ? row.userId : row.teamId !== undefined ? row.teamId : rowIdx;
                                return (
                                    <tr
                                        key={rowId}
                                        onClick={() => onRowClick?.(row)}
                                        className={`group border-b border-gray-50 hover:bg-blue-50/20 dark:border-stroke-dark/40 dark:hover:bg-blue-950/5 transition-colors duration-200 ${onRowClick ? "cursor-pointer" : ""}`}
                                    >
                                        {columns.map((col, colIdx) => {
                                            const rawValue = col.field ? (row as any)[col.field] : undefined;
                                            return (
                                                <td
                                                    key={colIdx}
                                                    className={`py-3.5 px-6 text-xs text-gray-700 dark:text-gray-300 font-medium ${col.className || ""}`}
                                                >
                                                    {col.renderCell
                                                        ? col.renderCell({ value: rawValue, row })
                                                        : rawValue !== null && rawValue !== undefined
                                                            ? String(rawValue)
                                                            : "-"}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            {totalPages >= 1 && (
                <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4 dark:border-stroke-dark select-none mt-auto">
                    <div className="text-xs font-semibold text-gray-400 dark:text-neutral-500">
                        Showing {(currentPage - 1) * rowsPerPage + 1} to{" "}
                        {Math.min(currentPage * rowsPerPage, filteredData.length)} of{" "}
                        {filteredData.length} records
                    </div>
                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="rounded-lg p-1.5 border border-gray-200 bg-white text-gray-400 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-stroke-dark dark:bg-dark-tertiary dark:text-gray-300 dark:hover:bg-dark-secondary"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300 px-2 select-none">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="rounded-lg p-1.5 border border-gray-200 bg-white text-gray-400 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-stroke-dark dark:bg-dark-tertiary dark:text-gray-300 dark:hover:bg-dark-secondary"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
