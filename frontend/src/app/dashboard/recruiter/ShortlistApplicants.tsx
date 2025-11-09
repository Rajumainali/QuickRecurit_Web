import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  ChevronDown,
  ExternalLink,
  User,
  Mail,
  Calendar,
  FileText,
  Eye,
  Check,
  X,
  Star,
  Loader2,
} from "lucide-react";
import RecruiterLayout from "../../../Layouts/RecruiterLayout";
import toast from "react-hot-toast";
const API_BASE_URL = import.meta.env.VITE_API_URL;

interface JobPost {
  _id: string;
  title: string;
  PostType: string;
  requirements: string;
  skills: string;
  companyName: string;
  logo: string;
  applicants: {
    name: string;
    email: string;
    resumeLink: string;
    _id: string;
    appliedAt: string;
    image: string;
    status: string | null;
  }[];
}

interface Applicant {
  name: string;
  email: string;
  resumeLink: string;
  _id: string;
  appliedAt: string;
  image: string;
  status: string | null;
}

interface ApplicantScore {
  applicantId: string;
  score: number;
}

function Shortlistapplicants() {
  const [selectedJob, setSelectedJob] = useState("");
  const [selectedJobId, setSelectedJobId] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
  const [showApplicants, setShowApplicants] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(
    null
  );
  const [applicantScores, setApplicantScores] = useState<ApplicantScore[]>([]);
  const [isLoadingRanks, setIsLoadingRanks] = useState(false);
  const [fullMatchResults, setFullMatchResults] = useState<any[]>([]);
  const [applicantSummary, setApplicantSummary] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [hiddenApplicants, setHiddenApplicants] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    const fetchJobPosts = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${API_BASE_URL}auth/fetch-user-Details`, {
          method: "GET",
          headers: {
            Authorization: `${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch job posts");
        const data = await response.json();
        setJobPosts(data.posts || []);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchJobPosts();
  }, []);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);

  const stripHtmlTags = (html: string) => html.replace(/<[^>]*>/g, "").trim();

  const getRequirementAndResumes = (job: JobPost) => {
    const requirementsText = stripHtmlTags(job.requirements || "");
    const skillsText = stripHtmlTags(job.skills || "");
    const combinedRequirements = `${requirementsText}. ${skillsText}`;
    const resumes = job.applicants.map((applicant) => ({
      name: applicant.name,
      email: applicant.email,
      resumeLink: applicant.resumeLink,
    }));
    return { requirement: combinedRequirements, resumes };
  };

  const handleJobSelect = (job: JobPost) => {
    job.applicants.forEach((applicant) => {
      console.log(`Applicant ${applicant.name} status: ${applicant.status}`);
    });

    setSelectedJob(job.title);
    setSelectedJobId(job._id);
    setIsDropdownOpen(false);
    setShowApplicants(false);
    setApplicantScores([]);
    setHiddenApplicants(new Set()); // Reset hidden applicants when selecting new job
    const data = getRequirementAndResumes(job);
    console.log("Requirements and Resumes:", data);
  };

  const handleManageApplicants = () => {
    if (selectedJob && selectedJobId) setShowApplicants(true);
  };

  const handleViewApplicant = (applicant: Applicant) => {
    const resumeFileName = applicant.resumeLink.split("/").pop();
    const matched = fullMatchResults.find((match) =>
      match["Resume Name"].includes(resumeFileName)
    );
    if (matched) {
      setApplicantSummary(matched.Summary || null);
      setShowModal(true);
    } else {
      setApplicantSummary(null);
      setShowModal(false);
    }
  };

  // Updated function to send email to shortlisted applicants
  const handleSendEmail = async (applicant: Applicant) => {
    const token = localStorage.getItem("token");
    const jobTitle = selectedJob;

    // Find the selected job post by ID
    const selectedJobPost = jobPosts.find((job) => job._id === selectedJobId);

    // Get the company name and logo from the selected job post
    const companyName = selectedJobPost ? selectedJobPost.companyName : "";
    const companyLogo = selectedJobPost ? selectedJobPost.logo : "";

    if (!companyName || !companyLogo) {
      toast.error("Company name or logo is not available.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}auth/send-shortlist-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({
          candidateEmail: applicant.email,
          candidateName: applicant.name,
          jobTitle: jobTitle,
          companyName: companyName,
        }),
      });

      if (!response.ok) throw new Error("Failed to send email");
      toast.success("Email sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send email.");
    }
  };

  // Updated handleStatusChange function with hiding functionality
  const handleStatusChange = async (applicantId: string, newStatus: string) => {
    console.log(applicantId);
    console.log(newStatus);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${API_BASE_URL}auth/update-status/${applicantId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) throw new Error("Failed to update applicant status");

      // Update the local state
      setJobPosts((prevJobPosts) =>
        prevJobPosts.map((job) => {
          if (job._id === selectedJobId) {
            return {
              ...job,
              applicants: job.applicants.map((applicant) =>
                applicant._id === applicantId
                  ? { ...applicant, status: newStatus }
                  : applicant
              ),
            };
          }
          return job;
        })
      );

      // Hide the applicant div by adding to hiddenApplicants set
      setHiddenApplicants((prev) => new Set(prev).add(applicantId));

      // Remove from scores if status changed
      setApplicantScores((prevScores) =>
        prevScores.filter((score) => score.applicantId !== applicantId)
      );

      if (newStatus === "approved") {
        toast.success("Applicant approved successfully");
      } else if (newStatus === "rejected") {
        toast.success("Applicant rejected successfully");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update application status");
    }
  };

  const getApplicantScore = (applicantId: string): number | null => {
    const scoreData = applicantScores.find(
      (score) => score.applicantId === applicantId
    );
    return scoreData ? scoreData.score : null;
  };

  // Get current job applicants with updated state
  const currentJobApplicants =
    jobPosts.find((job) => job._id === selectedJobId)?.applicants || [];

  // Filter only approved (shortlisted) applicants for display, excluding hidden ones
  const shortlistedApplicants = currentJobApplicants.filter(
    (applicant) =>
      applicant.status === "approved" && !hiddenApplicants.has(applicant._id)
  );

  // Count total shortlisted applicants for the selected job (including hidden ones)
  const totalShortlistedCount = currentJobApplicants.filter(
    (applicant) => applicant.status === "approved"
  ).length;

  return (
    <RecruiterLayout>
      <div className="min-h-screen bg-gray-50 p-6 rounded-4xl dark:bg-[#101828]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
              Shortlisted Applicants
            </h1>
            <div className="flex items-center mb-8 text-sm text-gray-600">
              <span className="cursor-pointer hover:text-gray-900 dark:text-gray-400">
                Dashboard
              </span>
              <ChevronRight className="w-4 h-4 mx-2" />
              <span className="text-gray-400 dark:text-gray-300">
                Manage Applicants
              </span>
              <ChevronRight className="w-4 h-4 mx-2" />
              <span className="text-gray-400 dark:text-gray-300">
                Shortlisted Applicants
              </span>
            </div>
          </div>

          {/* Job Selection Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 dark:bg-[#1E2939] mb-6">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="mb-4 text-2xl font-semibold text-gray-700 dark:text-gray-300">
                Select Job to View Shortlisted Applicants
              </h2>

              <p className="mb-8 leading-relaxed text-gray-500 dark:text-gray-400">
                Select a job or internship to view and manage the shortlisted
                (approved) applicants. You can approve or reject them again for
                final verification.
              </p>

              <div className="flex items-center max-w-lg gap-4 mx-auto">
                <div className="relative flex-1">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center justify-between w-full px-4 py-3 text-left transition-colors bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 dark:bg-gray-800 dark:border-gray-600"
                  >
                    <span
                      className={
                        selectedJob
                          ? "text-gray-900 dark:text-gray-200"
                          : "text-gray-400"
                      }
                    >
                      {selectedJob || "Search & Select job or internship"}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-600 max-h-60">
                      {jobPosts.map((job, index) => (
                        <button
                          key={job._id || index}
                          onClick={() => handleJobSelect(job)}
                          className="w-full px-4 py-3 text-left border-b border-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-200 focus:bg-gray-50 dark:focus:bg-gray-700 focus:outline-none dark:border-gray-700 last:border-b-0"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-900 dark:text-gray-200">
                                {job.title}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {job.PostType}
                              </div>
                            </div>
                            <div className="text-sm text-green-600 dark:text-green-400">
                              {job.applicants?.filter(
                                (app) => app.status === "approved"
                              ).length || 0}{" "}
                              shortlisted
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleManageApplicants}
                  disabled={!selectedJob}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                    selectedJob
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700"
                  }`}
                >
                  <ExternalLink className="w-4 h-4" />
                  View Shortlisted
                </button>
              </div>
            </div>
          </div>

          {/* Shortlisted Applicants List */}
          {showApplicants && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-[#1E2939] dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Shortlisted Applicants for "{selectedJob}"
                    </h3>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">
                      {shortlistedApplicants.length} of {totalShortlistedCount}{" "}
                      shortlisted applicants
                      {hiddenApplicants.size > 0 && (
                        <span className="px-2 py-1 ml-2 text-xs bg-gray-100 rounded-full dark:bg-gray-700">
                          {hiddenApplicants.size} processed
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {shortlistedApplicants
                  .map((applicant) => ({
                    ...applicant,
                    score: getApplicantScore(applicant._id),
                  }))
                  .sort((a, b) => {
                    // Put those without score at the bottom
                    if (a.score === null) return 1;
                    if (b.score === null) return -1;
                    return b.score - a.score;
                  })
                  .map((applicant) => {
                    const applicantScore = applicant.score;
                    const hasScore = applicantScore !== null;

                    return (
                      <div
                        key={applicant._id}
                        className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start flex-1 gap-4">
                            {applicant.image ? (
                              <img
                                src={`${API_BASE_URL.replace(
                                  /\/$/,
                                  ""
                                )}/${applicant.image.replace(/^\//, "")}`}
                                alt="Applicant"
                                className="object-cover w-10 h-10 rounded-full"
                              />
                            ) : (
                              <div className="flex items-center justify-center w-10 h-10 text-sm text-white bg-gray-300 rounded-full">
                                N/A
                              </div>
                            )}

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                      {applicant.name}
                                    </h4>
                                    <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full dark:bg-green-900/30 dark:text-green-300">
                                      Shortlisted
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                                    <div className="flex items-center gap-1">
                                      <Mail className="w-4 h-4" />
                                      {applicant.email}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                                    <div className="flex items-center gap-1">
                                      <Calendar className="w-4 h-4" />
                                      Applied:{" "}
                                      {new Date(
                                        applicant.appliedAt
                                      ).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "2-digit",
                                      })}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex items-center gap-3 mt-4">
                                <a
                                  href={`http://localhost:5000${applicant.resumeLink}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 px-3 py-1 text-sm text-blue-700 transition-colors bg-blue-100 rounded-md dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50"
                                >
                                  <FileText className="w-4 h-4" />
                                  Resume
                                </a>

                                <button
                                  onClick={() =>
                                    handleStatusChange(
                                      applicant._id,
                                      "rejected"
                                    )
                                  }
                                  className="flex items-center gap-1 px-3 py-1 text-sm text-red-700 transition-colors bg-red-100 rounded-md dark:bg-red-900/30 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50"
                                  type="button"
                                >
                                  <X className="w-4 h-4" />
                                  Reject
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* New Send Email Button on the Right */}
                          <div className="flex items-center">
                            <button
                              onClick={() => handleSendEmail(applicant)}
                              className="flex items-center gap-1 px-4 py-2 text-sm text-green-700 transition-colors bg-green-100 rounded-md dark:bg-green-900/30 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50"
                              type="button"
                            >
                              <Mail className="w-4 h-4" />
                              Send Email
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {shortlistedApplicants.length === 0 && (
                <div className="p-12 text-center">
                  <User className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                  <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                    {totalShortlistedCount === 0
                      ? "No Shortlisted Applications"
                      : "All Applicants Processed"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {totalShortlistedCount === 0
                      ? "No applications have been shortlisted for this position yet."
                      : "All shortlisted applicants have been processed."}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Summary Modal */}
          {showModal && applicantSummary && (
            <div className="fixed inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-[0px] flex items-center justify-center z-50 p-4 shadow-l">
              <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto transition-all">
                {/* Sticky Header */}
                <div className="sticky top-0 z-20 flex items-center justify-between p-6 bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Shortlisted Applicant Summary
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-600 hover:text-red-500 dark:text-gray-300 dark:hover:text-red-400"
                    title="Close"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-8 space-y-6">
                  <div className="space-y-5 text-base leading-relaxed text-gray-700 dark:text-gray-300">
                    <div>
                      <h4 className="mb-1 font-semibold text-gray-900 dark:text-gray-100">
                        Professional Summary:
                      </h4>
                      <p>{applicantSummary["Professional Summary"]}</p>
                    </div>

                    <div>
                      <h4 className="mb-1 font-semibold text-gray-900 dark:text-gray-100">
                        Skills:
                      </h4>
                      <p>{applicantSummary["Skills"]}</p>
                    </div>

                    <div>
                      <h4 className="mb-1 font-semibold text-gray-900 dark:text-gray-100">
                        Experience:
                      </h4>
                      <p className="whitespace-pre-line">
                        {applicantSummary["Experience"]}
                      </p>
                    </div>

                    <div>
                      <h4 className="mb-1 font-semibold text-gray-900 dark:text-gray-100">
                        Education:
                      </h4>
                      <p>{applicantSummary["Education"]}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </RecruiterLayout>
  );
}

export default Shortlistapplicants;
