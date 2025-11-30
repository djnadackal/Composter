import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-[#09090b] text-foreground relative">
      {/* Subtle purple gradient backgrounds */}
      <div 
        aria-hidden 
        className="fixed top-0 right-0 w-[50rem] h-[50rem] -translate-y-1/3 translate-x-1/4 rounded-full bg-[radial-gradient(circle,hsla(262,83%,58%,.06)_0%,transparent_70%)] pointer-events-none" 
      />
      <div 
        aria-hidden 
        className="fixed bottom-0 left-0 w-[40rem] h-[40rem] translate-y-1/3 -translate-x-1/4 rounded-full bg-[radial-gradient(circle,hsla(280,83%,58%,.04)_0%,transparent_70%)] pointer-events-none" 
      />

      <Sidebar />
      <Topbar />

      {/* Main Content Area */}
      <main className="lg:pl-64 pt-16 min-h-screen relative z-10">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;