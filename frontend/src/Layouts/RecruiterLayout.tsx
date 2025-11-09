import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import RecruiterSidebar from "../app/_components/RecruiterSidebar";
import MultiStepForm from "../app/onboarding/recruiter/about-yourself/page";
import RecruiterDashNav from "../app/_components/RecruiterDashNav";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const isValidToken = (token: string | null): boolean => {
  if (!token) return false;
  try {
    const { exp } = JSON.parse(atob(token.split(".")[1]));
    return Date.now() < exp * 1000;
  } catch {
    return false;
  }
};

interface RecruiterLayoutProps {
  children: React.ReactNode;
}

const RecruiterLayout: React.FC<RecruiterLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const [result, setResult] = useState<"yes" | "no" | null>(null);
  const [details, setDetails] = useState<{ CompanyName?: string; logo?: string | null }>({});
  const [loading, setLoading] = useState(true);
  const redirectedRef = useRef(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Token validation
    if (!isValidToken(token)) {
      if (!redirectedRef.current) {
        redirectedRef.current = true;
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.dispatchEvent(new Event("app-logout"));
        toast.error("Session expired. Please login again.");
        navigate("/login", { replace: true });
      }
      return;
    }

    // Check recruiter details
    const checkDetails = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}auth/check-details`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        });

        const data = await res.json();
        if (res.ok && (data.result === "yes" || data.result === "no")) {
          setResult(data.result);
          if (data.result === "yes") {
            setDetails(data.Details);
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    checkDetails();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login", { replace: true });
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  // Show onboarding form if recruiter hasn’t added details yet
  if (result === "no") {
    return (
      <MultiStepForm
        onSuccess={() => {
          setResult("yes");
          window.location.reload();
        }}
        from="InitialRecruiterForm"
      />
    );
  }

  return (
    <div className="flex flex-col h-screen">
  {/* Fixed Navbar */}
  <RecruiterDashNav details={details} />

  <div className="flex flex-1 overflow-hidden">
    {/* Fixed Sidebar */}
    <RecruiterSidebar onLogout={handleLogout} />

    {/* Scrollable Content */}
    <main className="flex-1 overflow-y-auto p-6 bg-[#faf8ff] dark:bg-[#0f0f0f]">
      {children}
    </main>
  </div>

</div>


  );
  
};

export default RecruiterLayout;
