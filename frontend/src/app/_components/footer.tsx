import { Facebook, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-12 px-4 dark:bg-black dark:border-zinc-700">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="flex flex-row justify-between">
          {/* Logo and Description Section */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/img/logo.png" // or from /public folder
                alt="Example image"
                width={200}
                height={200}
                className=" dark:hidden "
              />
              <img
                src="/img/logo1.png" // or from /public folder
                alt="Example image"
                width={200}
                height={200}
                className="dark:block hidden "
              />
            </div>
            <p className="text-gray-600 text-sm leading-relaxed max-w-xs">
              Find job you love and research the fastest-growing companies.
            </p>
          </div>

          {/* Product Section */}
          <div className="md:col-span-1">
            <h3 className="text-gray-900 font-semibold text-base mb-6 dark:text-zinc-200">
              Product
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors dark:text-zinc-400"
                >
                  Remote Job
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors dark:text-zinc-400"
                >
                  Startup
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors dark:text-zinc-400"
                >
                  Investor & Board
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors dark:text-zinc-400"
                >
                  Company
                </a>
              </li>
            </ul>
          </div>

          {/* Features Section */}
          <div className="md:col-span-1">
            <h3 className="text-gray-900 font-semibold text-base mb-6 dark:text-zinc-200">
              Features
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors dark:text-zinc-400"
                >
                  For Candidate
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors dark:text-zinc-400"
                >
                  For Company
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors dark:text-zinc-400"
                >
                  Society
                </a>
              </li>
            </ul>
          </div>

          {/* About Us Section */}
          <div className="md:col-span-1">
            <h3 className="text-gray-900 font-semibold text-base mb-6 dark:text-zinc-200">
              About Us
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors dark:text-zinc-400"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors dark:text-zinc-400"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors dark:text-zinc-400"
                >
                  Career
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center mt-3.5">
          {/* Copyright */}
          <div className="text-gray-500 text-sm mb-4 md:mb-0">
            ©2023 QuickRecruit Technologies, Inc.
          </div>

          {/* Legal Links and Social Icons */}
          <div className="flex items-center gap-8">
            {/* Legal Links */}
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
              >
                Legal
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-md flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4 text-gray-600" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-md flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4 text-gray-600" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-md flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4 text-gray-600" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
