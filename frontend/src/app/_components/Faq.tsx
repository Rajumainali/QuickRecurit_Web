import { ButtonDemo } from "./button";
import { MessageCircleMore } from "lucide-react";
import { AccordionDemo } from "../_components/Accordin";

export default function Feature() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-center items-center flex-col mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 dark:text-zinc-200">
            Frequently Asked Question
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed text-center dark:text-zinc-400">
            Still you have any questions? Contact our Team via{" "}
            <span className="text-blue-600 dark:text-blue-400">
              support@QuickRecruit.com
            </span>
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start ">
          {/* Left Section - Contact Card */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-zinc-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-zinc-700 h-fit">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-200 mb-4">
                Ask Your Question
              </h2>
              <p className="text-gray-600 dark:text-zinc-400 mb-8 leading-relaxed">
                If the question is not available on our FAQ section, Feel free
                to contact us personally, we will resolve your respective
                doubts.
              </p>
              <div className="flex items-center gap-3 relative">
                <MessageCircleMore
                  color="white"
                  className=" text-blue-600 dark:text-blue-400 absolute ml-3"
                />

                <ButtonDemo
                  name="Contact Us"
                  className="bg-[#004AAD] hover:bg-[#003a8c] text-white px-8 py-3 rounded-xl font-medium transition-colors duration-200 h-12 w-40"
                />
              </div>
            </div>
          </div>

          {/* Right Section - FAQ Accordion */}
          <div className="lg:col-span-2">
            <AccordionDemo />
          </div>
        </div>
      </div>
    </div>
  );
}
