import { LoginFormDemo } from "../../_components/form";
import Navbar from "../../_components/navbar";
import Footer from "../../_components/footer";

function page() {
  return (
    <>
      <Navbar />
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900 p-4">
        <LoginFormDemo />
      </div>
      <Footer />
    </>
  );
}

export default page;
