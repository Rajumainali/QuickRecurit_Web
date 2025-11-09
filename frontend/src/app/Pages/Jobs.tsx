import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import Navbar from "../_components/navbar";
import Footer from "../_components/footer";
import parse from "html-react-parser";
import toast from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL;

interface Applicant {
  name: string;
  email: string;
  resumeLink: string;
  image: string;
  status: string;
  _id: string;
  appliedAt: string;
}

interface JobPost {
  _id: string;
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
  postedAt: string;
  applicants: Applicant[];
  recruiterEmail: string;
  companyName: string;
  logo: string;
}
const ApplyOnReal = async (
  id: string | undefined,
  sector: string | undefined
) => {
  const token = localStorage.getItem("token");

  if (!id || !token) {
    toast.error("You need to login first or invalid post.");
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}auth/apply/${id}/${sector}`, {
      method: "GET",
      headers: {
        Authorization: `${token}`,
      },
    });

    const data = await res.json();

    if (res.ok) {
      toast.success(data.message || "Applied successfully!");
    } else {
      toast.error(data.message || "Unable to apply.");
    }
  } catch (err) {
    console.error("Apply error:", err);
    toast.error("Something went wrong. Try again.");
  }
};

const Jobs: React.FC = () => {
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:5000/auth/GetAllPosts/job")
      .then((res) => res.json())
      .then((data) => {
        // Either data is already an array (unlikely) or it's wrapped in `posts`
        const jobArray = Array.isArray(data) ? data : data.posts;
        if (!Array.isArray(jobArray)) {
          console.error("Unexpected payload:", data);
          setJobs([]);
          setLoading(false);
          return;
        }
        setJobs(jobArray);
        setSelectedJob(jobArray[0] || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setJobs([]);
        setLoading(false);
      });
  }, []);

  const today = dayjs();
  const isExpired = (deadline: string) => dayjs(deadline).isBefore(today);
  const daysLeft = (deadline: string) => dayjs(deadline).diff(today, "day");
  const formattedRequirements = `
  <ul>
    ${selectedJob?.requirements
      .split("\n")
      .filter((line) => line.trim() !== "")
      .map((line) => `<li>${line.trim()}</li>`)
      .join("")}
  </ul>
`;

  // No Jobs Available Component
  const NoJobsAvailable = () => (
    <div className="flex items-center justify-center min-h-screen dark:bg-gray-950">
      <div className="max-w-2xl p-6 mx-auto text-center">
        <div className="p-12 bg-white border border-gray-100 shadow-2xl dark:bg-gray-800 rounded-3xl dark:border-gray-700">
          {/* Animated Icon */}
          <div className="relative mb-8">
            <div className="relative flex items-center justify-center w-32 h-32 mx-auto overflow-hidden rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 animate-pulse"></div>
              <svg
                className="relative z-10 w-16 h-16 text-gray-400 dark:text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"
                />
              </svg>
            </div>
            {/* Floating elements */}
            <div className="absolute top-0 w-3 h-3 bg-blue-400 rounded-full left-1/4 animate-bounce opacity-60"></div>
            <div
              className="absolute w-2 h-2 bg-purple-400 rounded-full top-8 right-1/4 animate-bounce opacity-60"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div
              className="absolute w-2 h-2 bg-pink-400 rounded-full bottom-4 left-1/3 animate-bounce opacity-60"
              style={{ animationDelay: "1s" }}
            ></div>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <div>
              <h2 className="mb-3 text-3xl font-bold text-gray-900 dark:text-white">
                No Jobs Available
              </h2>
              <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                We don't have any job postings at the moment, but exciting
                opportunities are on the way!
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 gap-4 mt-8 md:grid-cols-3">
              <div className="p-4 border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl dark:border-blue-800/30">
                <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 bg-blue-500 rounded-lg">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Get Notified
                </h3>
                <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                  Be first to know when new jobs are posted
                </p>
              </div>

              <div className="p-4 border border-green-100 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl dark:border-green-800/30">
                <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 bg-green-500 rounded-lg">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Build Profile
                </h3>
                <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                  Perfect your profile while you wait
                </p>
              </div>

              <div className="p-4 border border-purple-100 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl dark:border-purple-800/30">
                <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 bg-purple-500 rounded-lg">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Stay Updated
                </h3>
                <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                  Check back regularly for new postings
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col items-center justify-center gap-4 pt-6 sm:flex-row">
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                Subscribe to Alerts
              </button>

              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 px-8 py-3 font-semibold text-gray-700 transition-all duration-200 bg-white border-2 border-gray-200 dark:bg-gray-700 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 dark:text-gray-300 rounded-xl hover:shadow-lg"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh Page
              </button>
            </div>

            {/* Additional Info */}
            <div className="p-4 mt-8 border-l-4 border-blue-500 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium text-blue-600 dark:text-blue-400">
                  Tip:
                </span>
                New job postings are typically added during business hours.
                Check back later or subscribe to get notified instantly!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen dark:bg-gray-950">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading jobs...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // No jobs state
  if (jobs.length === 0) {
    return (
      <>
        <Navbar />
        <NoJobsAvailable />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen dark:bg-gray-950">
        <div className="p-6 mx-auto max-w-7xl">
          <div className="flex h-screen gap-8 mt-6">
            {/* Left panel - Jobs List - Scrollable */}
            <div className="flex flex-col w-1/3 ">
              <div className="flex flex-col h-full bg-white border border-gray-100 shadow-lg dark:bg-gray-800 rounded-xl dark:border-gray-700">
                <div className="flex-shrink-0 p-6 border-b border-gray-100 dark:border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Available Positions
                  </h2>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {jobs.length} Job{jobs.length !== 1 ? "s" : ""} found
                  </p>
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="h-full p-2 space-y-1 overflow-y-auto">
                    {jobs.map((job) => (
                      <div
                        key={job._id}
                        onClick={() => setSelectedJob(job)}
                        className={`rounded-lg p-5 cursor-pointer transition-all duration-200 hover:shadow-md ${
                          selectedJob?._id === job._id
                            ? "bg-gradient-to-r from-pink-50 to-peach-50 border-2 border-pink-200 dark:from-pink-950/20 dark:to-peach-900/20 dark:border-pink-600/50 shadow-md"
                            : "hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-bold leading-tight text-gray-900 dark:text-white">
                            {job.title}
                          </h3>
                          {selectedJob?._id === job._id && (
                            <div className="flex-shrink-0 w-2 h-2 mt-2 bg-red-500 rounded-full"></div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center justify-center w-8 h-8 overflow-hidden rounded-lg">
                            <img
                              src={`${API_BASE_URL}upload/logos/${job.logo}`} // adjust path as per your setup
                              alt={job.companyName}
                              className="object-cover w-full h-full"
                            />
                          </div>

                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {job.companyName}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="px-3 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900/30 dark:text-blue-300">
                            #{job.PostType}
                          </span>
                          <span className="px-3 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                            {job.type}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-sm">
                            {isExpired(job.deadline) ? (
                              <span className="inline-flex items-center gap-1 font-medium text-red-600 dark:text-red-400">
                                <svg
                                  className="w-4 h-4"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Expired
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 font-medium text-orange-600 dark:text-orange-400">
                                <svg
                                  className="w-4 h-4"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                {daysLeft(job.deadline)} days left
                              </span>
                            )}
                          </div>
                          <button className="flex items-center gap-1 text-sm font-medium text-blue-600 transition-colors dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200">
                            View Details
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
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right panel - Job Details - Fixed */}
            {selectedJob && (
              <div className="flex flex-col w-2/3">
                <div className="flex flex-col h-full bg-white border border-gray-100 shadow-lg dark:bg-gray-800 rounded-xl dark:border-gray-700">
                  {/* Header - Fixed */}
                  <div className="flex-shrink-0 p-8 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-t-xl">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h2 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
                          {selectedJob.title}
                        </h2>
                        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-8 h-8 overflow-hidden rounded-lg">
                              <img
                                src={`${API_BASE_URL}upload/logos/${selectedJob.logo}`} // adjust path as per your setup
                                alt={selectedJob.companyName}
                                className="object-cover w-full h-full"
                              />
                            </div>
                            <span className="font-medium">
                              {selectedJob.companyName}
                            </span>
                          </div>
                          <span className="text-gray-400">•</span>
                          <span>{selectedJob.city}</span>
                          <span className="text-gray-400">•</span>
                          <span className="px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900/30 dark:text-blue-300">
                            {selectedJob.type}
                          </span>
                        </div>
                      </div>
                      {/* ✅ APPLY BUTTON integrated here */}
                      <button
                        onClick={() =>
                          ApplyOnReal(selectedJob._id, selectedJob.sector)
                        }
                        className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>

                  {/* Scrollable Content */}
                  <div className="flex-1 overflow-y-auto">
                    <div className="p-8">
                      {/* Key Details Grid */}
                      <div className="grid grid-cols-2 gap-6 mb-8">
                        <div className="p-5 border border-green-100 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl dark:border-green-800/30">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex items-center justify-center w-8 h-8 bg-green-500 rounded-lg">
                              <svg
                                className="w-4 h-4 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <span className="font-semibold text-gray-900 dark:text-white">
                              Salary Range
                            </span>
                          </div>
                          <p className="text-lg font-bold text-green-800 dark:text-green-300">
                            Rs {selectedJob.minSalary} - {selectedJob.maxSalary}
                          </p>
                          <p className="text-sm text-green-600 dark:text-green-400">
                            per month
                          </p>
                        </div>

                        <div className="p-5 border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl dark:border-blue-800/30">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-lg">
                              <svg
                                className="w-4 h-4 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <span className="font-semibold text-gray-900 dark:text-white">
                              Location
                            </span>
                          </div>
                          <p className="text-lg font-bold text-blue-800 dark:text-blue-300">
                            {selectedJob.location}
                          </p>
                        </div>

                        <div className="p-5 border border-purple-100 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl dark:border-purple-800/30">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex items-center justify-center w-8 h-8 bg-purple-500 rounded-lg">
                              <svg
                                className="w-4 h-4 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <span className="font-semibold text-gray-900 dark:text-white">
                              Experience Level
                            </span>
                          </div>
                          <p className="text-lg font-bold text-purple-800 dark:text-purple-300">
                            {selectedJob.level}
                          </p>
                        </div>

                        <div className="p-5 border border-orange-100 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-xl dark:border-orange-800/30">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex items-center justify-center w-8 h-8 bg-orange-500 rounded-lg">
                              <svg
                                className="w-4 h-4 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                              </svg>
                            </div>
                            <span className="font-semibold text-gray-900 dark:text-white">
                              Openings
                            </span>
                          </div>
                          <p className="text-lg font-bold text-orange-800 dark:text-orange-300">
                            {selectedJob.openings} positions
                          </p>
                        </div>
                      </div>

                      {/* Job Description */}
                      <div className="mb-8">
                        <h3 className="flex items-center gap-2 mb-4 text-xl font-bold text-gray-900 dark:text-white">
                          <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                            <svg
                              className="w-4 h-4 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          Job Description
                        </h3>
                        <div className="p-6 border-l-4 border-blue-500 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                          <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                            We're looking for a talented and creative{" "}
                            <strong className="text-blue-600 dark:text-blue-400">
                              {selectedJob.title}
                            </strong>{" "}
                            to join our team! This role requires someone skilled
                            in React and UI logic, eager to build quality
                            products and grow their career in a supportive
                            environment.
                          </p>
                        </div>
                      </div>

                      {/* Requirements */}
                      {/* Requirements */}
                      <div className="mb-8">
                        <h4 className="flex items-center gap-2 mb-4 text-xl font-bold text-gray-900 dark:text-white">
                          <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-gradient-to-r from-red-500 to-pink-600">
                            <svg
                              className="w-4 h-4 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          Requirements
                        </h4>

                        <div className="p-6 border border-red-100 bg-red-50 dark:bg-red-900/10 rounded-xl dark:border-red-900/30">
                          <div
                            className="prose prose-sm dark:prose-invert max-w-none list-disc list-inside [&_ol]:list-decimal [&_ul]:list-disc [&_li]:my-1 text-gray-700 dark:text-gray-300"
                            dangerouslySetInnerHTML={{
                              __html: formattedRequirements,
                            }}
                          />
                        </div>
                      </div>

                      {/* Skills */}
                      <div>
                        <h4 className="flex items-center gap-2 mb-4 text-xl font-bold text-gray-900 dark:text-white">
                          <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600">
                            <svg
                              className="w-4 h-4 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </div>
                          Required Skills
                        </h4>

                        <div className="p-6 border bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border-emerald-100 dark:border-emerald-900/30">
                          <div
                            className="prose prose-sm dark:prose-invert max-w-none list-disc list-inside [&_ol]:list-decimal [&_ul]:list-disc [&_li]:my-1 text-gray-700 dark:text-gray-300"
                            dangerouslySetInnerHTML={{
                              __html: selectedJob.skills,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Jobs;
