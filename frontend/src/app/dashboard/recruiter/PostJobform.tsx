import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronLeft } from "lucide-react";
import RecruiterLayout from "../../../Layouts/RecruiterLayout";
import { toast } from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Types
interface FormData {
  title: string;
  city: string;
  sector: string;
  type: string;
  location: string;
  level: string;
  deadline: string;
  openings: string;
  minSalary: string;
  maxSalary: string;
  skills: string;
  requirements: string;
  PostType: string;
}

interface FormErrors {
  title?: string;
  city?: string;
  sector?: string;
  type?: string;
  location?: string;
  level?: string;
  deadline?: string;
  openings?: string;
  minSalary?: string;
  maxSalary?: string;
  skills?: string;
  requirements?: string;
  PostType?: string;
}

interface Step {
  id: number;
  title: string;
  subtitle: string;
}

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

// Quill instance type
interface QuillInstance {
  clipboard: {
    dangerouslyPasteHTML: (html: string) => void;
  };
  root: {
    innerHTML: string;
  };
  on: (event: string, callback: () => void) => void;
  off: (event: string, callback: () => void) => void;

  // ✅ Add these two methods:
  getSelection: () => { index: number; length: number } | null;
  setSelection: (range: { index: number; length: number }) => void;
}

// Extend Window interface for Quill
declare global {
  interface Window {
    Quill: any;
  }
}

// Global flag to track if Quill is loaded
let quillLoaded = false;
let quillLoadPromise: Promise<void> | null = null;

// Function to load Quill
const loadQuill = (): Promise<void> => {
  if (quillLoaded && window.Quill) {
    return Promise.resolve();
  }

  if (quillLoadPromise) {
    return quillLoadPromise;
  }

  quillLoadPromise = new Promise((resolve) => {
    if (typeof window !== "undefined" && !quillLoaded) {
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.min.js";
      script.onload = () => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href =
          "https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.snow.min.css";
        document.head.appendChild(link);

        quillLoaded = true;
        resolve();
      };
      document.head.appendChild(script);
    } else {
      resolve();
    }
  });

  return quillLoadPromise;
};

// Fixed Quill Rich Text Editor Component
const QuillEditor: React.FC<QuillEditorProps> = ({
  value,
  onChange,
  placeholder,
  error,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<QuillInstance | null>(null);
  const [isQuillReady, setIsQuillReady] = useState(false);
  const changeHandlerRef = useRef<(() => void) | null>(null);

  // Initialize Quill editor
  useEffect(() => {
    loadQuill().then(() => {
      if (window.Quill && editorRef.current && !quillRef.current) {
        quillRef.current = new window.Quill(editorRef.current, {
          theme: "snow",
          placeholder: placeholder || "Start typing...",
          modules: {
            toolbar: [
              [{ header: [1, 2, 3, false] }],
              ["bold", "italic", "underline"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["link"],
              ["clean"],
            ],
          },
        });

        // Set initial value
        if (value) {
          quillRef.current!.clipboard.dangerouslyPasteHTML(value);
        }

        // Create and store change handler
        changeHandlerRef.current = () => {
          if (quillRef.current) {
            const html = quillRef.current.root.innerHTML;
            onChange(html);
          }
        };

        // Attach change handler
        quillRef.current!.on("text-change", changeHandlerRef.current);
        setIsQuillReady(true);
      }
    });

    return () => {
      // Cleanup
      if (quillRef.current && changeHandlerRef.current) {
        quillRef.current.off("text-change", changeHandlerRef.current);
      }
      quillRef.current = null;
      changeHandlerRef.current = null;
    };
  }, []);

  // Update content when value prop changes (but not during user typing)
  useEffect(() => {
    if (
      quillRef.current &&
      isQuillReady &&
      value !== quillRef.current.root.innerHTML
    ) {
      const selection = quillRef.current.getSelection
        ? quillRef.current.getSelection()
        : null;
      quillRef.current.clipboard.dangerouslyPasteHTML(value);
      if (selection && quillRef.current.setSelection) {
        quillRef.current.setSelection(selection);
      }
    }
  }, [value, isQuillReady]);

  return (
    <div className="quill-container">
      <div
        ref={editorRef}
        className="text-gray-900 bg-white min-h-32 dark:bg-gray-800 dark:text-gray-100"
        style={{
          minHeight: "8rem",
          display: "block",
          visibility: "visible",
        }}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {/* Static CSS styles to prevent layout shifts */}
      <style>{`
        .quill-container .ql-toolbar {
          border-top: 1px solid ${error ? "#ef4444" : "#d1d5db"} !important;
          border-left: 1px solid ${error ? "#ef4444" : "#d1d5db"} !important;
          border-right: 1px solid ${error ? "#ef4444" : "#d1d5db"} !important;
          border-bottom: none !important;
          border-radius: 0.5rem 0.5rem 0 0 !important;
          background: white !important;
          display: block !important;
          visibility: visible !important;
        }
        
        .quill-container .ql-container {
          border-bottom: 1px solid ${error ? "#ef4444" : "#d1d5db"} !important;
          border-left: 1px solid ${error ? "#ef4444" : "#d1d5db"} !important;
          border-right: 1px solid ${error ? "#ef4444" : "#d1d5db"} !important;
          border-top: none !important;
          border-radius: 0 0 0.5rem 0.5rem !important;
          background: white !important;
          min-height: 8rem !important;
          display: block !important;
          visibility: visible !important;
        }
        
        .quill-container .ql-editor {
          min-height: 8rem !important;
          color: #111827 !important;
          padding: 12px 15px !important;
          display: block !important;
          visibility: visible !important;
        }
        
        .quill-container .ql-editor.ql-blank::before {
          color: #9ca3af !important;
          font-style: normal !important;
        }
        
        .dark .quill-container .ql-toolbar {
          background: #1f2937 !important;
          border-color: ${error ? "#ef4444" : "#4b5563"} !important;
        }
        
        .dark .quill-container .ql-container {
          background: #1f2937 !important;
          border-color: ${error ? "#ef4444" : "#4b5563"} !important;
        }
        
        .dark .quill-container .ql-editor {
          color: #f9fafb !important;
        }
        
        .dark .quill-container .ql-editor.ql-blank::before {
          color: #6b7280 !important;
        }
        
        .dark .quill-container .ql-stroke {
          stroke: #9ca3af !important;
        }
        
        .dark .quill-container .ql-fill {
          fill: #9ca3af !important;
        }
        
        .dark .quill-container .ql-picker-label {
          color: #9ca3af !important;
        }
        
        .dark .quill-container .ql-picker-options {
          background: #374151 !important;
          border-color: #4b5563 !important;
        }
        
        .dark .quill-container .ql-picker-item {
          color: #d1d5db !important;
        }
        
        .dark .quill-container .ql-picker-item:hover {
          background: #4b5563 !important;
        }
      `}</style>
    </div>
  );
};

const PostJobForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    city: "",
    sector: "",
    type: "Full Time",
    location: "Onsite",
    level: "Entry",
    deadline: "",
    openings: "",
    minSalary: "",
    maxSalary: "",
    skills: "",
    requirements: "",
    PostType: "job",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const steps: Step[] = [
    { id: 1, title: "Basic Details", subtitle: "Basic Details" },
    {
      id: 2,
      title: "Skills and Requirement",
      subtitle: "Skills and Requirement",
    },
    { id: 3, title: "Review and Submit", subtitle: "Review and Submit" },
  ];

  // Helper function to get text content from HTML
  const getTextContent = (html: string): string => {
    return html.replace(/<[^>]*>/g, "").trim();
  };

  // Helper function to check if Quill content is empty
  const isQuillEmpty = (html: string): boolean => {
    if (!html || !html.trim()) return true;
    const cleanHtml = html.trim();
    return (
      cleanHtml === "<p><br></p>" ||
      cleanHtml === "<p></p>" ||
      getTextContent(cleanHtml).length === 0
    );
  };

  // Validation functions
  const validateStep1 = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Job title is required";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Job title must be at least 3 characters long";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    } else if (formData.city.trim().length < 2) {
      newErrors.city = "City must be at least 2 characters long";
    }

    if (!formData.sector) {
      newErrors.sector = "Job sector is required";
    }

    if (!formData.deadline) {
      newErrors.deadline = "Application deadline is required";
    } else {
      const selectedDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate <= today) {
        newErrors.deadline = "Deadline must be a future date";
      }
    }

    if (!formData.openings) {
      newErrors.openings = "Number of openings is required";
    } else if (parseInt(formData.openings) < 1) {
      newErrors.openings = "Number of openings must be at least 1";
    } else if (parseInt(formData.openings) > 100) {
      newErrors.openings = "Number of openings cannot exceed 100";
    }

    if (!formData.minSalary) {
      newErrors.minSalary = "Minimum salary is required";
    } else if (parseInt(formData.minSalary) < 0) {
      newErrors.minSalary = "Minimum salary cannot be negative";
    }

    if (
      formData.maxSalary &&
      parseInt(formData.maxSalary) < parseInt(formData.minSalary)
    ) {
      newErrors.maxSalary =
        "Maximum salary must be greater than minimum salary";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate skills
    if (isQuillEmpty(formData.skills)) {
      newErrors.skills = "Skills required field is required";
    } else {
      const skillsText = getTextContent(formData.skills);
      if (skillsText.length < 10) {
        newErrors.skills =
          "Skills description must be at least 10 characters long";
      }
    }

    // Validate requirements
    if (isQuillEmpty(formData.requirements)) {
      newErrors.requirements = "Job requirements field is required";
    } else {
      const requirementsText = getTextContent(formData.requirements);
      if (requirementsText.length < 20) {
        newErrors.requirements =
          "Job requirements must be at least 20 characters long";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAllSteps = (): boolean => {
    return validateStep1() && validateStep2();
  };

  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const nextStep = (): void => {
    let isValid = true;

    if (currentStep === 1) {
      isValid = validateStep1();
    } else if (currentStep === 2) {
      isValid = validateStep2();
    }

    if (isValid && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = (): void => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateAllSteps()) {
      toast.error("Please fix all validation errors before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast("Authentication token missing. Please login again.");
        return;
      }

      const response = await fetch(`${API_BASE_URL}auth/create-post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to post Job.");
      }

      toast.success(result.message || "Job posted successfully!");

      // Reset form
      setFormData({
        title: "",
        city: "",
        sector: "",
        type: "Full Time",
        location: "Onsite",
        level: "Entry",
        deadline: "",
        openings: "",
        minSalary: "",
        maxSalary: "",
        skills: "",
        requirements: "",
        PostType: "job",
      });

      setCurrentStep(1);
      setErrors({});
    } catch (error: any) {
      console.error("Submit error:", error);
      toast.error(error.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderProgressBar = () => (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="relative flex items-center justify-between">
        {/* Progress Line */}
        <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-700">
          <div
            className="h-full transition-all duration-300 ease-in-out bg-red-500"
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Steps */}
        {steps.map((step, index) => (
          <div
            key={step.id}
            className="relative z-10 flex flex-col items-center"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-200
              ${
                currentStep >= step.id
                  ? "bg-red-500 text-white"
                  : "bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400"
              }`}
            >
              {step.id}
            </div>
            <div className="mt-3 text-center">
              <div
                className={`text-sm font-medium transition-colors duration-200 ${
                  currentStep >= step.id
                    ? "text-red-500"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {step.title}
              </div>
              <div className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                {step.subtitle}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBasicDetails = () => (
    <div className="space-y-6">
      <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-gray-100">
        Basic Details
      </h2>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Job Title
        </label>
        <input
          type="text"
          placeholder="eg. UI UX Job"
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg 
            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
            ${
              errors.title
                ? "border-red-500 dark:border-red-500"
                : "border-gray-300 dark:border-gray-600"
            }`}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.title}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="eg. Kathmandu"
            value={formData.city}
            onChange={(e) => handleInputChange("city", e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg 
              bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 
              focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
              ${
                errors.city
                  ? "border-red-500 dark:border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
          />
          {errors.city && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.city}
            </p>
          )}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Job Location <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg appearance-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="Onsite">Onsite</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
            </select>
            <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Job Sector <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={formData.sector}
              onChange={(e) => handleInputChange("sector", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg 
                bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none
                ${
                  errors.sector
                    ? "border-red-500 dark:border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
            >
              <option value="">Select Sector</option>
              <option value="Java Developer">Java Developer</option>
              <option value="Testing">Testing</option>
              <option value="DevOps Engineer">DevOps Engineer</option>
              <option value="Python Developer">Python Developer</option>
              <option value="Web Designing">Web Designing</option>
              <option value="HR">HR</option>
              <option value="Hadoop">Hadoop</option>
              <option value="Sales">Sales</option>
              <option value="Data Science">Data Science</option>
              <option value="Mechanical Engineer">Mechanical Engineer</option>
              <option value="ETL Developer">ETL Developer</option>
              <option value="Blockchain">Blockchain</option>
              <option value="Operations Manager">Operations Manager</option>
              <option value="Arts">Arts</option>
              <option value="Database">Database</option>
              <option value="Health and fitness">Health and fitness</option>
              <option value="PMO">PMO</option>
              <option value="Electrical Engineering">
                Electrical Engineering
              </option>
              <option value="Business Analyst">Business Analyst</option>
              <option value="DotNet Developer">DotNet Developer</option>
              <option value="Automation Testing">Automation Testing</option>
              <option value="Network Security Engineer">
                Network Security Engineer
              </option>
              <option value="Civil Engineer">Civil Engineer</option>
              <option value="SAP Developer">SAP Developer</option>
              <option value="Advocate">Advocate</option>
            </select>
            <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
          {errors.sector && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.sector}
            </p>
          )}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Application Deadline <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => handleInputChange("deadline", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg 
                bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
                ${
                  errors.deadline
                    ? "border-red-500 dark:border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
            />
          </div>
          {errors.deadline && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.deadline}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Job type <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={formData.type}
              onChange={(e) => handleInputChange("type", e.target.value)}
              className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg appearance-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Contract">Contract</option>
            </select>
            <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Job Level
          </label>
          <div className="relative">
            <select
              value={formData.level}
              onChange={(e) => handleInputChange("level", e.target.value)}
              className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg appearance-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="Entry">Entry</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Number Of Openings <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          placeholder="eg. 4"
          value={formData.openings}
          onChange={(e) => handleInputChange("openings", e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg 
            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
            ${
              errors.openings
                ? "border-red-500 dark:border-red-500"
                : "border-gray-300 dark:border-gray-600"
            }`}
        />
        {errors.openings && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.openings}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Min <span className="text-red-500">*</span>
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-lg dark:text-gray-100 dark:bg-gray-700 dark:border-gray-600">
              Rs.
            </span>
            <input
              type="number"
              placeholder="eg. 6"
              value={formData.minSalary}
              onChange={(e) => handleInputChange("minSalary", e.target.value)}
              className={`flex-1 px-3 py-2 border placeholder-gray-400 
                bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
                ${
                  errors.minSalary
                    ? "border-red-500 dark:border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
            />
            <div className="relative">
              <select className="h-full px-3 py-2 text-gray-900 bg-white border border-l-0 border-gray-300 rounded-r-lg appearance-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
                <option>Monthly</option>
                <option>Weekly</option>
                <option>Daily</option>
              </select>
              <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          {errors.minSalary && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.minSalary}
            </p>
          )}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Max
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-lg dark:text-gray-100 dark:bg-gray-700 dark:border-gray-600">
              Rs.
            </span>
            <input
              type="number"
              placeholder="eg. 6"
              value={formData.maxSalary}
              onChange={(e) => handleInputChange("maxSalary", e.target.value)}
              className={`flex-1 px-3 py-2 border placeholder-gray-400 
                bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
                ${
                  errors.maxSalary
                    ? "border-red-500 dark:border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
            />
            <div className="relative">
              <select className="h-full px-3 py-2 text-gray-900 bg-white border border-l-0 border-gray-300 rounded-r-lg appearance-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
                <option>Monthly</option>
                <option>Weekly</option>
                <option>Daily</option>
              </select>
              <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          {errors.maxSalary && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.maxSalary}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const renderSkillsAndRequirements = () => (
    <div className="space-y-6">
      <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-gray-100">
        Skills and Requirements
      </h2>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Skills Required <span className="text-red-500">*</span>
        </label>
        <QuillEditor
          value={formData.skills}
          onChange={(value) => handleInputChange("skills", value)}
          error={errors.skills}
        />
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Job Requirements <span className="text-red-500">*</span>
        </label>
        <QuillEditor
          value={formData.requirements}
          onChange={(value) => handleInputChange("requirements", value)}
          placeholder="Describe the requirements and responsibilities..."
          error={errors.requirements}
        />
      </div>
    </div>
  );

  const renderReviewAndSubmit = () => (
    <div className="space-y-6">
      <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-gray-100">
        Review and Submit
      </h2>

      <div className="p-6 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700">
        <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-gray-100">
          Job Details
        </h3>

        <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Title:
            </span>
            <span className="ml-2 text-gray-900 dark:text-gray-100">
              {formData.title || "N/A"}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">
              City:
            </span>
            <span className="ml-2 text-gray-900 dark:text-gray-100">
              {formData.city || "N/A"}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Sector:
            </span>
            <span className="ml-2 text-gray-900 dark:text-gray-100">
              {formData.sector || "N/A"}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Type:
            </span>
            <span className="ml-2 text-gray-900 dark:text-gray-100">
              {formData.type}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Location:
            </span>
            <span className="ml-2 text-gray-900 dark:text-gray-100">
              {formData.location}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Level:
            </span>
            <span className="ml-2 text-gray-900 dark:text-gray-100">
              {formData.level}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Openings:
            </span>
            <span className="ml-2 text-gray-900 dark:text-gray-100">
              {formData.openings || "N/A"}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Deadline:
            </span>
            <span className="ml-2 text-gray-900 dark:text-gray-100">
              {formData.deadline || "N/A"}
            </span>
          </div>
          <div className="md:col-span-2">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Salary:
            </span>
            <span className="ml-2 text-gray-900 dark:text-gray-100">
              Rs. {formData.minSalary || "0"} - Rs. {formData.maxSalary || "0"}{" "}
              Monthly
            </span>
          </div>
        </div>

        {formData.skills && (
          <div className="mt-4">
            <h4 className="mb-2 font-medium text-gray-700 dark:text-gray-300">
              Skills Required:
            </h4>
            <div
              className="prose prose-sm dark:prose-invert max-w-none list-disc list-inside [&_ol]:list-decimal [&_ul]:list-disc [&_li]:my-1 text-gray-900 dark:text-gray-100"
              dangerouslySetInnerHTML={{ __html: formData.skills }}
            />
          </div>
        )}

        {formData.requirements && (
          <div className="mt-4">
            <h4 className="mb-2 font-medium text-gray-700 dark:text-gray-300">
              Requirements:
            </h4>
            <div
              className="prose prose-sm dark:prose-invert max-w-none list-disc list-inside [&_ol]:list-decimal [&_ul]:list-disc [&_li]:my-1 text-gray-900 dark:text-gray-100"
              dangerouslySetInnerHTML={{ __html: formData.requirements }}
            />
          </div>
        )}
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderBasicDetails();
      case 2:
        return renderSkillsAndRequirements();
      case 3:
        return renderReviewAndSubmit();
      default:
        return renderBasicDetails();
    }
  };

  return (
    <RecruiterLayout>
      <div className="min-h-screen px-4 py-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Create an Job Post
            </h1>
          </div>

          {renderProgressBar()}

          <div className="p-6 mb-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 md:p-8 dark:border-gray-700">
            {renderStepContent()}
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors
            ${
              currentStep === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Prev
            </button>

            <div className="flex gap-3">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 font-medium text-gray-700 transition-colors border border-gray-300 rounded-lg dark:border-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>

              {currentStep === 3 ? (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 font-medium text-white transition-colors bg-red-500 rounded-lg hover:bg-red-600"
                >
                  Submit
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  className="px-6 py-2 font-medium text-white transition-colors bg-red-500 rounded-lg hover:bg-red-600"
                >
                  Continue
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </RecruiterLayout>
  );
};

export default PostJobForm;
