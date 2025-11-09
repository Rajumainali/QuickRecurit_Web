import React, { useState, useEffect, useMemo } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./app/(Home)/page";
import Internship from "./app/Pages/Internship";
import Jobs from "./app/Pages/Jobs";
import Login from "./app/(sign&regsiter)/login/page";
import CandidateRegister from "./app/(sign&regsiter)/register/candidate/page";
import RecruiterRegister from "./app/(sign&regsiter)/register/recruiter/page";
import CandidateDashboard from "./app/dashboard/candidate/page";
import RecruiterDashboard from "./app/dashboard/recruiter/page";
import AboutYourself from "./app/onboarding/candidate/about-yourself/page";

import Allinternships from "./app/dashboard/recruiter/Allinternships";
import PostInternshipORjobs from "./app/dashboard/recruiter/PostInternshipORjob";
import AllApplications from "./app/dashboard/recruiter/Allapplicants";
import ShortlistApplicants from "./app/dashboard/recruiter/ShortlistApplicants";

import Profile from "./app/dashboard/recruiter/CompanyProfile";
import PostInternshipform from "./app/dashboard/recruiter/PostInternshipform";
import PostJobform from "./app/dashboard/recruiter/PostJobform";

import { Toaster } from "react-hot-toast";
import MyApplications from "./app/dashboard/candidate/Myapplication";
import SavedJobs from "./app/dashboard/candidate/Savejobs";
import EditProfile from "./app/dashboard/candidate/Editprofile";
import JobAlertBanner from "./app/_components/alertjob";

const App: React.FC = () => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [role, setRole] = useState<"candidate" | "recruiter" | null>(null);
  const [loading, setLoading] = useState(true); // loading state to prevent flicker

  useEffect(() => {
    const syncAuth = () => {
      const savedToken = localStorage.getItem("token");
      const savedRole = localStorage.getItem("role") as
        | "candidate"
        | "recruiter"
        | null;

      if (!savedToken) {
        setUserToken(null);
        setRole(null);
      } else {
        setUserToken(savedToken);
        setRole(savedRole ?? null);
      }

      setLoading(false);
    };

    syncAuth();

    window.addEventListener("storage", syncAuth); // for other tabs
    window.addEventListener("app-logout", syncAuth); // custom logout event

    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("app-logout", syncAuth); // clean up
    };
  }, []);

  const isLoggedIn = !!userToken;
  const dashboardPath = useMemo(() => {
    return role === "candidate"
      ? "/dashboard/candidate"
      : "/dashboard/recruiter";
  }, [role]);

  if (loading) return null; // Prevent flicker or premature routing

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/internships" element={<Internship />} />
          <Route path="/jobs" element={<Jobs />} />

          {/* Public routes */}
          <Route
            path="/login"
            element={
              isLoggedIn ? <Navigate to={dashboardPath} replace /> : <Login />
            }
          />
          <Route
            path="/register/candidate"
            element={
              isLoggedIn ? (
                <Navigate to={dashboardPath} replace />
              ) : (
                <CandidateRegister />
              )
            }
          />
          <Route
            path="/register/recruiter"
            element={
              isLoggedIn ? (
                <Navigate to={dashboardPath} replace />
              ) : (
                <RecruiterRegister />
              )
            }
          />

          {/* Protected routes */}
          <Route
            path="/dashboard/candidate"
            element={
              isLoggedIn && role === "candidate" ? (
                <CandidateDashboard />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/dashboard/recruiter"
            element={
              isLoggedIn && role === "recruiter" ? (
                <RecruiterDashboard />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/onboarding/candidate/about-yourself"
            element={
              isLoggedIn && role === "candidate" ? (
                <AboutYourself onSuccess={() => {}} from="" />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/onboarding/recruiter/about-yourself"
            element={
              isLoggedIn && role === "recruiter" ? (
                <AboutYourself onSuccess={() => {}} from="" />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/dashboard/candidate/applications"
            element={
              isLoggedIn && role === "candidate" ? (
                <MyApplications />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/dashboard/candidate/saved"
            element={
              isLoggedIn && role === "candidate" ? (
                <SavedJobs />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/dashboard/candidate/profile"
            element={
              isLoggedIn && role === "candidate" ? (
                <EditProfile />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/dashboard/recruiter/all-internships"
            element={
              isLoggedIn && role === "recruiter" ? (
                <Allinternships />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/dashboard/recruiter/internships-jobs/posts"
            element={
              isLoggedIn && role === "recruiter" ? (
                <PostInternshipORjobs />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/dashboard/recruiter/internships-jobs/posts/internship"
            element={
              isLoggedIn && role === "recruiter" ? (
                <PostInternshipform />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/dashboard/recruiter/internships-jobs/posts/job"
            element={
              isLoggedIn && role === "recruiter" ? (
                <PostJobform />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="dashboard/recruiter/All-applicants"
            element={
              isLoggedIn && role === "recruiter" ? (
                <AllApplications />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="dashboard/recruiter/shortlisted"
            element={
              isLoggedIn && role === "recruiter" ? (
                <ShortlistApplicants />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="dashboard/recruiter/profile"
            element={
              isLoggedIn && role === "recruiter" ? (
                <Profile />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </Router>
    </>
  );
};

export default App;
