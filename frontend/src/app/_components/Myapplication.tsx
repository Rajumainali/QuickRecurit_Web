import DashNavbar from "../_components/dashnavbar";
import Footer from "../_components/footer";
import Sidebar from "../_components/sidebar";
import React from "react";
import { useNavigate } from "react-router-dom";

interface Application {
  id: string;
  jobTitle: string;
  company: string;
  status: "Pending" | "Accepted" | "Rejected";
  appliedDate: string;
}

const dummyApplications: Application[] = [
  {
    id: "1",
    jobTitle: "Frontend Developer",
    company: "TechFusion",
    status: "Pending",
    appliedDate: "2025-07-01",
  },
  {
    id: "2",
    jobTitle: "UI/UX Intern",
    company: "Designify",
    status: "Accepted",
    appliedDate: "2025-06-20",
  },
  {
    id: "3",
    jobTitle: "Backend Engineer",
    company: "CodeCraft",
    status: "Rejected",
    appliedDate: "2025-05-15",
  },
];

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800",
  Accepted: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
};
const MyApplications: React.FC = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login", { replace: true });
  };

  return (
    <>
      {/* <DashNavbar/> */}
      <div className="flex min-h-[80vh]">
        <Sidebar onLogout={handleLogout} />
        <main className="flex-1 p-6 bg-[#faf8ff] dark:bg-[#0f0f0f]">
          {/* <div className="p-6 bg-white dark:bg-black min-h-screen"> */}
          <h1 className="text-2xl font-bold mb-6 text-center text-purple-700">
            My Applications
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {dummyApplications.map((app) => (
              <div
                key={app.id}
                className="border rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {app.jobTitle}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {app.company}
                </p>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Applied on: {app.appliedDate}
                </p>
                <span
                  className={`inline-block mt-3 px-3 py-1 text-xs font-medium rounded-full ${
                    statusColors[app.status]
                  }`}
                >
                  {app.status}
                </span>
              </div>
            ))}
          </div>
          {/* </div> */}
        </main>
      </div>
      <Footer />
    </>
  );
};

export default MyApplications;
