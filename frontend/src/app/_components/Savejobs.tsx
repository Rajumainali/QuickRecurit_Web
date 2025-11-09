import DashNavbar from "../../_components/dashnavbar";
import Footer from "../../_components/footer";
import Sidebar from "../../_components/sidebar";
import React from "react";
import { useNavigate } from "react-router-dom";

interface SavedJob {
  id: string;
  jobTitle: string;
  company: string;
  savedDate: string;
}

const dummySavedJobs: SavedJob[] = [
  {
    id: "1",
    jobTitle: "React Developer",
    company: "SoftNep Pvt. Ltd.",
    savedDate: "2025-07-07",
  },
  {
    id: "2",
    jobTitle: "Product Designer",
    company: "Creative Minds",
    savedDate: "2025-07-05",
  },
  {
    id: "3",
    jobTitle: "Data Analyst",
    company: "DataWiz",
    savedDate: "2025-07-02",
  },
];

const SavedJobs: React.FC = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login", { replace: true });
  };

  return (
    <>
      <DashNavbar />
      <div className="flex min-h-[80vh]">
        <Sidebar onLogout={handleLogout} />
        <main className="flex-1 p-6 bg-[#faf8ff] dark:bg-[#0f0f0f]">
          <h1 className="text-2xl font-bold mb-6 text-center text-purple-700">
            Saved Jobs
          </h1>

          {dummySavedJobs.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-300">
              You haven’t saved any jobs yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {dummySavedJobs.map((job) => (
                <div
                  key={job.id}
                  className="border rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow duration-200"
                >
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {job.jobTitle}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {job.company}
                  </p>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    Saved on: {job.savedDate}
                  </p>
                  <button
                    className="mt-4 text-sm bg-red-100 text-red-600 px-4 py-1 rounded-full hover:bg-red-200 transition-colors"
                    onClick={() =>
                      alert(`Remove ${job.jobTitle} (not yet functional)`)
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
};

export default SavedJobs;
