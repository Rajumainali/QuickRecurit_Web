import React, { useState, useEffect } from "react";
import {
  ChevronsRight,
  Building,
  BadgeDollarSign,
  Filter,
  MapPin,
  X,
  DollarSign,
  BarChart,
  Users,
} from "lucide-react";
import { Separator } from "../../components/ui/separator";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL;

type PostType = {
  title: string;
  sector: string;
  level: string;
  type?: string;
  location: string;
  city: string;
  openings: string;
  minSalary: string;
  maxSalary: string;
  deadline: string;
  requirements?: string;
  skills?: string;
  PostType: string;
  postedAt: string;
  recruiterEmail: string;
  companyName: string;
  logo?: string;
  _id?: string;
};

const ApplyOnReal = async (
  id: string | undefined,
  sector: string | undefined,
  onClose: () => void
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

    onClose(); // Close the modal regardless
  } catch (err) {
    console.error("Apply error:", err);
    toast.error("Something went wrong. Try again.");
    onClose();
  }
};
// Modal Component
const JobModal: React.FC<{
  job: PostType;
  isOpen: boolean;
  onClose: () => void;
}> = ({ job, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-[0px] flex items-center justify-center z-50 p-4 shadow-l"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white border-b border-gray-200 dark:border-gray-700 dark:bg-gray-800">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Apply for Job
          </h1>
          <button
            onClick={onClose}
            className="p-2 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {/* Job Overview Card */}
          <div className="p-6 mb-6 rounded-lg bg-gray-50 dark:bg-gray-700">
            <h2 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white">
              {job.title}
            </h2>
            <div className="flex flex-wrap items-center gap-4 mb-4 text-gray-600 dark:text-gray-300">
              <span className="font-medium">{job.companyName}</span>
              <span>• {job.city}</span>
              <span>• {job.type}</span>
            </div>

            <div className="mt-6">
              <Separator className="mb-6" />

              {/* Info Grid */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
                {/* Salary */}
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <DollarSign className="text-[#4721bb]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Offered Salary</p>
                    <p className="font-semibold text-gray-800 dark:text-gray-100">
                      ${job.minSalary} - ${job.maxSalary}{" "}
                      <span className="text-sm text-gray-500">/ Monthly</span>
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <MapPin className="text-[#4721bb]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="font-semibold text-gray-800 dark:text-gray-100">
                      {job.location}
                    </p>
                  </div>
                </div>

                {/* Level */}
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <BarChart className="text-[#4721bb]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Level</p>
                    <p className="font-semibold text-gray-800 dark:text-gray-100">
                      {job.level || "Not specified"}
                    </p>
                  </div>
                </div>

                {/* Openings */}
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <Users className="text-[#4721bb]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Openings</p>
                    <p className="font-semibold text-gray-800 dark:text-gray-100">
                      {job.openings || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">
                Job Description
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                We're looking for a talented and creative{" "}
                <strong>{job.title}</strong> to join our team! Enhance brand
                visibility and engagement by producing dynamic content.
              </p>
            </div>

            {job.requirements && (
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">
                  Requirements
                </h3>
                <div
                  className="prose prose-sm dark:prose-invert max-w-none list-disc list-inside [&_ol]:list-decimal [&_ul]:list-disc [&_li]:my-1"
                  dangerouslySetInnerHTML={{ __html: job.requirements }}
                />
              </div>
            )}

            {job.skills && (
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">
                  Skills
                </h3>
                <div
                  className="prose prose-sm dark:prose-invert max-w-none list-disc list-inside [&_ol]:list-decimal [&_ul]:list-disc [&_li]:my-1"
                  dangerouslySetInnerHTML={{ __html: job.skills }}
                />
              </div>
            )}

            <div className="sticky bottom-0 z-10 flex flex-col items-start justify-between gap-4 pt-4 p-5 mt-4 -ml-6 bg-white border-t border-gray-200 w-[870px] sm:flex-row sm:items-center dark:border-gray-700 dark:bg-gray-800">
              {job.deadline && (
                <p className="text-sm text-red-800 dark:text-red-400">
                  Deadline: {job.deadline}
                </p>
              )}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2 font-medium text-white transition bg-gray-500 rounded-md shadow hover:bg-gray-600"
                >
                  Close
                </button>
                <button
                  onClick={() => ApplyOnReal(job._id, job.sector, onClose)}
                  className="bg-[#5b43a3] hover:bg-purple-700 transition text-white px-6 py-2 rounded-md font-medium shadow"
                >
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Individual Vacancy Card Component
const VacancyCardItem: React.FC<{ post: PostType }> = ({ post }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Prevent background scroll when modal is open
  React.useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  const cleanDescription =
    post.requirements
      ?.replace(/<[^>]*>?/gm, "")
      .replace(/&nbsp;/g, " ")
      .trim() || "";
  const truncatedDescription =
    cleanDescription.length > 100
      ? cleanDescription.slice(0, 100) + "..."
      : cleanDescription;

  const postDate = new Date(post.postedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const handleApply = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You need to Login first");
      window.scrollTo({ top: 0, behavior: "smooth" });

      // Delay navigation to let scroll take effect
      setTimeout(() => {
        navigate("/login");
      }, 300);
      return;
    }

    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex flex-col justify-between h-full p-5 transition-all duration-300 bg-white shadow-md dark:bg-zinc-800 rounded-2xl hover:shadow-xl">
        <div className="flex flex-col gap-3">
          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-700">
              {post.logo ? (
                <img
                  src={`${API_BASE_URL}upload/logos/${post.logo}`}
                  alt={post.companyName}
                  className="object-cover w-full h-full"
                />
              ) : (
                <Building className="w-5 h-5 text-gray-400" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-md dark:text-white">
                {post.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {post.companyName}
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {truncatedDescription}
          </p>
        </div>

        {/* Footer Info */}
        <div className="mt-4 space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <p>
            <span className="font-medium">Deadline:</span> {postDate}
          </p>
          <p className="flex items-center gap-1">
            <MapPin className="w-4 h-4" /> {post.city}
          </p>
          <p className="flex items-center gap-1 text-green-600 dark:text-green-300">
            <BadgeDollarSign className="w-4 h-4" />${post.minSalary} - $
            {post.maxSalary}/Month
          </p>
          <p className="flex items-center gap-1 text-blue-600 dark:text-blue-300">
            <Filter className="w-4 h-4" />
            {post.type || "Full-Time"}
          </p>
        </div>

        {/* Apply Button */}
        <button
          onClick={handleApply}
          className="flex items-center justify-center w-full gap-2 px-4 py-2 mt-5 font-semibold text-white transition-all bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl"
        >
          APPLY NOW <ChevronsRight className="w-4 h-4" />
        </button>
      </div>

      {/* Modal */}
      <JobModal job={post} isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
};

// Main Component with API fetching
function VacancyCard() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [sortBy, setSortBy] = useState<"popular" | "latest">("popular");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}auth/GetAllPosts/job`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data = await res.json();
        setPosts(data.posts || []);
      } catch (error) {
        console.error("Error fetching posts:", error);
        toast.error("Failed to load posts. Please try again later.");
      }
    };

    fetchPosts();
  }, []);

  const sortedPosts = [...posts].sort((a, b) => {
    if (sortBy === "latest") {
      return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
    }
    return parseInt(b.openings) - parseInt(a.openings);
  });

  return (
    <div className="min-h-screen py-12 dark:bg-black">
      {/* Heading Section */}
      <div className="mb-12 text-center">
        <div className="inline-block px-4 py-1 mb-4 text-sm font-medium text-gray-800 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-200">
          JOB VACANCY
        </div>
        <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl dark:text-zinc-200">
          Discover the best job
        </h1>
        <p className="max-w-2xl mx-auto text-lg leading-relaxed text-center text-gray-600 dark:text-zinc-400">
          Start career with the best company in the world, we ensure you to get
          <br />
          the best job possible.
        </p>
      </div>

      {/* Card Grid */}
      <div className="max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
        {sortedPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-5 text-center shadow-inner rounded-2xl bg-gradient-to-b from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-800 animate-fadeIn">
            <div className="flex items-center justify-center w-20 h-20 mb-6 rounded-full shadow-lg bg-gradient-to-r from-purple-500 to-blue-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">
              No Job Vacancies Available
            </h2>

            <p className="max-w-xl mt-3 text-lg text-gray-600 dark:text-gray-400">
              We couldn’t find any openings right now. Don’t worry — new
              opportunities are posted regularly. Check back soon!
            </p>

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="mt-8 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-full shadow-md transition-transform hover:scale-105"
            >
              Refresh Jobs
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 animate-fadeIn">
            {sortedPosts.map((post, index) => (
              <VacancyCardItem key={index} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default VacancyCard;
