import React, { useState, type ChangeEvent, useEffect } from "react";
import {
  Upload,
  Calendar,
  User,
  ChevronDown,
  Check,
  Moon,
  Sun,
} from "lucide-react";
import { toast } from "react-hot-toast";

const steps = ["About yourself", "Address", "Resume"];

const sectorOptions = [
  "IT",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
  "Retail",
  "Construction",
  "Transportation",
  "Agriculture",
  "Tourism",
];

type FormData = {
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  sectors: string[];
  designation: string;
  province: string;
  city: string;
  postalCode: string;
  currentAddress: string;
  resume: File | null;
  profile: File | null;
  predictedCategory: string;
};

const SelectiveDropdown: React.FC<{
  selectedSectors: string[];
  onSectorChange: (sector: string) => void;
  isDarkMode: boolean;
}> = ({ selectedSectors, onSectorChange, isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-3 text-left text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      >
        <span
          className={
            selectedSectors.length === 0
              ? "dark:text-gray-400 text-gray-500"
              : ""
          }
        >
          {selectedSectors.length === 0
            ? "Select sectors..."
            : `${selectedSectors.length} sector${
                selectedSectors.length > 1 ? "s" : ""
              } selected`}
        </span>
        <ChevronDown
          className={`w-5 h-5 transition-transform dark:text-gray-400 text-gray-500 ${
            isOpen ? "rotate-180" : ""
          } `}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 dark:bg-gray-700 dark:border-gray-600">
          {sectorOptions.map((sector) => (
            <button
              key={sector}
              type="button"
              onClick={() => onSectorChange(sector)}
              className="flex items-center justify-between w-full px-4 py-3 text-left text-gray-900 hover:bg-opacity-80 dark:hover:bg-gray-600 dark:text-white hover:bg-gray-50"
            >
              <span>{sector}</span>
              {selectedSectors.includes(sector) && (
                <Check className="w-4 h-4 text-blue-500" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
type MultiStepFormProps = {
  onSuccess: () => void;
  from: string;
};

const MultiStepForm: React.FC<MultiStepFormProps> = ({ onSuccess, from }) => {
  const [step, setStep] = useState<number>(0);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [loadingCategory, setLoadingCategory] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    sectors: [],
    designation: "",
    province: "",
    city: "",
    postalCode: "",
    currentAddress: "",
    resume: null,
    profile: null,
    predictedCategory: "",
  });

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleSectorChange = (sector: string) => {
    setFormData((prev) => ({
      ...prev,
      sectors: prev.sectors.includes(sector)
        ? prev.sectors.filter((s) => s !== sector)
        : [...prev.sectors, sector],
    }));
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // 1. Set the file in state (if needed elsewhere)
      setFormData((prev) => ({
        ...prev,
        resume: file,
      }));
      setLoadingCategory(true);

      // 2. Prepare form data
      const formData = new FormData();
      formData.append("resume", file);

      try {
        // 3. Call the classify endpoint
        const response = await fetch("http://localhost:5000/auth/classify", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Server error: " + response.statusText);
        }

        // 4. Parse and log result
        const result = await response.json();
        const category = result.category || result;
        setFormData((prev) => ({
          ...prev,
          predictedCategory: category, // Store the predicted category
        }));
        console.log("Predicted Category:", category);
      } catch (error) {
        console.error("Classification failed:", error);
      } finally {
        setLoadingCategory(false);
      }
    }
  };

  const handleProfileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({
        ...prev,
        profile: e.target.files![0],
      }));
      const imageUrl = URL.createObjectURL(file);

      setProfileImage(imageUrl);
    }
  };
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const form = new FormData();
      form.append("firstName", formData.firstName);
      form.append("lastName", formData.lastName);
      form.append("gender", formData.gender);
      form.append("dateOfBirth", formData.dateOfBirth);
      form.append("designation", formData.designation);
      form.append("province", formData.province);
      form.append("city", formData.city);
      form.append("postalCode", formData.postalCode);
      form.append("currentAddress", formData.currentAddress);

      form.append("predictedCategory", formData.predictedCategory);

      formData.sectors.forEach((sector, i) => {
        form.append(`sectors[${i}]`, sector);
      });
      if (formData.profile) form.append("profile", formData.profile);
      if (formData.resume) form.append("resume", formData.resume);

      // Debug FormData contents
      for (const [key, value] of form.entries()) {
        console.log(`${key}:`, value);
      }

      try {
        const isUpdate = from === "updateCandidate";
        const endpoint = isUpdate ? "update-details" : "add-details";
        const method = isUpdate ? "PUT" : "POST";

        const res = await fetch(`${API_BASE_URL}auth/${endpoint}`, {
          method,
          headers: {
            Authorization: token, // Do not set Content-Type for FormData
          },
          body: form,
        });

        const data = await res.json();

        if (res.ok) {
          const successMessage = isUpdate
            ? "Details updated successfully!"
            : "Details submitted!";
          console.log(successMessage, data);
          toast.success(data.message || successMessage);
          onSuccess();
        } else {
          console.error("Submission failed:", data.message);
          toast.error(data.message || "Failed to submit details");
        }
      } catch (err) {
        console.error("Error submitting details:", err);
        toast.error("Something went wrong!");
      }
    } catch (err) {
      console.error("Error submitting details:", err);
      toast.error("Something went wrong!");
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      if (from === "updateCandidate") {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }
        try {
          const res = await fetch(`${API_BASE_URL}auth/get-user-details`, {
            headers: {
              Authorization: token, // Do not set Content-Type for FormData
            },
          });

          if (res.ok) {
            const data = await res.json();
            setFormData((prev) => ({
              ...prev,
              ...data.details,
            }));
          }
        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchDetails();
  }, [from]);

  return (
    <div className="w-full mx-auto p-8 h-[140vh] transition-colors dark:bg-gray-900 bg-gray-50 rounded-3xl">
      {/* Dark Mode Toggle */}

      {/* Step Progress Bar */}
      <div className="flex items-center justify-center mb-12">
        {steps.map((label, index) => (
          <div key={index} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-4 h-4 rounded-full border-2 ${
                  index <= step
                    ? "dark:bg-blue-500 dark:border-blue-500 bg-black border-black"
                    : "dark:bg-gray-700 dark:border-gray-600 bg-white border-gray-300"
                }`}
              />
              <span className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                {label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-24 h-0.5 mx-4  ${
                  index < step
                    ? "dark:bg-blue-500 bg-black"
                    : "dark:bg-gray-700 bg-gray-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Form Content */}
      <div className="p-8 transition-colors bg-white rounded-lg shadow-sm dark:bg-gray-800">
        {step === 0 && (
          <>
            <h2 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-white">
              About yourself
            </h2>
            <p className="mb-8 text-gray-500 dark:text-gray-400 ">
              Fill out your primary information.
            </p>

            <div className="mb-8">
              <div className="flex items-center gap-4">
                <div
                  className={`w-16 h-16 rounded-full overflow-hidden flex items-center justify-center ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-200"
                  }`}
                >
                  {profileImage || formData.profile ? (
                    <img
                      src={
                        profileImage ||
                        `${API_BASE_URL}upload/img/${formData.profile}`
                      }
                      alt="Profile Preview"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <User
                      className={`w-6 h-6 ${
                        isDarkMode ? "text-gray-400" : "text-gray-400"
                      }`}
                    />
                  )}
                </div>
                <label
                  htmlFor="profile-upload"
                  className="text-red-500 cursor-pointer hover:text-red-600"
                >
                  Upload your Profile Picture
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="profile-upload"
                  onChange={handleProfileUpload}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  First Name<span className="text-red-500">*</span>
                </label>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Last Name<span className="text-red-500">*</span>
                </label>
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Gender<span className="text-red-500">*</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option>---Select Gender---</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Date Of Birth<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sectors
                </label>
                <SelectiveDropdown
                  selectedSectors={formData.sectors}
                  onSectorChange={handleSectorChange}
                  isDarkMode={isDarkMode}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Designation
                </label>
                <input
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
          </>
        )}

        {step === 1 && (
          <div>
            <h2 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-white">
              Address
            </h2>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Province<span className="text-red-500">*</span>
                </label>
                <select
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  className="flex items-center justify-between w-full px-4 py-3 text-left text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option>---Select Province---</option>
                  <option value="Bagmati">Bagmati</option>
                  <option value="Gandaki">Gandaki</option>
                  <option value="Lumbini">Lumbini</option>
                  <option value="Karnali">Karnali</option>
                  <option value="Sudurpashchim">Sudurpashchim</option>
                  <option value="Koshi">Koshi</option>
                  <option value="Madhesh">Madhesh</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  City<span className="text-red-500">*</span>
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="flex items-center justify-between w-full px-4 py-3 text-left text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option>---Select District---</option>
                  <option value="Kathmandu">Kathmandu</option>
                  <option value="Lalitpur">Lalitpur</option>
                  <option value="Bhaktapur">Bhaktapur</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Postal Code
              </label>
              <input
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div className="mb-8">
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Current Address<span className="text-red-500">*</span>
              </label>
              <input
                name="currentAddress"
                value={formData.currentAddress}
                onChange={handleChange}
                className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Upload Your Resume
            </h2>

            <div className="p-10 border-2 border-gray-300 border-dashed rounded-xl bg-gray-50 dark:bg-gray-800 dark:border-gray-600">
              <div className="flex flex-col items-center justify-center text-center">
                <Upload className="mb-4 text-blue-500 w-14 h-14 dark:text-blue-400" />

                <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                  Upload Resume
                </p>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Supported formats:{" "}
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    PDF, DOC, DOCX
                  </span>
                </p>

                <label
                  htmlFor="resume-upload"
                  className="inline-block px-6 py-2 mt-6 text-white transition-colors bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-700"
                >
                  Choose Resume
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="resume-upload"
                />

                {formData.resume && (
                  <p className="mt-4 text-sm text-green-500">
                    ✅ File selected:{" "}
                    <span className="font-medium text-green-600">
                      {formData.resume.name || `${formData.resume}`}
                    </span>
                  </p>
                )}

                {loadingCategory ? (
                  <p className="mt-2 text-sm text-blue-400 animate-pulse">
                    🔍 Predicting category...
                  </p>
                ) : (
                  formData.predictedCategory && (
                    <p className="mt-2 text-sm text-blue-500">
                      📂 Predicted Category:{" "}
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        {formData.predictedCategory}
                      </span>
                    </p>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          {step > 0 && (
            <button
              type="button"
              onClick={handlePrev}
              disabled={loadingCategory}
              className="px-6 py-3 text-gray-700 transition-colors border border-gray-300 rounded-lg dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
          )}
          {step < steps.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={loadingCategory}
              className="px-8 py-3 text-white transition-colors bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-red-400"
            >
              {loadingCategory ? "Processing..." : "Save"}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loadingCategory}
              className="px-8 py-3 text-white transition-colors bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-red-400"
            >
              {loadingCategory ? "Processing..." : "Save"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiStepForm;
