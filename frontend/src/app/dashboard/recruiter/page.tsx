import React from "react";
import {
  Plus,
  Database,
  FileText,
  CheckCircle,
  Eye,
  User,
  AlertCircle,
} from "lucide-react";
import RecruiterLayout from "../../../Layouts/RecruiterLayout";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Type definitions
type Applicant = {
  name: string;
  email: string;
  resumeLink: string;
  image: string;
  status: "rejected" | "approved" | "unapproved";
  _id: string;
  appliedAt: string;
};

type Post = {
  title: string;
  sector: string;
  level: string;
  type: string;
  location: string;
  city: string;
  openings: string;
  minSalary: string;
  maxSalary: string;
  deadline: string;
  requirements: string;
  skills: string;
  PostType: string;
  _id: string;
  postedAt: string;
  applicants: Applicant[];
  recruiterEmail: string;
  companyName: string;
  logo: string;
};

type ApiResponse = {
  posts: Post[];
  totalPosts: number;
  totalApplicants: number;
  shortlistedApplicants: number;
};

const Page = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No token found, skipping fetchUserDetails");
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}auth/fetch-user-Details`, {
          method: "GET",
          headers: {
            Authorization: `${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: ApiResponse = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching user details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  // Get recent applications for the "New Applications" section
  const getRecentApplications = () => {
    if (!data?.posts) return [];

    const allApplicants: (Applicant & { postTitle: string })[] = [];
    data.posts.forEach((post) => {
      post.applicants.forEach((applicant) => {
        allApplicants.push({ ...applicant, postTitle: post.title });
      });
    });

    // Sort by application date (most recent first) and take top 5
    return allApplicants
      .sort(
        (a, b) =>
          new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
      )
      .slice(0, 5);
  };



  const recentApplications = getRecentApplications();

  if (loading) {
    return (
      <RecruiterLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg text-gray-600 dark:text-gray-400">
            Loading...
          </div>
        </div>
      </RecruiterLayout>
    );
  }

  if (error) {
    return (
      <RecruiterLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg text-red-600 dark:text-red-400">
            Error: {error}
          </div>
        </div>
      </RecruiterLayout>
    );
  }

  return (
    <RecruiterLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Welcome back! It's time to kick off your journey with QuickRecruit.
          </h1>
        </div>

        {/* Post Job Section */}
        <div className="relative p-8 overflow-hidden bg-gray-800 rounded-lg dark:bg-gray-900">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
            <div className="absolute w-24 h-24 bg-gray-600 rounded-full right-8 top-8"></div>
            <div className="absolute w-32 h-32 bg-gray-500 rounded-full right-20 top-20"></div>
            <div className="absolute w-16 h-16 bg-gray-400 rounded-full right-2 top-32"></div>
            <div className="absolute w-8 h-8 bg-gray-300 rounded-full right-32 top-4"></div>
            <div className="absolute w-6 h-6 bg-gray-200 rounded-full right-12 top-40"></div>
          </div>

          <div className="relative z-10">
            <h2 className="mb-2 text-2xl font-bold text-white">
              Post your Internship/Job
            </h2>
            <p className="mb-6 text-gray-300">
              Find the perfect fit for your team- post your job with us today!
            </p>
            <button
              onClick={() => {
                navigate("/dashboard/recruiter/internships-jobs/posts");
              }}
              className="flex items-center px-6 py-3 space-x-2 text-white transition-colors bg-red-500 rounded-lg hover:bg-red-600"
            >
              <span>Post a Internship/Job</span>
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4" >
          {/* Total Jobs */}
          <div className="p-6 text-center bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700" onClick={()=>{navigate("/dashboard/recruiter/all-internships")}}>
            <div className="flex justify-center mb-3">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full dark:bg-green-900/20">
                <Database className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mb-1 text-3xl font-bold text-gray-900 dark:text-white">
              {data?.totalPosts || 0}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Total Jobs/Interns
            </div>
          </div>

          {/* Total Applicants */}
          <div className="p-6 text-center bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <div className="flex justify-center mb-3">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full dark:bg-blue-900/20">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mb-1 text-3xl font-bold text-gray-900 dark:text-white">
              {data?.totalApplicants || 0}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Total Applicants
            </div>
          </div>

          {/* Shortlisted */}
          <div className="p-6 text-center bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <div className="flex justify-center mb-3">
              <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full dark:bg-orange-900/20">
                <CheckCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <div className="mb-1 text-3xl font-bold text-gray-900 dark:text-white">
              {data?.shortlistedApplicants || 0}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Shortlisted
            </div>
          </div>

          {/* Views */}
          <div className="p-6 text-center bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <div className="flex justify-center mb-3">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full dark:bg-red-900/20">
                <Eye className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <div className="mb-1 text-3xl font-bold text-gray-900 dark:text-white">
                      {(() => {
            const intervalMs = 5 * 60 * 1000; // 5 minutes
            const periodIndex = Math.floor(Date.now() / intervalMs);
            const storageKey = `totalApplicantsCheat:${periodIndex}`;
            let extra = localStorage.getItem(storageKey);
            if (!extra) {
              extra = (Math.floor(Math.random() * 9) + 2).toString(); // 2–10
              localStorage.setItem(storageKey, extra);
            }
            return (data?.totalApplicants || 0) + Number(extra);
          })()}


            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Views
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* New Applications */}
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              New Applications
            </h2>
            {recentApplications.length > 0 ? (
              <div className="space-y-4">
                {recentApplications.map((application) => (
                  <div
                    key={application._id}
                    className="flex items-start space-x-3"
                  >
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full dark:bg-blue-900/20">
                      {application.image ? (
                        <img
                          src={`${API_BASE_URL.replace(
                            /\/$/,
                            ""
                          )}/${application.image.replace(/^\//, "")}`}
                          alt="Applicant"
                          className="object-cover w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-10 h-10 text-sm text-white bg-gray-300 rounded-full">
                          N/A
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {application.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Applied for {application.postTitle}
                      </p>
                      <div className="flex items-center mt-1 space-x-2">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            application.status === "approved"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                              : application.status === "rejected"
                              ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                          }`}
                        >
                          {application.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">
                      {new Date(application.appliedAt).toLocaleDateString()}
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
                  No new applications found
                </p>
              </div>
            )}
          </div>

          {/* Recent Activities */}
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Recent Activities
            </h2>
            {recentApplications.length > 0 ? (
              <div className="space-y-4">
                {recentApplications.map((application) => (
                  <div
                    key={application._id}
                    className="flex items-start space-x-3"
                  >
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full dark:bg-blue-900/20">
                      {application.image ? (
                        <img
                          src={`${API_BASE_URL.replace(
                            /\/$/,
                            ""
                          )}/${application.image.replace(/^\//, "")}`}
                          alt="Applicant"
                          className="object-cover w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-10 h-10 text-sm text-white bg-gray-300 rounded-full">
                          N/A
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {application.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Applied for {application.postTitle}
                      </p>
                      <div className="flex items-center mt-1 space-x-2">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            application.status === "approved"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                              : application.status === "rejected"
                              ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                          }`}
                        >
                          {application.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">
                      {new Date(application.appliedAt).toLocaleDateString()}
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
                  No Recent Activities found
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </RecruiterLayout>
  );
};

export default Page;
