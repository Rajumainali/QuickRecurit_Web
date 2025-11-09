import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "../../components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../../components/ui/dropdown-menu";
import { Button } from "../../components/ui/button";
import { LogOut, LayoutDashboard } from "lucide-react";
import { ModeToggle } from "./darktoggle";
import { Menu, X } from "lucide-react";
import { jwtDecode } from "jwt-decode";

interface UserDetails {
  firstName?: string;
  CompanyName?: string;
  profile?: string | null;
  logo?: string | null;
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  interface JwtPayload {
    exp: number; // expiry time in seconds
    [key: string]: any;
  }

  const token = localStorage.getItem("token");
  let isAuthenticated = false;

  if (token) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const currentTime = Date.now() / 1000; // convert to seconds

      if (decoded.exp > currentTime) {
        isAuthenticated = true;
      } else {
        // Expired
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userDetails");
      }
    } catch (error) {
      // Invalid token
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("userDetails");
    }
  }

  const [details, setDetails] = useState<UserDetails>({});
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const role = localStorage.getItem("role");

  // Load details from location.state or localStorage
  useEffect(() => {
    if (location.state) {
      const newDetails = location.state as UserDetails;
      setDetails(newDetails);
      localStorage.setItem("userDetails", JSON.stringify(newDetails));
    } else {
      const saved = localStorage.getItem("userDetails");
      if (saved) {
        setDetails(JSON.parse(saved));
      }
    }
  }, [location.state]);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userDetails");
    setDetails({});
    navigate("/login");
  };

  return (
    <>
      <div className="flex justify-between items-center w-full dark:bg-[#000000] py-2">
        <div className="ml-6">
          <img
            src="/img/logo.png"
            alt="logo"
            width={200}
            height={200}
            className="dark:hidden"
          />
          <img
            src="/img/logo1.png"
            alt="logo-dark"
            width={200}
            height={200}
            className="hidden dark:block"
          />
        </div>

        <div className="relative hidden md:block">
          <NavigationMenu>
            <NavigationMenuList className="flex flex-row items-center gap-6 mr-36">
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  {location.pathname !== "/" && (
                    <Link to="/" className="px-4 py-2 ">
                      Home
                    </Link>
                  )}
                </NavigationMenuLink>
              </NavigationMenuItem>
              {role !== "recruiter" && (
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link to="/internships" className="px-4 py-2">
                      Internship
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )}
              {role !== "recruiter" && (
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link to="/jobs" className="px-4 py-2">
                      Job
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )}
              {isAuthenticated ? (
                <NavigationMenuItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="rounded-full px-4 py-2 text-sm font-medium max-w-[180px] truncate border dark:border-gray-600 flex items-center gap-2"
                      >
                        {details?.profile || details?.logo ? (
                          <>
                            {details.profile ? (
                              <img
                                src={`${
                                  import.meta.env.VITE_API_URL
                                }upload/img/${details.profile}`}
                                alt="profile"
                                className="object-cover w-6 h-6 border rounded-full"
                              />
                            ) : (
                              <img
                                src={`${
                                  import.meta.env.VITE_API_URL
                                }upload/logos/${details.logo}`}
                                alt="profile"
                                className="object-cover w-6 h-6 border rounded-full"
                              />
                            )}
                          </>
                        ) : (
                          <div className="flex items-center justify-center w-6 h-6 text-xs text-white bg-gray-400 rounded-full">
                            {details?.firstName?.[0] ||
                              details?.CompanyName?.[0]}
                          </div>
                        )}
                        {details?.firstName || details?.CompanyName}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>
                        {details?.firstName || details?.CompanyName}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link
                          to={
                            role === "recruiter"
                              ? "/dashboard/recruiter"
                              : "/dashboard/candidate"
                          }
                          className="flex items-center gap-2"
                        >
                          <LayoutDashboard size={16} />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <LogOut size={16} />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </NavigationMenuItem>
              ) : (
                <>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link to="/login" className="px-4 py-2">
                        Login
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenu>
                      <NavigationMenuList>
                        <NavigationMenuItem>
                          <NavigationMenuTrigger className="bg-[#CBB2FF] hover:!bg-[#c7bae4] dark:text-black transition-none focus:bg-[#CBB2FF] data-[state=open]:bg-[#CBB2FF]">
                            Register
                          </NavigationMenuTrigger>
                          <NavigationMenuContent>
                            <NavigationMenuLink asChild>
                              <Link
                                to="/register/candidate"
                                className="block w-48 px-4 py-2"
                              >
                                Register as candidate
                              </Link>
                            </NavigationMenuLink>
                            <NavigationMenuLink asChild>
                              <Link
                                to="/register/recruiter"
                                className="block w-48 px-4 py-2"
                              >
                                Register as recruiter
                              </Link>
                            </NavigationMenuLink>
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                      </NavigationMenuList>
                    </NavigationMenu>
                  </NavigationMenuItem>
                </>
              )}
            </NavigationMenuList>
            <NavigationMenuViewport />
            <ModeToggle />
          </NavigationMenu>
        </div>

        <div className="md:hidden">
          <button onClick={toggleSidebar} aria-label="Toggle menu">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed md:hidden top-0 left-0 h-full w-[300px] bg-white dark:bg-black shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <img
            src="/img/logo.png"
            alt="Logo"
            width={150}
            className="dark:hidden"
          />
          <img
            src="/img/logo1.png"
            alt="Logo dark"
            width={150}
            className="hidden dark:block"
          />
          <button onClick={toggleSidebar} aria-label="Close menu">
            <X size={28} className="dark:text-white" />
          </button>
        </div>

        <nav className="flex flex-col gap-4 p-6 text-l dark:text-white">
          <Link
            to="/"
            onClick={toggleSidebar}
            className={`hover:bg-[#aa8beddb] p-3 rounded-2xl ${
              pathname === "/" ? "bg-[#aa8bed]" : "bg-white dark:bg-gray-900"
            }`}
          >
            Home
          </Link>
          <Link
            to="/internships"
            onClick={toggleSidebar}
            className={`hover:bg-[#aa8beddb] p-3 rounded-2xl ${
              pathname === "/internships"
                ? "bg-[#aa8bed]"
                : "bg-white dark:bg-gray-900"
            }`}
          >
            Internship
          </Link>
          <Link
            to="/jobs"
            onClick={toggleSidebar}
            className={`hover:bg-[#aa8beddb] p-3 rounded-2xl ${
              pathname === "/jobs"
                ? "bg-[#aa8bed]"
                : "bg-white dark:bg-gray-900"
            }`}
          >
            Job
          </Link>

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="p-3 font-semibold text-left text-red-600 hover:bg-red-600 hover:text-white rounded-2xl"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                onClick={toggleSidebar}
                className={`hover:bg-[#aa8beddb] p-3 rounded-2xl ${
                  pathname === "/login"
                    ? "bg-[#aa8bed]"
                    : "bg-white dark:bg-gray-900"
                }`}
              >
                Login
              </Link>
              <Link
                to="/register/candidate"
                onClick={toggleSidebar}
                className={`hover:bg-[#aa8beddb] p-3 rounded-2xl ${
                  pathname === "/register/candidate"
                    ? "bg-[#aa8bed]"
                    : "bg-white dark:bg-gray-900"
                }`}
              >
                Register as candidate
              </Link>
              <Link
                to="/register/recruiter"
                onClick={toggleSidebar}
                className={`hover:bg-[#aa8beddb] p-3 rounded-2xl ${
                  pathname === "/register/recruiter"
                    ? "bg-[#aa8bed]"
                    : "bg-white dark:bg-gray-900"
                }`}
              >
                Register as recruiter
              </Link>
            </>
          )}
        </nav>

        <div className="absolute left-0 right-0 flex justify-center bottom-4">
          <ModeToggle />
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black opacity-50"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Navbar;
