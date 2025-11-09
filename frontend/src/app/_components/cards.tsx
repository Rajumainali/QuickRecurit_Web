import { ButtonDemo } from "./button";

function cards() {
  return (
    <div className="flex flex-row justify-center gap-9 mx-8 w-full ">
      <div className="flex flex-col justify-between bg-[#ECECEC] dark:bg-[#3D3D3D] px-10 py-10 rounded-3xl h-[300px] my-3 w-[550px] relative overflow-hidden">
        <h1 className="text-[#000] dark:text-[#ECECEC] text-2xl font-bold z-10">
          For Candidate
        </h1>
        <p className="text-[#6e6969] dark:text-[#ececec] z-10 w-[350px]">
          Unlock endless opportunities and connect with top employers. Let your
          skills shine and land your dream job.
        </p>
        <ButtonDemo name="Upload Your CV" className="dark:bg-[#D4D4D4]" />
        <img
          src="/img/candidate.png"
          alt="No candidate Image"
          className="absolute top-0 -right-10 z-0 rotate-240 h-[400px] w-[400px] object-cover"
        />
      </div>
      <div className="flex flex-col justify-between bg-[#3D3D3D] px-10 py-10 rounded-3xl h-[300px] my-3 w-[550px] relative overflow-hidden">
        <h1 className="text-amber-50 text-2xl font-bold z-10">
          For Employer or Company
        </h1>
        <p className="text-amber-50 z-10 w-[350px]">
          Unlock endless opportunities and connect with top employers. Let your
          skills shine and land your dream job.
        </p>
        <ButtonDemo name="Start Hiring" />
        <img
          src="/img/hiring.png"
          alt="No candidate Image"
          className="absolute top-15 -right-10 z-0 h-[300px] w-[200px] object-fit"
        />
      </div>
    </div>
  );
}

export default cards;