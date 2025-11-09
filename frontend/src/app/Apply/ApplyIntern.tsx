import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { DollarSign, MapPin, BarChart, Users } from "lucide-react";
import { Separator } from "../../components/ui/separator";

const API_BASE_URL = import.meta.env.VITE_API_URL;

interface JobPost {
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
  postedAt: string;
  recruiterEmail: string;
  companyName: string;
  logo: string;
  _id:string;
}

const ApplyIntern: React.FC = () => {
  const { title } = useParams<{ title: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<JobPost | null>(null);
  const [loading, setLoading] = useState<boolean>(true);


  // Slugify function — same as before
  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/\//g, "-")
      .replace(/[^\w-]+/g, "");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}auth/GetAllPosts`);
        const data = await res.json();

        const posts = Array.isArray(data) ? data : data?.posts;
        if (!Array.isArray(posts)) {
          navigate("/");
          return;
        }

        const slugFromUrl = title || "";
        const normalizedSlug = slugify(decodeURIComponent(slugFromUrl));

        // Find job by comparing slugified job titles
        const matchedJob = posts.find(
          (p: JobPost) => slugify(p.title) === normalizedSlug
        );

        if (!matchedJob) {
          navigate("/not-found");
          return;
        }

        setJob(matchedJob);
      } catch (error) {
        console.error("Failed to fetch job posts:", error);
        navigate("/not-found");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [title, navigate]);

  if (loading || !job)
    return (
      <div className="text-center p-8 text-lg font-medium">Loading...</div>
    );

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Apply Internship
          </h1>
          <div className="flex items-center text-sm text-gray-500 space-x-2">
            <a href="/" className="hover:underline">
              Home
            </a>
            <ChevronRight className="w-4 h-4" />
            <a href="/search" className="hover:underline">
              Apply Internship
            </a>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-400">{job.title}</span>
          </div>
        </div>

        {/* Job Overview Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
            {job.title}
          </h2>
          <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-300 mb-4">
            <span className="font-medium">{job.companyName}</span>
            <span>• {job.city}</span>
            <span>• {job.type}</span>
          </div>

          <div className="mt-6">
            {/* ShadCN Separator */}
            <Separator className="mb-6" />

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
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
                    {job.level}
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
                    {job.openings}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
              Job Description
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              We’re looking for a talented and creative{" "}
              <strong>{job.title}</strong> to join our team! Enhance brand
              visibility and engagement by producing dynamic content.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
              Requirements
            </h3>
            <div
              className="prose  prose-sm dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: job?.requirements || "" }}
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
              Skills
            </h3>
            <div
              className="prose prose-sm dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: job?.skills || "" }}
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
            <p className="text-sm text-red-800">Deadline: {job.deadline}</p>
            <button
              
              className="bg-[#5b43a3] hover:bg-red-700 transition text-white px-6 py-2 rounded-md font-medium shadow"
            >
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApplyIntern;
