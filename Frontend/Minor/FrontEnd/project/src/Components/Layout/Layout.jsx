import React from "react";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import { useState } from "react";
import LoginPage from "../../Pages/Login";
import SignupPage from "../../Pages/Signup";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../Pages/auth";

function Layout() {
  const [selectedPage, setSelectedPage] = useState("jobs");
  const user = useSelector(selectUser);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handlePageChange = (page) => {
    setSelectedPage(page);
  };

  if (user?.hold) {
    return (
      <div className="flex flex-col h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="bg-red-200 text-red-700 p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Account On Hold</h2>
            <p className="text-lg">Your account is on hold. Please contact your admin for further assistance.</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col h-screen ">
    <Navbar />
    <div className="flex flex-1 h-full mt-10 bg-gray-100">
      <Sidebar
        onPageChange={handlePageChange}
      />
      <main className=" mt-10 flex-1 p-6 overflow-y-auto h-[calc(100vh-4rem)]">
        {/* <SignupPage /> */}
        <Outlet/>
      </main>
    </div>
  </div>
  );
}

export default Layout;