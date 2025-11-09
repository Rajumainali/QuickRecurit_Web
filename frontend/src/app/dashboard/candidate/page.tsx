import React, { useEffect, useState } from "react";
import { Database, Clock, X, Bookmark, AlertCircle, Check } from "lucide-react";
import CandidateLayout from "../../../Layouts/CandidateLayout";
const API_BASE_URL = import.meta.env.VITE_API_URL;
import { useNavigate } from "react-router-dom";

interface Application {
  _id: string;
  postTitle: string;
  companyName: string;
  logo: string;
  status: string;
  location: string;
  openings: string | number;
  appliedAt: string;
}

const Page = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const rejectedCount = applications.filter(a => a.status === "rejected").length;
   const selectCount = applications.filter(a => a.status === "shortlisted").length;
    const unapproveCount = applications.filter(a => a.status === "unapproved").length;
  useEffect(() => {
    const fetchApplications = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No token found, skipping fetchUserDetails");
        return;
      }
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
  const handlenavigate = () => {
    navigate("/dashboard/candidate/applications");
  };
  return (
    <CandidateLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Hey there, Here are Things to Know!
          </h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {/* Applied */}
          <button
            className="p-6 text-center bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer dark:bg-gray-800 dark:border-gray-700 "
            onClick={handlenavigate}
          >
            <div className="flex justify-center mb-3">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full dark:bg-green-900/20">
                <Database className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mb-1 text-3xl font-bold text-gray-900 dark:text-white">
              {applications.length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Applied
            </div>
          </button>

          {/* Alerts */}
          <div className="p-6 text-center bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <div className="flex justify-center mb-3">
              <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full dark:bg-yellow-900/20">
                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <div className="mb-1 text-3xl font-bold text-gray-900 dark:text-white">
              {unapproveCount}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Unapproved
            </div>
          </div>

          {/* Rejected */}
          <div className="p-6 text-center bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <div className="flex justify-center mb-3">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full dark:bg-red-900/20">
                <X className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <div className="mb-1 text-3xl font-bold text-gray-900 dark:text-white">
            {rejectedCount}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Rejected
            </div>
          </div>

          {/* Bookmarks */}
          <div className="p-6 text-center bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <div className="flex justify-center mb-3">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full dark:bg-blue-900/20">
                <Check className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mb-1 text-3xl font-bold text-gray-900 dark:text-white">
              {selectCount}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Selected
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Internship Applied Recently */}
          {/* Internship Applied Recently */}
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
               Applied Recently
            </h2>
            {applications.length > 0 ? (
              <div className="space-y-4">
                {applications.map((applicant) => (
                  <div
                    key={applicant._id}
                    className="flex items-start space-x-3"
                  >
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full dark:bg-blue-900/20">
                      {applicant.logo ? (
                        <img
                          src={`${API_BASE_URL}upload/logos/${applicant.logo}`}
                          alt="logo"
                          className="object-cover w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-10 h-10 text-sm text-white bg-gray-300 rounded-full">
                          N/A
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {applicant.postTitle}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Applied at {applicant.companyName}
                      </p>
                      <div className="flex items-center mt-1 space-x-2">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            applicant.status === "approved"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                              : applicant.status === "rejected"
                              ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                          }`}
                        >
                          {applicant.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">
                      {new Date(applicant.appliedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="flex justify-center mb-4">
                  <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-lg dark:bg-red-900/20">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                  </div>
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                  No recent applications
                </p>
              </div>
            )}
          </div>

          {/* Recent Activities */}
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Recent Activities
            </h2>
            {applications.length > 0 ? (
              <div className="space-y-4">
                {applications.map((applicant) => (
                  <div
                    key={applicant._id}
                    className="flex items-start space-x-3"
                  >
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full dark:bg-blue-900/20">
                      {applicant.logo ? (
                        <img
                          src={`${API_BASE_URL}upload/logos/${applicant.logo}`}
                          alt="logo"
                          className="object-cover w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-10 h-10 text-sm text-white bg-gray-300 rounded-full">
                          N/A
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {applicant.postTitle}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Applied at {applicant.companyName}
                      </p>
                      <div className="flex items-center mt-1 space-x-2">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            applicant.status === "approved"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                              : applicant.status === "rejected"
                              ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                          }`}
                        >
                          {applicant.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">
                      {new Date(applicant.appliedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="flex justify-center mb-4">
                  <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-lg dark:bg-red-900/20">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                  </div>
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                  No recent activities
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </CandidateLayout>
  );
};

export default Page;
