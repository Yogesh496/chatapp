import { Bars3Icon, XMarkIcon } from "@heroicons/react/20/solid";
import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import logo from "../assets/images/logo.png";

function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mobileMenuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Navigation links configuration
  const navLinks = [
    { name: "Features", path: "#features-section", type: "scroll" },
    { name: "About Us", path: "private-messaging", type: "scroll" },
  ];

  // Handle scroll behavior for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isNavOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !menuButtonRef.current.contains(event.target)
      ) {
        setIsNavOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isNavOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsNavOpen(false);
  }, [location]);

  // Handle keyboard accessibility
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isNavOpen) {
        setIsNavOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isNavOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 shadow-md backdrop-blur-md"
          : "bg-white/80 backdrop-blur-sm shadow-sm"
      }`}
    >
      <div className="container mx-auto px-4">
        <div
          className={`flex items-center justify-between ${
            scrolled ? "h-16" : "h-20"
          } transition-all duration-300`}
        >
          {/* Logo */}
          <NavLink
            to="/"
            className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md"
          >
            <img
              src={logo}
              alt="ChatOrbit Logo"
              className={`transition-all duration-300 ${
                scrolled ? "h-10" : "h-12"
              } w-auto`}
            />
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) =>
              link.type === "route" ? (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) => `
                    relative text-gray-700 font-medium transition duration-300
                    hover:text-blue-600 focus:outline-none focus-visible:ring-2 
                    focus-visible:ring-blue-500 rounded-md px-2 py-1
                    ${isActive ? "text-blue-600" : ""}
                    after:content-[''] after:absolute after:bottom-0 after:left-0 
                    after:w-full after:h-0.5 after:bg-blue-600 after:scale-x-0 
                    after:origin-bottom-left after:transition-transform after:duration-300
                    hover:after:scale-x-100 ${
                      isActive ? "after:scale-x-100" : ""
                    }
                  `}
                >
                  {link.name}
                </NavLink>
              ) : (
                <ScrollLink
                  key={link.name}
                  to={link.path}
                  smooth={true}
                  duration={500}
                  offset={-100}
                  className="
                    relative text-gray-700 font-medium transition duration-300
                    hover:text-blue-600 cursor-pointer focus:outline-none 
                    focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md
                    px-2 py-1 after:content-[''] after:absolute after:bottom-0 
                    after:left-0 after:w-full after:h-0.5 after:bg-blue-600 
                    after:scale-x-0 after:origin-bottom-left after:transition-transform 
                    after:duration-300 hover:after:scale-x-100
                  "
                  tabIndex={0}
                  role="button"
                >
                  {link.name}
                </ScrollLink>
              )
            )}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLink
              to="/login-user"
              className={`
                px-6 py-2 text-blue-600 border border-blue-600 rounded-lg
                transition duration-300 font-medium hover:bg-blue-50
                focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                ${location.pathname === "/login-user" ? "bg-blue-50" : ""}
              `}
            >
              Login
            </NavLink>
            <NavLink
              to="/register"
              className={`
                px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700
                transition duration-300 font-medium focus:outline-none
                focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                ${location.pathname === "/register" ? "bg-blue-700" : ""}
              `}
            >
              Register
            </NavLink>
          </div>

          {/* Mobile Menu Button */}
          <button
            ref={menuButtonRef}
            className="md:hidden text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md p-1"
            onClick={() => setIsNavOpen(!isNavOpen)}
            aria-expanded={isNavOpen}
            aria-label={isNavOpen ? "Close menu" : "Open menu"}
          >
            {isNavOpen ? (
              <XMarkIcon className="h-8 w-8" />
            ) : (
              <Bars3Icon className="h-8 w-8" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          ref={mobileMenuRef}
          className={`
            md:hidden bg-white border-t border-gray-100 overflow-hidden transition-all duration-300
            ${isNavOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
          `}
        >
          <div className="px-4 py-4 space-y-4">
            {navLinks.map((link) =>
              link.type === "route" ? (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) => `
                    block text-gray-700 transition duration-300 font-medium
                    hover:text-blue-600 p-2 rounded-md hover:bg-blue-50
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                    ${isActive ? "text-blue-600 bg-blue-50" : ""}
                  `}
                >
                  {link.name}
                </NavLink>
              ) : (
                <ScrollLink
                  key={link.name}
                  to={link.path}
                  smooth={true}
                  duration={500}
                  offset={-100}
                  className="
                    block text-gray-700 transition duration-300 font-medium
                    hover:text-blue-600 cursor-pointer p-2 rounded-md hover:bg-blue-50
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                  "
                  tabIndex={0}
                  role="button"
                  onClick={() => setIsNavOpen(false)}
                >
                  {link.name}
                </ScrollLink>
              )
            )}
            <div className="pt-4 space-y-3">
              <NavLink
                to="/login-user"
                className={`
                  block w-full px-4 py-3 text-center text-blue-600 border 
                  border-blue-600 rounded-lg transition duration-300 font-medium
                  hover:bg-blue-50 focus:outline-none focus-visible:ring-2 
                  focus-visible:ring-blue-500
                  ${location.pathname === "/login-user" ? "bg-blue-50" : ""}
                `}
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={`
                  block w-full px-4 py-3 text-center bg-blue-600 text-white 
                  rounded-lg hover:bg-blue-700 transition duration-300 font-medium
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                  focus-visible:ring-offset-2
                  ${location.pathname === "/register" ? "bg-blue-700" : ""}
                `}
              >
                Register
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
