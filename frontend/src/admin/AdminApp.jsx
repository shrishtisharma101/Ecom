import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import AdminDateFilterBar from "./components/AdminDateFilterBar";
import { AdminDateFilterProvider } from "./context/AdminDateFilterContext";

const AdminApp = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="h-screen overflow-hidden bg-[#f8f3ed]">

      {/* ================= SIDEBAR ================= */}

      <Sidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />

      {/* ================= MAIN AREA ================= */}

      <div
        className="
          h-screen
          flex
          flex-col
          lg:ml-56
          min-w-0
          overflow-hidden
        "
      >

        {/* ================= NAVBAR ================= */}

        <AdminDateFilterProvider>
          <Navbar setIsOpen={setIsOpen} />
          <AdminDateFilterBar />

          <main
            className="
              flex-1
              min-h-0
              min-w-0
              overflow-y-auto
              overflow-x-hidden
            "
          >
            <Outlet />
          </main>
        </AdminDateFilterProvider>

      </div>

    </div>
  );
};

export default AdminApp;
