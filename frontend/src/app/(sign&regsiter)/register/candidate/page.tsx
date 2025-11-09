import { CandidateLogin } from "../../../_components/authform";
import Navbar from "../../../_components/navbar";
import Footer from "../../../_components/footer";

const page = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex relative bg-[#f4f4f3] dark:bg-[#0A0A0A]">
        {/* Left Side - Content and Image */}
        <div className="relative w-[600px]">
          <div className="relative  h-64 ">
            {/* Text Content */}
            <div className=" flex  justify-end  mt-7 w-[700px] font-sans">
              <h1 className="text-[28px] w-[550px] leading-10 font-semibold z-10 tracking-wide">
                Welcome to our community of{" "}
                <span className="text-[#5121E0]">QuickRecruit!</span>. Let's
                explore the opportunities
              </h1>
            </div>
            <img
              src="/img/arrow1.png"
              alt="arrow"
              width={250}
              height={250}
              className="absolute right-10 -rotate-20 -bottom-10 "
            />
          </div>

          {/* Image */}
          <div className="absolute bottom-0">
            <img
              src="/img/user-with-bg.png"
              alt="user with background"
              width={670}
              height={670}
              className="rounded-lg"
            />
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1  flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <CandidateLogin />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default page;
