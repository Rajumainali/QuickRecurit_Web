import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuViewport,
} from "../../components/ui/navigation-menu";
import { ModeToggle } from "./darktoggle";
import { Menu, X } from "lucide-react";
import { toast } from "react-hot-toast";

const DashNavbar = ({
  details,
}: {
  details: { firstName?: string; profile?: string | null };
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const [loggingOut, setLoggingOut] = useState(false);

  const handlelogout = () => {
    if (loggingOut) return;
    setLoggingOut(true);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.dispatchEvent(new Event("storage")); // sync
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="flex justify-between items-center w-full dark:bg-[#000000] py-2">
        <div className="ml-6">
          <img
            src="/img/logo.png"
            alt="Example image"
            width={200}
            height={200}
            className="dark:hidden"
          />
          <img
            src="/img/logo1.png"
            alt="Example image"
            width={200}
            height={200}
            className="hidden dark:block"
          />
        </div>

        <div className="relative hidden md:block">
          <NavigationMenu>
            <NavigationMenuList className="flex flex-row items-center gap-6 mr-36">
              {/* Home */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/" state={details} className="px-4 py-2">
                    Home
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Contact */}
              {/* <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/internships" className="px-4 py-2">
                    Internship
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem> */}

              {/* Job */}
              {/* <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/jobs" className="px-4 py-2">
                    Job
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem> */}

              {details?.firstName && (
                <NavigationMenuItem>
                  <div className="flex items-center gap-3 px-4 py-2">
                    {details.profile ? (
                      <img
                        src={`${import.meta.env.VITE_API_URL}upload/img/${
                          details.profile
                        }`}
                        alt={details.firstName}
                        className="object-cover w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-10 h-10 font-bold text-white bg-gray-400 rounded-full">
                        {details.firstName[0]}
                      </div>
                    )}
                    <span className="text-sm font-medium">
                      Welcome back, {details.firstName}!
                    </span>
                  </div>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>

            <NavigationMenuViewport />
            <ModeToggle />
          </NavigationMenu>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button onClick={toggleSidebar}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Sidebar Menu for Mobile */}
      <div
        className={`fixed md:hidden top-0 left-0 h-full w-[300px] bg-white dark:bg-black shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4">
          <img
            src="/img/logo.png"
            alt="Logo"
            width={150}
            height={50}
            className="dark:hidden"
          />
          <img
            src="/img/logo1.png"
            alt="Logo dark"
            width={150}
            height={50}
            className="hidden dark:block"
          />
          <button onClick={toggleSidebar}>
            <X size={28} className="dark:text-white" />
          </button>
        </div>
        <nav className="flex flex-col gap-4 p-6 text-l dark:text-white">
          <Link
            to="/"
            onClick={toggleSidebar}
            className={`hover:bg-[#aa8beddb] p-3 rounded-2xl ${
              pathname === "/" ? "bg-[#aa8bed]" : "bg-white"
            }`}
          >
            Home
          </Link>
          <Link
            to="/"
            onClick={toggleSidebar}
            className={`hover:bg-[#aa8beddb] p-3 rounded-2xl ${
              pathname === "/Internship" ? "bg-[#aa8bed]" : "bg-white"
            }`}
          >
            Internship
          </Link>
          <Link
            to="/"
            onClick={toggleSidebar}
            className={`hover:bg-[#aa8beddb] p-3 rounded-2xl ${
              pathname === "/Job" ? "bg-[#aa8bed]" : "bg-white"
            }`}
          >
            Job
          </Link>

          <button
            onClick={() => {
              handlelogout();
              toggleSidebar();
            }}
            className="p-3 font-semibold text-red-600 hover:bg-red-600 hover:text-white rounded-2xl"
          >
            Logout
          </button>
          {details?.firstName && (
            <div className="flex items-center gap-3 p-4 mt-6 bg-gray-100 rounded-xl dark:bg-gray-800">
              {details.profile ? (
                <img
                  src={`${import.meta.env.VITE_API_URL}upload/img/${
                    details.profile
                  }`}
                  alt={details.firstName}
                  className="object-cover w-12 h-12 border rounded-full"
                />
              ) : (
                <div className="flex items-center justify-center w-12 h-12 text-lg font-bold text-white bg-gray-400 rounded-full">
                  {details.firstName[0]}
                </div>
              )}
              <div className="text-sm font-medium dark:text-white">
                Welcome back,
                <br /> {details.firstName}!
              </div>
            </div>
          )}
        </nav>
        <div className="mt-4">
          <ModeToggle />
        </div>
      </div>

      {/* Overlay when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black opacity-50"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default DashNavbar;
