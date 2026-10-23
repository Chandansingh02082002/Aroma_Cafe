import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../services/auth";

function Sidebar({
  mobileOpen,
  onClose,
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onClose?.();
    navigate("/owner/login");
  };

  const navItems = [
    {
      name: "Overview",
      path: "/owner/dashboard",
    },
    {
      name: "Menu",
      path: "/owner/menu",
    },
    {
      name: "Orders",
      path: "/owner/orders",
    },
    {
      name: "Reviews",
      path: "/owner/reviews",
    },
    {
      name: "Settings",
      path: "/owner/settings",
    },
  ];

  const handleNavigation = () => {
    onClose?.();
  };

  return (
    <>
      {/* =====================================================
          MOBILE OVERLAY
      ====================================================== */}

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-[#17110d]/65 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex w-[280px] flex-col
          bg-[#241712] text-[#f5efe6]
          shadow-[15px_0_50px_rgba(23,17,13,0.20)]
          transition-transform duration-300 ease-out

          lg:w-72
          lg:translate-x-0
          lg:shadow-none

          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* ===================================================
            BRAND
        ==================================================== */}

        <div className="border-b border-white/10 px-6 py-6 sm:px-8 sm:py-7">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xl font-bold tracking-[0.25em]">
                AROMA
              </p>

              <p className="mt-2 text-[9px] uppercase tracking-[0.3em] text-white/40">
                Owner Portal
              </p>
            </div>

            {/* Mobile close */}

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-lg text-white/60 transition hover:bg-[#b8895f] hover:text-[#17110d] lg:hidden"
              aria-label="Close navigation"
            >
              ×
            </button>
          </div>
        </div>

        {/* ===================================================
            NAVIGATION
        ==================================================== */}

        <nav className="flex-1 overflow-y-auto px-3 py-7 sm:px-4">
          <p className="px-4 text-[9px] uppercase tracking-[0.3em] text-white/30">
            Management
          </p>

          <div className="mt-4 space-y-2">
            {navItems.map(
              (item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={
                    item.path ===
                    "/owner/dashboard"
                  }
                  onClick={
                    handleNavigation
                  }
                  className={({
                    isActive,
                  }) =>
                    `
                    flex min-h-[52px]
                    items-center justify-between
                    rounded-2xl px-4 py-3
                    text-sm
                    transition duration-300

                    ${
                      isActive
                        ? "bg-[#c89b6d] font-semibold text-[#241712] shadow-[0_10px_25px_rgba(200,155,109,0.16)]"
                        : "text-white/60 hover:bg-white/5 hover:text-white"
                    }
                  `
                  }
                >
                  <span>
                    {item.name}
                  </span>

                  <span
                    className="
                      text-xs
                      opacity-50
                    "
                  >
                    →
                  </span>
                </NavLink>
              )
            )}
          </div>
        </nav>

        {/* ===================================================
            OWNER / LOGOUT
        ==================================================== */}

        <div className="border-t border-white/10 p-3 sm:p-4">
          <div className="mb-3 rounded-2xl bg-white/[0.04] px-4 py-4">
            <p className="text-[8px] uppercase tracking-[0.25em] text-white/30">
              Signed in as
            </p>

            <p className="mt-2 text-sm font-medium text-[#c89b6d]">
              Owner
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex min-h-[48px] w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm text-white/60 transition hover:bg-[#a85d4a]/10 hover:text-[#d99583]"
          >
            <span>
              Logout
            </span>

            <span>
              →
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;