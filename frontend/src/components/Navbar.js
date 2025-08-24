import React from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const navLinks = [
  { id: "shopRequests", name: "Shop requests" },
  { id: "users", name: "Users" },
  { id: "shops", name: "Shops" },
];

const Navbar = ({ sidebarOpen, setSidebarOpen, activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    toast.success("Logged out successfully");
  };

  const handleNavClick = (linkId) => {
    setActiveTab(linkId);
    // Close sidebar on mobile after clicking a link
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Sidebar */}
      <nav
        className={`
          fixed inset-y-2 left-2 w-56 rounded-lg text-white z-40 xl:ml-3 xl:mt-3 xl:mb-3 md:ml-3 md:mt-3 md:mb-3
          flex flex-col overflow-hidden
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-64"}
          md:translate-x-0 md:static
        `}
        style={{
          background: "rgba(255, 255, 255, 0.13)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(8.1px)",
          WebkitBackdropFilter: "blur(8.1px)",
        }}
      >
        <div className="py-6 px-4 flex-shrink-0 flex items-center justify-between">
          <h2 className="text-2xl font-bold">OrderBiz</h2>
          {/* Close button for mobile */}
          <button
            className="md:hidden p-1 rounded text-white hover:bg-white hover:bg-opacity-20 transition"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <ul className="px-4">
            {navLinks.map((link) => (
              <li key={link.id} className="mb-2">
                <button
                  onClick={() => handleNavClick(link.id)}
                  className={`w-full text-left px-3 py-2 rounded transition 
                    ${
                      activeTab === link.id
                        ? "bg-white bg-opacity-30 font-semibold"
                        : "hover:bg-white hover:bg-opacity-20"
                    }`}
                >
                  {link.name}
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-auto p-2 border-t border-white border-opacity-20">
            <button
              onClick={handleLogout}
              className="w-full flex items-center  justify-center gap-2 px-3 py-2 rounded text-white hover:bg-white hover:bg-opacity-20 transition"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;