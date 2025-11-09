import { ButtonDemo } from "./button";
export default function feature() {
  return (
    <div className="flex justify-center items-center flex-col mt-10 mb-10">
      <ButtonDemo
        name="Why Quick Recurit ?"
        className="bg-[#3d3d3d] hover:bg-[#555555] px-6 py-2 rounded-full text-white transition duration-300 dark:text-[#ececec]"
      />

      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 mt-6 dark:text-zinc-200">
        New way to get Job
      </h1>

      <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed text-center mb-16 dark:text-zinc-400">
        Once you gain access to the QuickRecruit platform you start out by
        <br />
        adding your first team roles.
      </p>

      {/* Features Grid */}
      <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {/* Feature 1 */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border dark:border-zinc-400 hover:shadow-md transition-shadow duration-300 dark:bg-[#3D3D3D] ">
          <div className="mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-green-400 rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4 dark:text-[#ECECEC]">
            Manage candidates easily
          </h3>
          <p className="text-gray-600 leading-relaxed dark:text-[#ECECEC]">
            Our easy-to-use software lets you evaluate candidates and move them
            faster.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border dark:border-zinc-400 hover:shadow-md transition-shadow duration-300 dark:bg-[#3D3D3D]">
          <div className="mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-orange-400 rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4 dark:text-[#ECECEC]">
            User-friendly hiring software
          </h3>
          <p className="text-gray-600 leading-relaxed dark:text-[#ECECEC]">
            Make it easy and quick for top candidates to find your jobs.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border dark:border-zinc-400 hover:shadow-md transition-shadow duration-300 dark:bg-[#3d3d3d]">
          <div className="mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-400 rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4 dark:text-[#ECECEC]">
            Make the perfect hire
          </h3>
          <p className="text-gray-600 leading-relaxed dark:text-[#ECECEC]">
            Reduce hiring time by finding qualified candidates quickly and
            easily.
          </p>
        </div>
        {/* Feature 4 */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border dark:border-zinc-400 hover:shadow-md transition-shadow duration-300 dark:bg-[#3d3d3d]">
          <div className="mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-400 rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4 dark:text-[#ECECEC]">
            AI Resume Analyzer
          </h3>
          <p className="text-gray-600 leading-relaxed dark:text-[#ECECEC]">
            Reduce hiring time by finding qualified candidates quickly and
            easily.
          </p>
        </div>
      </div>
    </div>
  );
}
