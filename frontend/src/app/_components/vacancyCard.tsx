import React, { useState } from "react";
import { ChevronsRight, Building, BadgeDollarSign, X } from "lucide-react";
import { DollarSign, MapPin, BarChart, Users } from "lucide-react";
import { Separator } from "../../components/ui/separator";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL;

type ApplicantType = {
  name: string;
  email: string;
  resumeLink: string;
  image: string;
  predictedCategory: string;
  status: string;
  _id: string;
  appliedAt: string;
};
type PostType = {
  companyName: string;
  city: string;
  location: string;
  requirements?: string;
  deadline?: string;
  type?: string;
  logo?: string;
  title?: string;
  minSalary?: string;
  maxSalary?: string;
  sector?: string;
  level?: string;
  openings?: string;
  skills?: string;
  postedAt?: string;
  recruiterEmail?: string;
  _id?: string;
  applicants?: ApplicantType[];
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
            Apply Internship
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
                      Rs {job.minSalary} - {job.maxSalary}{" "}
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
            <div className="sticky bottom-0 z-10 flex flex-col items-start justify-between gap-4 pt-4 p-5 mt-4 -ml-6 bg-white border-t border-gray-200 w-[870px] sm:flex-row sm:items-center dark:border-gray-700 dark:bg-gray-800 ">
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

function VacancyCard({ post }: { post: PostType }) {
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
    post.requirements?.replace(/<[^>]*>?/gm, "").trim() || "";
  const truncatedDescription =
    cleanDescription.length > 100
      ? cleanDescription.slice(0, 100) + "..."
      : cleanDescription;

  const handleApply = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You need to Login first");
      window.scrollTo({ top: 0, behavior: "smooth" });

      // Delay navigation to let scroll take effect
      setTimeout(() => {
        navigate("/login");
      }, 300); // 300ms delay works well
      return;
    }

    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="bg-white dark:bg-[#3D3D3D] border-none rounded-2xl p-4 shadow-sm mt-7 w-[300px] flex-shrink-0 flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="flex items-start gap-3 mb-2">
          <div className="flex-shrink-0 w-10 h-10 overflow-hidden bg-gray-100 rounded-lg dark:bg-gray-600">
            {post.logo ? (
              <img
                src={`${API_BASE_URL}upload/logos/${post.logo}`}
                alt={`${post.companyName} logo`}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <Building className="w-5 h-5 text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-semibold text-gray-900 dark:text-[#ECECEC] truncate">
              {post.companyName}
            </h1>
            <p className="text-xs text-gray-500 dark:text-[#ECECE1] truncate">
              {post.city}, {post.location}
            </p>
          </div>
        </div>

        {/* Job title + Salary */}
        {post.title && (
          <h2 className="mb-1 text-sm font-bold text-gray-800 truncate dark:text-white">
            {post.title}
          </h2>
        )}
        {post.minSalary && post.maxSalary && (
          <div className="flex items-center gap-1 mb-2 text-xs font-medium text-green-600 truncate dark:text-green-300">
            <BadgeDollarSign className="w-4 h-4" />
            NPR {post.minSalary} - {post.maxSalary}
          </div>
        )}

        {/* Description */}
        <p className="text-xs text-gray-600 dark:text-[#ECECE1] leading-relaxed mb-3 line-clamp-3">
          {truncatedDescription}
          {cleanDescription.length > 100 && (
            <span className="ml-1 font-medium text-blue-600 cursor-pointer dark:text-blue-300 hover:underline">
              Read More
            </span>
          )}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.deadline && (
            <span className="px-2 py-0.5 bg-red-50 text-red-700 text-xs font-medium rounded-full dark:bg-red-900/20 dark:text-red-300 truncate">
              Deadline: {post.deadline}
            </span>
          )}
          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full dark:bg-blue-900/20 dark:text-blue-300 truncate">
            {post.city}
          </span>
          {post.type && (
            <span className="px-2 py-0.5 bg-green-50 text-green-700 text-xs font-medium rounded-full dark:bg-green-900/20 dark:text-green-300 truncate">
              {post.type}
            </span>
          )}
        </div>

        {/* Button */}
        <button
          onClick={handleApply}
          className="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 rounded-lg shadow-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          APPLY NOW
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>

      {/* Modal */}
      <JobModal job={post} isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
}

export default VacancyCard;
