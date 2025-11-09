import React, { useState } from "react";
import { FileX, AlertCircle } from "lucide-react";
import CandidateLayout from "../../../Layouts/CandidateLayout";

interface Bookmark {
  id: string;
  title: string;
  company: string;
  status: "Open" | "Close";
  deadline: string;
  createdAt: string;
}

// Sample data - can be replaced with your actual data
const dummyBookmarks: Bookmark[] = [
  {
    id: "1",
    title: "Frontend Developer",
    company: "Google",
    status: "Open",
    deadline: "2025-08-01",
    createdAt: "2025-07-01T10:00:00Z",
  },
  {
    id: "2",
    title: "Backend Engineer",
    company: "Meta",
    status: "Close",
    deadline: "2025-08-15",
    createdAt: "2025-07-05T14:30:00Z",
  },
  {
    id: "3",
    title: "Data Analyst",
    company: "Netflix",
    status: "Open",
    deadline: "2025-07-25",
    createdAt: "2025-06-20T09:15:00Z",
  },
  {
    id: "4",
    title: "DevOps Engineer",
    company: "Amazon",
    status: "Close",
    deadline: "2025-08-10",
    createdAt: "2025-07-08T16:45:00Z",
  },
];

const MyBookmarks: React.FC = () => {
  const [bookmarks] = useState<Bookmark[]>(dummyBookmarks);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Close":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";

      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        <FileX className="w-16 h-16 text-red-400 mb-4" />
        <AlertCircle className="w-6 h-6 text-red-500 absolute -top-1 -right-1" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No Results</h3>
      <p className="text-gray-500 text-center max-w-md">
        You haven't bookmarked any jobs yet. Start exploring opportunities and
        save the ones that interest you!
      </p>
    </div>
  );

  return (
    <CandidateLayout>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Dashboard</span>
            <span>›</span>
            <span className="text-gray-400 dark:text-gray-500">Bookmarks</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            My Bookmarks
          </h1>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {bookmarks.length === 0 ? (
            <EmptyState />
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center space-x-1">
                      <span>Title</span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                        />
                      </svg>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center space-x-1">
                      <span>Deadline</span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                        />
                      </svg>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center space-x-1">
                      <span>Created At</span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                        />
                      </svg>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {bookmarks.map((bookmark) => (
                  <tr
                    key={bookmark.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {bookmark.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-200">
                        {bookmark.company}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          bookmark.status
                        )}`}
                      >
                        {bookmark.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      {bookmark.deadline}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      {bookmark.createdAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </CandidateLayout>
  );
};

export default MyBookmarks;
