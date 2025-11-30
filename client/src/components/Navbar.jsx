import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobile = () => setMobileOpen((s) => !s);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate("/");
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

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
              {user && (
                <span className="text-lg text-red-200">
                  Welcome, {user.name}
                </span>
              )}
              <button
                onClick={() => navigate("/dashboard")}
                className="text-white text-lg hover:text-red-200 transition"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate("/donors")}
                className="text-white text-lg hover:text-red-200 transition"
              >
                Donors
              </button>
              <button
                onClick={() => navigate("/requests")}
                className="text-white text-lg hover:text-red-200 transition"
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