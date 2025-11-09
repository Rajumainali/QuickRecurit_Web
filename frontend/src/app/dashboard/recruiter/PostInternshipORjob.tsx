import React from "react";
import { Users, Briefcase, ArrowRight } from "lucide-react";
import RecruiterLayout from "../../../Layouts/RecruiterLayout";
import { useNavigate } from "react-router-dom";

function PostInternshipORjob() {
  const navigate = useNavigate();
  const handlePostInternship = () => {
    console.log("Navigate to internship posting form");
    navigate("/dashboard/recruiter/internships-jobs/posts/internship");
  };

  const handlePostJob = () => {
    console.log("Navigate to job posting form");
    navigate("/dashboard/recruiter/internships-jobs/posts/job");
  };

  return (
    <RecruiterLayout>
      <div className="min-h-screen bg-gray-50 rounded-4xl dark:bg-[#101828]  py-12 px-4 sm:px-6 lg:px-8 ">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 dark:text-white">
              Choose what you want to post
            </h1>
          </div>

          {/* Post Options */}
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Internship Post Card */}
            <div className="bg-white rounded-2xl dark:bg-[#1E2939] dark:text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-8 text-center border border-gray-100">
              <div className="w-20 h-20 dark:text-white bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-white" />
              </div>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4 dark:text-white">
                Create an Internship Post
              </h2>

              <p className="text-gray-600 mb-8 leading-relaxed dark:text-gray-400">
                Create an engaging internship post to attract talented students
                and graduates.
              </p>

              <button
                onClick={handlePostInternship}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 group"
              >
                Post Internship
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>

            {/* Job Post Card */}
            <div className="bg-white dark:bg-[#1E2939] dark:text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-8 text-center border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-10 h-10 text-white" />
              </div>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4 dark:text-white">
                Create a Job Post
              </h2>

              <p className="text-gray-600 mb-8 leading-relaxed dark:text-gray-400">
                Post a job opportunity and connect with skilled professionals
                seeking employment.
              </p>

              <button
                onClick={handlePostJob}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 group"
              >
                Post Job
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </RecruiterLayout>
  );
}

export default PostInternshipORjob;
