import { HeroHighlight, Highlight } from "../../components/ui/hero-highlight";
import { Inputs } from "../_components/input";

function herotitle() {
  return (
    <>
      <HeroHighlight className="flex flex-col items-center justify-center text-center">
        <span className="mb-4 text-5xl">
          Connect with top Opportunities and
        </span>
        <Highlight className="text-5xl text-black dark:text-white">
          leading companies
        </Highlight>

        <p className="mt-8 text-gray-800 text-[20px] dark:text-white">
          Your path to exciting internships starts with us.
        </p>
        <Inputs />
      </HeroHighlight>
    </>
  );
}

export default herotitle;
