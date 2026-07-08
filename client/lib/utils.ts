export const dataGridClassNames =
  "border border-gray-200 bg-white shadow-sm dark:border-stroke-dark dark:bg-dark-secondary dark:text-gray-200 rounded-xl overflow-hidden";

export const dataGridSxStyles = (isDarkMode: boolean) => {
  return {
    "&.MuiDataGrid-root": {
      backgroundColor: `${isDarkMode ? "#1d1f21" : "white"}`,
    },
    "& .MuiDataGrid-main": {
      backgroundColor: `${isDarkMode ? "#1d1f21" : "white"}`,
    },
    "& .MuiDataGrid-columnHeaders": {
      color: `${isDarkMode ? "#e5e7eb" : "#374151"}`,
      '& [role="row"] > *': {
        backgroundColor: `${isDarkMode ? "#1d1f21" : "#f9fafb"}`,
        borderColor: `${isDarkMode ? "#2d3135" : "#f0f0f0"}`,
      },
    },
    "& .MuiIconButton-root": {
      color: `${isDarkMode ? "#a3a3a3" : "#666666"}`,
    },
    "& .MuiTablePagination-root": {
      color: `${isDarkMode ? "#a3a3a3" : "#374151"}`,
    },
    "& .MuiTablePagination-selectIcon": {
      color: `${isDarkMode ? "#a3a3a3" : "#374151"}`,
    },
    "& .MuiDataGrid-cell": {
      border: "none",
      color: `${isDarkMode ? "#e5e7eb" : "#374151"}`,
    },
    "& .MuiDataGrid-row": {
      backgroundColor: `${isDarkMode ? "#1d1f21" : "white"}`,
      borderBottom: `1px solid ${isDarkMode ? "#2d3135" : "#f0f0f0"}`,
      "&.Mui-selected": {
        backgroundColor: `${isDarkMode ? "#101214" : "#f3f4f6"}`,
        "&:hover": {
          backgroundColor: `${isDarkMode ? "#1d1f21" : "#e5e7eb"}`,
        },
      },
      "&:hover": {
        backgroundColor: `${isDarkMode ? "#2d3135" : "#f9fafb"}`,
      },
    },
    "& .MuiDataGrid-toolbarContainer": {
      backgroundColor: `${isDarkMode ? "#1d1f21" : "white"}`,
      borderBottom: `1px solid ${isDarkMode ? "#2d3135" : "#f0f0f0"}`,
      "& .MuiButton-text": {
        color: `${isDarkMode ? "#e5e7eb" : "#374151"} !important`,
      },
    },
    "& .MuiDataGrid-footerContainer": {
      backgroundColor: `${isDarkMode ? "#1d1f21" : "#f9fafb"}`,
      borderTop: `1px solid ${isDarkMode ? "#2d3135" : "#f0f0f0"}`,
    },
    "& .MuiDataGrid-withBorderColor": {
      borderColor: `${isDarkMode ? "#2d3135" : "#f0f0f0"}`,
    },
  };
};
