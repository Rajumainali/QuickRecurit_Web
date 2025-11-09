import React, { useState, useEffect } from "react";
import { Search, Plus, ChevronDown, FileX, AlertCircle, Trash2 } from "lucide-react";
import RecruiterLayout from "../../../Layouts/RecruiterLayout";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const Page: React.FC = () => {
  type Post = {
    _id: string;
    title: string;
    applicants?: any[];
    openings?: number;
    location?: string;
    deadline: string;
    postedAt: string;
    status?: string;
  };

  const [activeTab, setActiveTab] = useState("All Jobs");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Nearest Deadline");
  const [data, setData] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const tabs = [
    { name: "All Jobs", count: null },
    { name: "All Internship", count: null },
  ];

  const activeColor = "text-red-500 border-red-500";
  const inactiveColor =
    "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 border-transparent hover:border-gray-300 dark:hover:border-gray-600";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const type = activeTab === "All Jobs" ? "job" : "intern";
        const res = await fetch(`${API_BASE_URL}auth/GetAllPostsByEmail/${type}`, {
          headers: {
            Authorization: localStorage.getItem("token") || "",
          },
        });
        const json = await res.json();
        if (res.ok) {
          let filteredPosts = json.posts || [];

          // Search filter
          if (searchTerm.trim() !== "") {
            filteredPosts = filteredPosts.filter((post: Post) =>
              post.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
          }

          // Sorting logic
          if (sortBy === "Nearest Deadline") {
            filteredPosts.sort(
              (a: Post, b: Post) =>
                new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
            );
          } else if (sortBy === "Latest Created") {
            filteredPosts.sort(
              (a: Post, b: Post) =>
                new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
            );
          } else if (sortBy === "Most Applications") {
            filteredPosts.sort(
              (a: Post, b: Post) =>
                (b.applicants?.length || 0) - (a.applicants?.length || 0)
            );
          }

          setData(filteredPosts);
        } else {
          console.error("Failed to fetch posts", json.message);
          setData([]);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, searchTerm, sortBy]);

  // --- Delete function ---
  const handleDelete = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}auth/deletePost/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: localStorage.getItem("token") || "",
        },
      });

      const json = await res.json();
      if (res.ok) {
        alert("Post deleted successfully!");
        setData((prev) => prev.filter((p) => p._id !== postId));
      } else {
        alert(json.message || "Failed to delete post.");
      }
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  const tableHeaders = [
    { name: "Title", sortable: true },
    { name: "Applications", sortable: false },
    { name: "Openings", sortable: false },
    { name: "Location", sortable: false },
    { name: "Deadline", sortable: true },
    { name: "Created At", sortable: true },
    { name: "Status", sortable: false },
    { name: "Action", sortable: false },
  ];

  return (
    <RecruiterLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            My Internships/Jobs Listing
          </h1>
          <button
            onClick={() => {
              navigate("/dashboard/recruiter/internships-jobs/posts");
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Post a Internship/Job</span>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search jobs title"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              Sort by:
            </span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="Nearest Deadline">Nearest Deadline</option>
                <option value="Latest Created">Latest Created</option>
                <option value="Most Applications">Most Applications</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.name ? activeColor : inactiveColor
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-8 gap-4 p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-t-lg">
            {tableHeaders.map((header) => (
              <div key={header.name} className="flex items-center space-x-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {header.name}
                </span>
              </div>
            ))}
          </div>

          {loading ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              Loading...
            </div>
          ) : data.length > 0 ? (
            data.map((post, index) => (
              <div
                key={index}
                className="grid grid-cols-8 gap-4 p-4 border-t border-gray-100 dark:border-gray-700"
              >
                <div className="text-sm text-gray-900 dark:text-white">{post.title}</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  {post.applicants?.length || 0}
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  {post.openings}
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  {post.location}
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  {new Date(post.deadline).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  {new Date(post.postedAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  {new Date(post.deadline) > new Date() ? (
                    <span className="text-green-600 font-medium">Open</span>
                  ) : (
                    <span className="text-red-500 font-medium">Expired</span>
                  )}
                </div>
                <div className="text-sm">
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="text-red-500 hover:text-red-700 flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-16 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center relative">
                  <FileX className="w-8 h-8 text-red-500" />
                  <AlertCircle className="w-4 h-4 text-red-500 absolute -top-2 -right-2" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Results
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                You haven't posted any internships or jobs yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </RecruiterLayout>
  );
};

export default Page;
