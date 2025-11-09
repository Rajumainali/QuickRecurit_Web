import { useState } from "react";
import { ButtonDemo } from "./button";
import { Check } from "lucide-react";

export default function loginandSignupprocess() {
  const [preferdclick, setpreferedclick] = useState("Login or Register");

  return (
    <>
      <div className="flex justify-center items-center flex-col mt-10  dark:bg-black">
        <ButtonDemo
          name="HOW IT WORKS"
          className="bg-[#3d3d3d] hover:bg-[#555555] px-6 py-2 rounded-full text-white transition duration-300 dark:text-[#ececec]"
        />
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 mt-6 dark:text-zinc-200">
          Getting Started is easy.
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed text-center mb-16 dark:text-zinc-400">
          Create a profile and we will match you the best your dream
          <br />
          companies and jobs in the world.
        </p>
      </div>

      <div className="flex flex-col justify-center items-center">
        {preferdclick === "Login or Register" && (
          <div className="flex flex-row justify-around items-center  w-[80vw] border-2 p-5 rounded-3xl">
            <div className="bg-gradient-to-r from-blue-500 to-violet-500 p-5 w-[500px] flex justify-center h-[400px] rounded-4xl relative overflow-hidden">
              <img
                src="/img/login.png"
                alt="Loginprocess"
                width={350}
                height={100}
                className="absolute -bg-conic-30bottom-0"
              />
            </div>

            <div className=" flex flex-col w-fit h-[400px] gap-2 ">
              <h1 className="text-3xl font-bold text-[#5D18EA]">01</h1>
              <h1 className="text-3xl font-semibold mt-6">Login or Register</h1>
              <p className="text-gray-500 w-[400px]">
                Finish your register and complete your personal data and prepare
                your resume
              </p>
              <span className="w-[400px] h-[1px] bg-gray-600 mt-2.5"></span>
              <div className="flex flex-col gap-6 mt-7 ">
                <div className="text-gray-500 flex gap-3 ">
                  <Check
                    color="white"
                    size={20}
                    className="bg-[#5D18EA] rounded-[50%] flex justify-center items-center"
                  />
                  <div className="w-[400px]">
                    <span className="text-black font-bold dark:text-gray-400">
                      One workflow:&nbsp;&nbsp;
                    </span>
                    Easily collaborate with teams to find & hire the right
                    candidate
                  </div>
                </div>
                <div className="text-gray-500 flex gap-3  ">
                  <Check
                    color="white"
                    height={20}
                    width={20}
                    className="bg-[#5D18EA] rounded-[50%] flex justify-center items-center"
                  />
                  <div className="w-[400px]">
                    <span className="text-black font-bold dark:text-gray-400">
                      Easier Applying:&nbsp;&nbsp;
                    </span>
                    Create account that will engage your profile.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {preferdclick === "data fill" && (
          <div className="flex flex-row justify-around items-center  w-[80vw] border-2 p-5 rounded-3xl">
            <div className="bg-gradient-to-r from-blue-500 to-violet-500 p-5 w-[500px] flex justify-center h-[400px] rounded-4xl relative overflow-hidden">
              <img
                src="/img/register.png"
                alt="Registerprocess"
                width={350}
                height={100}
                className="absolute -bg-conic-30bottom-0"
              />
            </div>

            <div className=" flex flex-col w-fit h-[400px] gap-2 ">
              <h1 className="text-3xl font-bold text-[#5D18EA]">02</h1>
              <h1 className="text-3xl font-semibold mt-6">
                Fill your Personal Data
              </h1>
              <p className="text-gray-500 w-[400px]">
                Finish your register and complete your personal data and prepare
                your resume
              </p>
              <span className="w-[400px] h-[1px] bg-gray-600 mt-2.5"></span>
              <div className="flex flex-col gap-6 mt-7 ">
                <div className="text-gray-500 flex gap-3 ">
                  <Check
                    color="white"
                    size={20}
                    className="bg-[#5D18EA] rounded-[50%] flex justify-center items-center"
                  />
                  <div className="w-[400px]">
                    <span className="text-black font-bold dark:text-gray-400">
                      One workflow:&nbsp;&nbsp;
                    </span>
                    Easily collaborate with teams to find & hire the right
                    candidate
                  </div>
                </div>
                <div className="text-gray-500 flex gap-3  ">
                  <Check
                    color="white"
                    height={20}
                    width={20}
                    className="bg-[#5D18EA] rounded-[50%] flex justify-center items-center"
                  />
                  <div className="w-[400px]">
                    <span className="text-black font-bold dark:text-gray-400">
                      Easier Applying:&nbsp;&nbsp;
                    </span>
                    Create account that will engage your profile.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {preferdclick === "Upload" && (
          <div className="flex flex-row justify-around items-center  w-[80vw] border-2 p-5 rounded-3xl">
            <div className="bg-gradient-to-r from-blue-500 to-violet-500 p-5 w-[500px] flex justify-center h-[400px] rounded-4xl relative overflow-hidden">
              <img
                src="/img/upload.png"
                alt="Uploadprocess"
                width={350}
                height={100}
                className="absolute -bg-conic-30bottom-0"
              />
            </div>

            <div className=" flex flex-col w-fit h-[400px] gap-2 ">
              <h1 className="text-3xl font-bold text-[#5D18EA]">03</h1>
              <h1 className="text-3xl font-semibold mt-6">
                Upload your Resume
              </h1>
              <p className="text-gray-500 w-[400px]">
                Upload your latest resume that match with your background.
              </p>
              <span className="w-[400px] h-[1px] bg-gray-600 mt-2.5"></span>
              <div className="flex flex-col gap-6 mt-7 ">
                <div className="text-gray-500 flex gap-3 ">
                  <Check
                    color="white"
                    size={20}
                    className="bg-[#5D18EA] rounded-[50%] flex justify-center items-center"
                  />
                  <div className="w-[400px]">
                    <span className="text-black font-bold dark:text-gray-400">
                      One workflow:&nbsp;&nbsp;
                    </span>
                    Easily collaborate with teams to find & hire the right
                    candidate
                  </div>
                </div>
                <div className="text-gray-500 flex gap-3  ">
                  <Check
                    color="white"
                    height={20}
                    width={20}
                    className="bg-[#5D18EA] rounded-[50%] flex justify-center items-center"
                  />
                  <div className="w-[400px]">
                    <span className="text-black font-bold dark:text-gray-400">
                      Easier Applying:&nbsp;&nbsp;
                    </span>
                    Create account that will engage your profile.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {preferdclick === "submit" && (
          <div className="flex flex-row justify-around items-center  w-[80vw] border-2 p-5 rounded-3xl">
            <div className="bg-gradient-to-r from-blue-500 to-violet-500 p-5 w-[500px] flex justify-center h-[400px] rounded-4xl relative overflow-hidden">
              <img
                src="/img/submit.png"
                alt="SubmitProcess"
                width={350}
                height={100}
                className="absolute -bg-conic-30bottom-0"
              />
            </div>

            <div className=" flex flex-col w-fit h-[400px] gap-2 ">
              <h1 className="text-3xl font-bold text-[#5D18EA]">04</h1>
              <h1 className="text-3xl font-semibold mt-6">
                Find the Match job
              </h1>
              <p className="text-gray-500 w-[400px]">
                Look for job vacancy and immediately get your dream job
              </p>
              <span className="w-[400px] h-[1px] bg-gray-600 mt-2.5"></span>
              <div className="flex flex-col gap-6 mt-7 ">
                <div className="text-gray-500 flex gap-3 ">
                  <Check
                    color="white"
                    size={20}
                    className="bg-[#5D18EA] rounded-[50%] flex justify-center items-center"
                  />
                  <div className="w-[400px]">
                    <span className="text-black font-bold dark:text-gray-400">
                      One workflow:&nbsp;&nbsp;
                    </span>
                    Easily collaborate with teams to find & hire the right
                    candidate
                  </div>
                </div>
                <div className="text-gray-500 flex gap-3  ">
                  <Check
                    color="white"
                    height={20}
                    width={20}
                    className="bg-[#5D18EA] rounded-[50%] flex justify-center items-center"
                  />
                  <div className="w-[400px]">
                    <span className="text-black font-bold dark:text-gray-400">
                      Easier Applying:&nbsp;&nbsp;
                    </span>
                    Create account that will engage your profile.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-row justify-evenly gap-5 h-[300px] ">
          <div
            className={`mt-7   border-t-4 border-[#DCDCDC] cursor-pointer w-[280px]  ${
              preferdclick === "Login or Register" && "border-violet-700"
            } `}
            onClick={() => setpreferedclick("Login or Register")}
          >
            <div className="flex flex-col gap-3 mt-5">
              <h1 className="text-[#555555]">01</h1>
              <h2 className="font-bold">Login or Register</h2>
              <p className="text-[#555555] w-[250px]">
                Follow the whole step and your are just rady to get started.
              </p>
            </div>
          </div>

          <div
            className={`mt-7 w-[300px] border-t-4 border-[#DCDCDC] cursor-pointer ${
              preferdclick === "data fill" && "border-violet-700"
            } `}
            onClick={() => setpreferedclick("data fill")}
          >
            <div className="flex flex-col gap-3 mt-5">
              <h1 className="text-[#555555]">02</h1>
              <h2 className="font-bold">Fill your Personal Data</h2>
              <p className="text-[#555555] w-[250px]">
                Finish your register and complete your personal data.
              </p>
            </div>
          </div>
          <div
            className={`mt-7 w-[300px] border-t-4 border-[#DCDCDC] cursor-pointer ${
              preferdclick === "Upload" && "border-violet-700"
            } `}
            onClick={() => setpreferedclick("Upload")}
          >
            <div className="flex flex-col gap-3 mt-5">
              <h1 className="text-[#555555]">03</h1>
              <h2 className="font-bold">Upload your Resume</h2>

              <p className="text-[#555555] w-[250px]">
                Upload your latest resume that match with your background
              </p>
            </div>
          </div>
          <div
            className={`mt-7 w-[300px] border-t-4 border-[#DCDCDC] cursor-pointer ${
              preferdclick === "submit" && "border-violet-700"
            } `}
            onClick={() => setpreferedclick("submit")}
          >
            <div className="flex flex-col gap-3 mt-5">
              <h1 className="text-[#555555]">04</h1>
              <h2 className="font-bold">Find the Match Job</h2>
              <p className="text-[#555555] w-[250px]">
                Look for job vacancy and immediately get your dream job
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
