import React, { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminDropdown, setAdminDropdown] = useState(false); 
  const navigate = useNavigate();
  const dropdownRef = useRef(null); 

  const toggleMobile = () => setMobileOpen((s) => !s);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate("/");
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileOpen(false);
    setAdminDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setAdminDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-red-600 text-white">
      <div className="max-w-5xl mx-auto px-4 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-white text-xl transition"
            >
              Blood Bank Management
            </button>
          </h1>
        </div>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <button
                onClick={() => navigate("/dashboard")}
                className="text-white text-lg hover:text-red-200 transition mr-3"
              >
                Dashboard
              </button>

              {/* ADMIN LINKS - Desktop Dropdown */}
              {user?.role === 'admin' && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setAdminDropdown(!adminDropdown)}
                    className="text-white text-lg hover:text-red-200 transition flex items-center gap-1"
                  >
                    Manage
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-4 w-4 transition-transform ${adminDropdown ? 'rotate-180' : ''}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {adminDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <button
                        onClick={() => handleNavigation("/admin/users")}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                      >
                        Manage Users
                      </button>
                      <button
                        onClick={() => handleNavigation("/admin/hospitals")}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                      >
                        Manage Hospitals
                      </button>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={() => navigate("/donors")}
                className="text-white text-lg hover:text-red-200 transition mr-3"
              >
                Donors
              </button>
              <button
                onClick={() => navigate("/requests")}
                className="text-white text-lg hover:text-red-200 transition mr-3"
              >
                Requests
              </button>

              <button
                onClick={handleLogout}
                className="text-white text-lg hover:text-red-200 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/")}
                className="text-white text-lg hover:text-red-200 transition"
              >
                Home
              </button>
              <button
                onClick={() => navigate("/login")}
                className="text-white text-lg hover:text-red-200 transition"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="text-white text-lg hover:text-red-200 transition"
              >
                Register
              </button>
            </>
          )}
        </nav>

        {/* Mobile toggle */}
        <div className="sm:hidden">
          <button onClick={toggleMobile} aria-label="Open menu" className="p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile sliding menu */}
      {mobileOpen && (
        <div className="sm:hidden bg-red-700 text-white p-4">
          {isAuthenticated ? (
            <div className="flex flex-col gap-3">
              <button
                className="text-left w-full py-2 hover:text-red-200 transition"
                onClick={() => handleNavigation("/dashboard")}
              >
                Dashboard
              </button>

              {/* ADMIN LINKS - Mobile (Kept linear for better mobile UX) */}
              {user?.role === 'admin' && (
                <>
                  <button
                    className="text-left w-full py-2 hover:text-red-200 transition pl-4 border-l-2 border-red-500"
                    onClick={() => handleNavigation("/admin/users")}
                  >
                    Manage Users
                  </button>
                  <button
                    className="text-left w-full py-2 hover:text-red-200 transition pl-4 border-l-2 border-red-500"
                    onClick={() => handleNavigation("/admin/hospitals")}
                  >
                    Manage Hospitals
                  </button>
                </>
              )}

              <button
                className="text-left w-full py-2 hover:text-red-200 transition"
                onClick={() => handleNavigation("/donors")}
              >
                Donors
              </button>
              <button
                className="text-left w-full py-2 hover:text-red-200 transition"
                onClick={() => handleNavigation("/requests")}
              >
                Requests
              </button>
              {user && (
                <div className="py-2 text-sm text-red-200 border-t border-red-600">
                  Welcome, {user.name}
                </div>
              )}
              <button
                className="text-left w-full py-2 hover:text-red-200 transition"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <button
                className="text-left w-full py-2 hover:text-red-200 transition"
                onClick={() => handleNavigation("/")}
              >
                Home
              </button>
              <button
                className="text-left w-full py-2 hover:text-red-200 transition"
                onClick={() => handleNavigation("/login")}
              >
                Login
              </button>
              <button
                className="text-left w-full py-2 hover:text-red-200 transition"
                onClick={() => handleNavigation("/register")}
              >
                Register
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;