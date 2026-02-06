"use client";

import React, { useState } from "react";
import Table, { Column } from "@/components/ui/Table/Table";
import { User, Mail, MoreHorizontal, Edit, Trash2 } from "lucide-react";

// --- Mock Data ---
interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive" | "Pending";
  lastLogin: string;
}

const MOCK_USERS: UserData[] = Array.from({ length: 45 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: i % 3 === 0 ? "Admin" : i % 3 === 1 ? "Editor" : "Viewer",
  status: i % 4 === 0 ? "Inactive" : i % 5 === 0 ? "Pending" : "Active",
  // Use deterministic date to avoid hydration mismatch (Server != Client)
  lastLogin: new Date(2025, 0, (i % 30) + 1).toLocaleDateString("en-US"),
}));

const TableDemoPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortColumn, setSortColumn] = useState<keyof UserData | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (column: keyof UserData) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Sorting Logic
  const sortedData = [...MOCK_USERS].sort((a, b) => {
    if (!sortColumn) return 0;
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination Logic
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentData = sortedData.slice(startIndex, startIndex + pageSize);

  // Column Definitions
  const columns: Column<UserData>[] = [
    {
      header: "ID",
      accessor: "id",
      className: "w-[50px] font-bold text-gray-400",
      sortable: true,
      description: "Unique identifier for each user in the system.",
    },
    {
      header: "User",
      accessor: "name",
      sortable: true,
      description:
        "Full name of the registered user along with their contact email.",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <User size={16} />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              {row.name}
            </span>
            <span className="text-xs text-gray-400">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Role",
      accessor: "role",
      sortable: true,
      description: "Access level assigned to the user (Admin, Editor, Viewer).",
      render: (row) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                ${
                  row.role === "Admin"
                    ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                    : row.role === "Editor"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                }`}
        >
          {row.role}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      sortable: true,
      description:
        "Current account status: Active (can login), Inactive (banned), or Pending (awaiting approval).",
      render: (row) => {
        const statusColors = {
          Active:
            "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
          Inactive:
            "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
          Pending:
            "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
        };
        return (
          <span
            className={`px-2 py-1 rounded-md text-xs font-semibold ${statusColors[row.status]}`}
          >
            {row.status}
          </span>
        );
      },
    },
    {
      header: "Last Login",
      accessor: "lastLogin",
      className: "text-gray-500",
      sortable: true,
      description:
        "The date of the user's most recent successful login activity.",
    },
    {
      header: "Actions",
      accessor: "id", // Dummy
      description: "Manage users: Edit details or delete account.",
      render: () => (
        <div className="flex items-center gap-2">
          <button className="p-1 hover:text-blue-500 transition-colors pointer-events-auto">
            <Edit size={16} />
          </button>
          <button className="p-1 hover:text-red-500 transition-colors pointer-events-auto">
            <Trash2 size={16} />
          </button>
        </div>
      ),
      className: "text-right",
      headerClassName: "text-right",
    },
  ];

  return (
    <div className="p-6">
      <div className="card bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              User Management
            </h3>
            <p className="text-sm text-gray-500">
              Example usage of integrated Table Pagination
            </p>
          </div>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
            Add User
          </button>
        </div>

        <Table
          columns={columns}
          data={currentData}
          keyExtractor={(user) => user.id}
          className="mb-0"
          sortColumn={sortColumn || undefined}
          sortDirection={sortDirection}
          onSort={handleSort}
          pagination={{
            currentPage,
            totalPages,
            totalItems: MOCK_USERS.length,
            pageSize,
            onPageChange: setCurrentPage,
            onPageSizeChange: (size) => {
              setPageSize(size);
              setCurrentPage(1);
            },
            pageSizeOptions: [5, 10, 20, 50],
          }}
        />
      </div>
    </div>
  );
};

export default TableDemoPage;
