import Herotitle from "../_components/herotitle";
import Card from "../_components/cards";
import { ButtonDemo } from "../_components/button";
import VacancyCard from "../_components/vacancyCard";
import Feature from "../_components/feature";
import LoginandSignupprocess from "../_components/loginandSignupprocess";
import Discoverjob from "../_components/Discoverjob";
import JobAlertBanner from "../_components/alertjob";
import Faq from "../_components/Faq";

import { ChevronRight } from "lucide-react";
import Navbar from "../_components/navbar";
import Footer from "../_components/footer";
import { useEffect, useState } from "react";

import { toast } from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL;

function Page() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  const handleBrowseAllJobs = () => {
    // Scroll to top smoothly before navigation
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Navigate after a tiny delay to allow the scroll (optional)
    setTimeout(() => {
      navigate("/internships");
    }, 50);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}auth/GetAllPosts/intern`, {
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
  const role = localStorage.getItem("role");

  return (
    <>
      <Navbar />
      <div className="dark:bg-[#000000]">
        <Herotitle />
        <Card />
        {role !== "recruiter" && (
          <>
            <div className="flex flex-row justify-around w-full gap-9 mt-28">
              <div className="flex flex-col justify-between gap-1">
                <h1 className="text-2xl font-bold">
                  Get your dream Internship now
                </h1>
                <p className="text-[14px]">
                  Search your career opportunity through the available
                  positions.
                </p>
                <div className="flex flex-row items-center justify-start gap-5 mt-7">
                  <ButtonDemo
                    name="Featured Internship"
                    className="bg-[#aa8bed] text-black hover:bg-[#a187d7] rounded-[40px]"
                  />
                </div>
              </div>
              <div className="flex flex-row items-center justify-center">
                <button
                  onClick={handleBrowseAllJobs}
                  className="cursor-pointer "
                >
                  Browse all Internships
                </button>
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
            {/* Internship Cards Section */}
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              {posts.length === 0 ? (
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

                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">
                    No Internships Available
                  </h2>

                  <p className="max-w-xl mt-3 text-lg text-gray-600 dark:text-gray-400">
                    We couldn’t find any internships at the moment. Check back
                    soon for new opportunities!
                  </p>
                </div>
              ) : (
                posts.map((post, idx) => <VacancyCard key={idx} post={post} />)
              )}
            </div>
          </>
        )}

        <Feature />
        <LoginandSignupprocess />
        {role !== "recruiter" && <Discoverjob />}
        <JobAlertBanner />
        <Faq />
      </div>
      <Footer />
    </>
  );
}

export default Page;
