import { ChevronRight } from "lucide-react";

export default function JobAlertBanner() {
  return (
    <div
      className="relative w-[80vw]  mx-auto h-80  rounded-2xl overflow-hidden shadow-xl bg-cover bg-center bg-no-repeat mb-8"
      style={{
        backgroundImage: "url('/img/alert.png')",
      }}
    >
      {/* Content Overlay */}
      <div className="relative h-full flex flex-col justify-center p-8 md:p-12">
        {/* Small green dot indicator */}
        <div className="w-3 h-3 bg-green-400 rounded-full mb-6 shadow-lg shadow-green-400/50"></div>

        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight max-w-lg">
          Set up personalized
          <br />
          job search alerts
        </h2>

        <button className="group bg-white hover:bg-gray-50 text-gray-800 font-semibold px-6 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl  w-fit">
          Sign Up
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      </div>
    </div>
  );
}
