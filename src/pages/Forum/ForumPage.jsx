import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import Sidebar from "../../components/forum/Sidebar";

export default function ForumPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="flex flex-1 bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
}
