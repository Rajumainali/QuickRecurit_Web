import React, { useEffect, useState } from "react";
import CandidateLayout from "../../../Layouts/CandidateLayout";
const API_BASE_URL = import.meta.env.VITE_API_URL;

interface Application {
  _id: string;
  postTitle: string;
  companyName: string;
  logo: string;
  status: string;
  location: string;
  type: string;
  openings: string | number;
  appliedAt: string;
}

const statusColors: Record<string, string> = {
  unapproved:
    "bg-orange-100 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800",
  Shortlisted:
    "bg-purple-100 text-purple-600 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800",
  Hired:
    "bg-emerald-100 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
  Rejected:
    "bg-red-100 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
};

const Myapplication: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("All");
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    const fetchApplications = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${API_BASE_URL}auth/applicants`, {
          method: "GET",
          headers: {
            Authorization: `${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch applications");

        const data = await response.json();
        setApplications(data.applicants || []);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    fetchApplications();
  }, []);

  const tabs = [
    "All",
    "unapproved",
    "Shortlisted",
    "Hired",
    "Rejected",
  ];

  // Match tab to application status
  const matchesTab = (app: Application, tab: string): boolean => {
    if (tab === "All") return true;

    switch (tab) {
      case "Shortlisted":
        return app.status === "approved";
      case "Rejected":
        return app.status === "rejected";
      case "unapproved":
        return app.status === "unapproved";
      case "Hired":
        return app.status === "hired";
      default:
        return false;
    }
  };

  const getTabCount = (tab: string) =>
    applications.filter((app) => matchesTab(app, tab)).length;

  const filteredApplications = applications.filter((app) =>
    matchesTab(app, activeTab)
  );

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const getStatusDisplay = (status: string) => {
    let displayStatus: string;

    if (status === "approved") {
      displayStatus = "Shortlisted";
    } else {
      displayStatus =
        status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    }

    const colorClass = statusColors[displayStatus] || statusColors.unapproved;

    return {
      display: displayStatus,
      colorClass,
    };
  };

  return (
    <CandidateLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
              <span>Dashboard</span>
              <span className="mx-2">›</span>
              <span>My Application</span>
            </div>
          </div>

          {/* Tab navigation */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
            <nav className="flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab
                      ? "text-red-600 border-red-600 dark:text-red-400 dark:border-red-400"
                      : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600"
                  }`}
                >
                  {tab}
                  <span className="ml-2 text-xs bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 px-2 py-0.5 rounded-full">
                    {getTabCount(tab)}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Table of applications */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300">
                    Company
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300">
                    Openings
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300">
                    Applied Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300">
                    Type
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((app) => {
                  const statusInfo = getStatusDisplay(app.status);
                  return (
                    <tr
                      key={app._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 font-medium">
                        {app.postTitle}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 flex items-center space-x-2">
                        <img
                          src={`${API_BASE_URL}upload/logos/${app.logo}`}
                          alt="logo"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span>{app.companyName}</span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200 hover:shadow-sm ${statusInfo.colorClass}`}
                        >
                          {statusInfo.display}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                        {app.location}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                        {app.openings}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                        {formatDate(app.appliedAt)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                        {app.type}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* No applications fallback */}
          {filteredApplications.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400 text-lg">
                No applications found for "{activeTab}"
              </div>
              <div className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                Try selecting a different tab or check back later
              </div>
            </div>
          )}
        </div>
      </div>
    </CandidateLayout>
  );
};

export default Myapplication;
