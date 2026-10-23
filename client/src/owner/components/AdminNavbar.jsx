import { getOwner } from "../../services/auth";

function AdminNavbar({
  onMenuClick,
}) {
  const owner = getOwner();

  const ownerName =
    owner?.name ||
    owner?.username ||
    "Owner";

  const ownerEmail =
    owner?.email ||
    "";

  return (
    <header className="sticky top-0 z-30 border-b border-[#241712]/10 bg-[#f3ede3]/95 backdrop-blur-xl">
      <div className="flex min-h-[78px] items-center justify-between gap-4 px-4 sm:min-h-[88px] sm:px-6 lg:px-10">
        {/* =================================================
            MOBILE MENU
        ================================================== */}

        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#241712]/15 bg-[#f5efe6] text-[#241712] transition hover:border-[#b8895f] hover:bg-[#e7ddce] lg:hidden"
            aria-label="Open navigation"
          >
            <span className="flex flex-col gap-1.5">
              <span className="h-px w-4 bg-[#241712]" />
              <span className="h-px w-4 bg-[#241712]" />
              <span className="h-px w-4 bg-[#241712]" />
            </span>
          </button>

          <div className="min-w-0">
            <p className="text-[8px] uppercase tracking-[0.3em] text-[#8c6849] sm:text-[9px]">
              Owner Portal
            </p>

            <h1 className="mt-1 truncate text-lg font-semibold tracking-[-0.02em] text-[#241712] sm:text-2xl">
              Welcome back,{" "}
              {ownerName}
            </h1>
          </div>
        </div>

        {/* =================================================
            EMAIL
        ================================================== */}

        {ownerEmail && (
          <div className="hidden max-w-[320px] truncate rounded-full border border-[#241712]/10 bg-[#f5efe6] px-4 py-2.5 text-xs text-[#241712]/55 sm:block">
            {ownerEmail}
          </div>
        )}
      </div>
    </header>
  );
}

export default AdminNavbar;