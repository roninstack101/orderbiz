import Navbar from "../components/Navbar";
import adminbg from "../assets/adminbg.jpg"; 
import { useState } from "react";
import ShopRequestsTable from "../components/shoprequest";
import UsersTable from "../components/usertable";
import ShopsTable from "../components/shoptable";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("shops"); 
   const [searchQuery, setSearchQuery] = useState("");

  const token = localStorage.getItem("token");

  const renderContent = () => {
    switch (activeTab) {
      case "shopRequests":
        return <ShopRequestsTable token={token} searchQuery={searchQuery} />;
      case "users":
        return <UsersTable token={token} searchQuery={searchQuery} />;
      case "shops":
        return <ShopsTable token={token} searchQuery={searchQuery} />;
      default:
        return (
          <div className="p-6 text-gray-600">
            Select a section from the navigation
          </div>
        );
    }
  };

  return (
    <div className="relative flex h-screen overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${adminbg})`,
          backgroundSize: "cover",
          backgroundPosition: "center", 
          backgroundRepeat: "no-repeat",
        }}
      ></div>
      
      {/* Content */}
      <div className="relative z-10 flex w-full">
        {/* Sidebar */}
        <Navbar 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
          activeTab={activeTab}            
          setActiveTab={setActiveTab}       
        />

        {/* Main Area */}
        <div className="flex-1 ml-0 md:m-3 flex flex-col overflow-hidden">
          {/* Header */}
          <div 
            className="md:rounded-xl shadow p-3 mb-6 flex-shrink-0 flex items-center gap-1" 
            style={{
              background: "rgba(255, 255, 255, 0.13)",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
              backdropFilter: "blur(8.1px)",
              WebkitBackdropFilter: "blur(8.1px)",
            }}
          >
            {/* Mobile button */}
            <button
              className="md:hidden p-2 rounded text-white hover:bg-[#4b92dd] transition"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
            <div className="md:hidden w-10"></div>
          </div>

          {/* Searchbar */}
          <div className="mb-6 flex-shrink-0 flex justify-center items-center gap-3">
             <input
              type="text"
              placeholder={`Search in ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-1/2 max-w-md px-4 py-3 rounded-[50px] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
           
          </div>

          {/* Dynamic content */}
          <div className="bg-white rounded-xl shadow flex-1 overflow-y-auto no-scrollbar m-4 mt-0 md:m-0 xl:m-0">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
