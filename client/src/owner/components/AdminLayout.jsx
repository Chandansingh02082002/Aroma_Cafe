import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import AdminNavbar from "./AdminNavbar";

function AdminLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  return (
    <div className="min-h-screen bg-[#f3ede3] text-[#241712]">
      {/* =====================================================
          DESKTOP SIDEBAR
      ====================================================== */}

      <Sidebar
        mobileOpen={mobileMenuOpen}
        onClose={() =>
          setMobileMenuOpen(false)
        }
      />

      {/* =====================================================
          MAIN AREA
      ====================================================== */}

      <div className="min-h-screen lg:pl-72">
        <AdminNavbar
          onMenuClick={() =>
            setMobileMenuOpen(true)
          }
        />

        <main className="px-4 pb-8 pt-6 sm:px-6 sm:py-8 lg:px-10 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;