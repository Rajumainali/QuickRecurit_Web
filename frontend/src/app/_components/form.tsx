import React, { useState } from "react";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input1";
import { cn } from "../../lib/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export function LoginFormDemo() {
  const navigate = useNavigate();
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [passwords, setpasswords] = useState(true);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch(`${API_BASE_URL}auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (res.ok) {
  localStorage.setItem("token", data.token);
localStorage.setItem("role", data.role);
window.dispatchEvent(new Event("storage"));
  toast.success("Login successful");
  navigate(data.role === "candidate" ? "/dashboard/candidate" : "/dashboard/recruiter", { replace: true });
}
 else {
      toast.error(data.message || "Login failed");
    }
  };

  return (
    <div className="shadow-input mx-auto w-full max-w-md rounded-2xl bg-white p-8 mb-14  dark:bg-black ">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-neutral-200 mb-2">
        Welcome back to <span className="text-[#5121E0]">QuickRecruit</span>
      </h2>

      <form className="mt-8 " onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-6">
          <Label htmlFor="email">Email*</Label>
          <Input
            id="email"
            placeholder="test@gmail.com"
            type="email"
            onChange={handleChange}
            name="email"
          />
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label
            htmlFor="password"
            className="text-gray-700 dark:text-neutral-300 font-medium"
          >
            Password*
          </Label>
          <div className="relative mt-2">
            <Input
              id="password"
              type={passwords ? "password" : "text"}
              onChange={handleChange}
              name="password"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                onClick={() => setpasswords(!passwords)}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </button>
          </div>
        </LabelInputContainer>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <input
              id="keep-signed-in"
              type="checkbox"
              checked={keepSignedIn}
              onChange={(e) => setKeepSignedIn(e.target.checked)}
              className="w-4 h-4 bg-gray-100 border-gray-300 rounded"
            />
            <label
              htmlFor="keep-signed-in"
              className="ml-2 text-sm text-gray-700 dark:text-neutral-300"
            >
              Keep me signed in
            </label>
          </div>
          <a
            href="#"
            className="text-sm text-red-500 hover:text-red-600 font-medium"
          >
            Forgot Password?
          </a>
        </div>

        <button
          className="w-full h-12 rounded-lg bg-[#5121E0] hover:bg-[#a892ec] text-white font-semibold transition-colors duration-200 mb-6"
          type="submit"
        >
          Sign In
        </button>

      </form>
    </div>
  );
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-1", className)}>
      {children}
    </div>
  );
};
