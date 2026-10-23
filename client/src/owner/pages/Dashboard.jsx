import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import { getToken } from "../../services/auth";
import { API_URL } from "../../services/api";

function Dashboard() {
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
   * =========================================================
   * AUTH
   * =========================================================
   */

  const getAuthConfig = () => {
    const token = getToken();

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  /*
   * =========================================================
   * FETCH DASHBOARD DATA
   * =========================================================
   */

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const token = getToken();

        if (!token) {
          setError(
            "Your owner session has expired. Please log in again."
          );

          return;
        }

        const [menuResult, ordersResult, reviewsResult] =
          await Promise.allSettled([
            axios.get(`${API_URL}/api/menu`),
            axios.get(`${API_URL}/api/orders`, getAuthConfig()),
            axios.get(`${API_URL}/api/reviews`, getAuthConfig()),
          ]);

        const failures = [];

        if (menuResult.status === "fulfilled") {
          setMenuItems(menuResult.value.data?.data || []);
        } else {
          console.error("Failed to fetch dashboard menu:", menuResult.reason);
          failures.push("menu");
        }

        if (ordersResult.status === "fulfilled") {
          setOrders(ordersResult.value.data?.data || []);
        } else {
          console.error("Failed to fetch dashboard orders:", ordersResult.reason);
          failures.push("orders");
        }

        if (reviewsResult.status === "fulfilled") {
          setReviews(reviewsResult.value.data?.data || []);
        } else {
          console.error("Failed to fetch dashboard reviews:", reviewsResult.reason);
          failures.push("reviews");
        }

        if (failures.length) {
          const authFailed = [ordersResult, reviewsResult].some(
            (result) =>
              result.status === "rejected" &&
              result.reason?.response?.status === 401
          );

          setError(
            authFailed
              ? "Your owner session may have expired. Sign out and sign in again to refresh protected dashboard data."
              : `Some dashboard data could not load (${failures.join(", ")}). The available sections are still shown; check that the server and database are running.`
          );
        }
      } catch (err) {
        console.error(
          "Failed to fetch dashboard data:",
          err
        );

        if (err.response?.status === 401) {
          setError(
            "Your owner session has expired. Please log in again."
          );
        } else {
          setError(
            err.response?.data?.message ||
              "Unable to load dashboard data."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  /*
   * =========================================================
   * DATE HELPERS
   * =========================================================
   */

  const isToday = (date) => {
    if (!date) return false;

    const value = new Date(date);
    const today = new Date();

    return (
      value.getDate() === today.getDate() &&
      value.getMonth() === today.getMonth() &&
      value.getFullYear() === today.getFullYear()
    );
  };

  const isThisMonth = (date) => {
    if (!date) return false;

    const value = new Date(date);
    const today = new Date();

    return (
      value.getMonth() === today.getMonth() &&
      value.getFullYear() === today.getFullYear()
    );
  };

  /*
   * =========================================================
   * REVENUE RULE
   * =========================================================
   */

  const isRevenueOrder = (order) => {
    if (!order) {
      return false;
    }

    if (order.status === "Cancelled") {
      return false;
    }

    if (order.paymentStatus) {
      return order.paymentStatus === "Paid";
    }

    /*
     * Legacy orders created before paymentStatus
     * was added are still counted.
     */

    return true;
  };

  /*
   * =========================================================
   * CALCULATE STATS
   * =========================================================
   */

  const stats = useMemo(() => {
    const todayOrders = orders.filter((order) =>
      isToday(order.createdAt)
    );

    const monthOrders = orders.filter((order) =>
      isThisMonth(order.createdAt)
    );

    const revenueOrders =
      orders.filter(isRevenueOrder);

    const revenueToday = todayOrders
      .filter(isRevenueOrder)
      .reduce(
        (total, order) =>
          total +
          Number(order.totalAmount || 0),
        0
      );

    const revenueThisMonth = monthOrders
      .filter(isRevenueOrder)
      .reduce(
        (total, order) =>
          total +
          Number(order.totalAmount || 0),
        0
      );

    const totalRevenue =
      revenueOrders.reduce(
        (total, order) =>
          total +
          Number(order.totalAmount || 0),
        0
      );

    const averageRating =
      reviews.length === 0
        ? 0
        : reviews.reduce(
            (total, review) =>
              total +
              Number(review.rating || 0),
            0
          ) / reviews.length;

    return {
      menuItems: menuItems.length,

      ordersToday: todayOrders.length,

      revenueToday,

      revenueThisMonth,

      totalRevenue,

      reviews: reviews.length,

      averageRating,
    };
  }, [
    menuItems,
    orders,
    reviews,
  ]);

  /*
   * =========================================================
   * FORMAT CURRENCY
   * =========================================================
   */

  const formatCurrency = (amount) => {
    return `₹${Number(
      amount || 0
    ).toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    })}`;
  };

  /*
   * =========================================================
   * LOADING
   * =========================================================
   */

  if (loading) {
    return (
      <section className="flex min-h-[65vh] items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-[#241712]/10 border-t-[#8c6849]" />

          <p className="mt-5 text-[9px] uppercase tracking-[0.3em] text-[#241712]/50">
            Loading dashboard
          </p>
        </div>
      </section>
    );
  }

  /*
   * =========================================================
   * DASHBOARD
   * =========================================================
   */

  return (
    <section className="w-full min-w-0 pb-8 sm:pb-10">
      {/* =====================================================
          DASHBOARD INTRO
      ====================================================== */}

      <div className="border-b border-[#241712]/15 pb-6 sm:pb-8">
        <p className="text-[9px] font-medium uppercase tracking-[0.35em] text-[#8c6849] sm:text-[10px]">
          Overview
        </p>

        <h1 className="mt-3 max-w-3xl text-3xl font-semibold leading-[0.98] tracking-[-0.05em] text-[#241712] sm:text-4xl md:text-5xl">
          Cafe at a glance.
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-6 text-[#241712]/65 sm:text-base">
          Keep track of your menu, daily activity,
          revenue and customer feedback from one
          place.
        </p>
      </div>

      {/* =====================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="mt-5 rounded-2xl border border-[#a85d4a]/25 bg-[#a85d4a]/10 px-4 py-4 text-sm font-medium text-[#944b3b] sm:mt-6 sm:px-5">
          {error}
        </div>
      )}

      {/* =====================================================
          QUICK STATS
      ====================================================== */}

      <div className="mt-6 grid overflow-hidden rounded-[1.5rem] border border-[#241712]/20 bg-[#241712]/15 shadow-[0_16px_40px_rgba(36,23,18,0.08)] sm:mt-8 sm:grid-cols-2 lg:grid-cols-4">
        {/* Menu */}

        <div className="min-w-0 bg-[#f3ede3] p-5 sm:p-6 lg:p-7">
          <p className="text-[8px] font-medium uppercase tracking-[0.25em] text-[#241712]/55 sm:text-[9px]">
            Menu Items
          </p>

          <p className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-[#241712] sm:mt-5 sm:text-4xl">
            {stats.menuItems}
          </p>

          <p className="mt-2 text-[8px] uppercase tracking-[0.2em] text-[#241712]/40">
            Listed
          </p>
        </div>

        {/* Orders */}

        <div className="min-w-0 bg-[#f3ede3] p-5 sm:p-6 lg:p-7">
          <p className="text-[8px] font-medium uppercase tracking-[0.25em] text-[#241712]/55 sm:text-[9px]">
            Orders Today
          </p>

          <p className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-[#241712] sm:mt-5 sm:text-4xl">
            {stats.ordersToday}
          </p>

          <p className="mt-2 text-[8px] uppercase tracking-[0.2em] text-[#241712]/40">
            Placed today
          </p>
        </div>

        {/* Reviews */}

        <div className="min-w-0 bg-[#f3ede3] p-5 sm:p-6 lg:p-7">
          <div className="flex items-start justify-between gap-3">
            <p className="text-[8px] font-medium uppercase tracking-[0.25em] text-[#241712]/55 sm:text-[9px]">
              Reviews
            </p>

            {stats.averageRating > 0 && (
              <span className="shrink-0 text-xs font-medium text-[#b8895f]">
                ★{" "}
                {stats.averageRating.toFixed(1)}
              </span>
            )}
          </div>

          <p className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-[#241712] sm:mt-5 sm:text-4xl">
            {stats.reviews}
          </p>

          <p className="mt-2 text-[8px] uppercase tracking-[0.2em] text-[#241712]/40">
            Customer feedback
          </p>
        </div>

        {/* Revenue Today */}

        <div className="min-w-0 bg-[#241712] p-5 text-[#f5efe6] sm:p-6 lg:p-7">
          <p className="text-[8px] font-medium uppercase tracking-[0.25em] text-white/50 sm:text-[9px]">
            Revenue Today
          </p>

          <p className="mt-4 break-words text-3xl font-semibold tracking-[-0.05em] text-[#f5efe6] sm:mt-5 sm:text-4xl">
            {formatCurrency(
              stats.revenueToday
            )}
          </p>

          <p className="mt-2 text-[8px] uppercase tracking-[0.2em] text-[#c89b6d]">
            Today
          </p>
        </div>
      </div>

      {/* =====================================================
          REVENUE
      ====================================================== */}

      <div className="mt-6 grid gap-5 sm:mt-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(260px,0.65fr)]">
        {/* Main Revenue */}

        <div className="relative min-w-0 overflow-hidden rounded-[1.75rem] bg-[#241712] p-6 text-[#f5efe6] shadow-[0_20px_50px_rgba(36,23,18,0.15)] sm:p-8 lg:p-9">
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#b8895f]/10 blur-[80px]" />

          <div className="relative min-w-0">
            <p className="text-[8px] font-medium uppercase tracking-[0.35em] text-[#c89b6d] sm:text-[9px]">
              Revenue
            </p>

            <div className="mt-4 flex min-w-0 flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0">
                <h2 className="max-w-xl text-3xl font-semibold leading-[0.95] tracking-[-0.05em] sm:text-4xl md:text-5xl">
                  The numbers
                  <br />
                  <span className="text-[#c89b6d]">
                    that matter.
                  </span>
                </h2>

                <p className="mt-4 max-w-md text-sm leading-6 text-white/45 sm:mt-5">
                  A simple view of how the
                  cafe is performing
                  financially.
                </p>
              </div>

              <div className="shrink-0 lg:text-right">
                <p className="text-[8px] uppercase tracking-[0.22em] text-white/40">
                  Total Revenue
                </p>

                <p className="mt-2 break-words text-3xl font-semibold text-[#c89b6d] sm:text-4xl md:text-5xl">
                  {formatCurrency(
                    stats.totalRevenue
                  )}
                </p>
              </div>
            </div>

            <div className="mt-7 grid overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:mt-9 sm:grid-cols-2">
              <div className="min-w-0 bg-[#1b120e] p-5 sm:p-6">
                <p className="text-[8px] uppercase tracking-[0.2em] text-white/35">
                  Revenue This Month
                </p>

                <p className="mt-3 break-words text-2xl font-semibold sm:text-3xl">
                  {formatCurrency(
                    stats.revenueThisMonth
                  )}
                </p>
              </div>

              <div className="min-w-0 bg-[#1b120e] p-5 sm:p-6">
                <p className="text-[8px] uppercase tracking-[0.2em] text-white/35">
                  Revenue Today
                </p>

                <p className="mt-3 break-words text-2xl font-semibold sm:text-3xl">
                  {formatCurrency(
                    stats.revenueToday
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Focus */}

        <div className="min-w-0 rounded-[1.75rem] border border-[#241712]/20 bg-[#e7ddce] p-6 shadow-[0_18px_45px_rgba(36,23,18,0.08)] sm:p-8">
          <p className="text-[8px] font-medium uppercase tracking-[0.3em] text-[#8c6849] sm:text-[9px]">
            This Month
          </p>

          <p className="mt-5 break-words text-4xl font-semibold tracking-[-0.06em] text-[#241712] sm:mt-6 sm:text-5xl">
            {formatCurrency(
              stats.revenueThisMonth
            )}
          </p>

          <p className="mt-3 max-w-sm text-sm leading-6 text-[#241712]/65">
            Revenue generated during the
            current calendar month.
          </p>

          <div className="mt-7 border-t border-[#241712]/15 pt-5">
            <p className="text-[8px] uppercase tracking-[0.2em] text-[#241712]/45">
              All Time
            </p>

            <p className="mt-2 break-words text-2xl font-semibold text-[#241712]">
              {formatCurrency(
                stats.totalRevenue
              )}
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          LOWER CONTENT
      ====================================================== */}

      <div className="mt-6 grid gap-5 sm:mt-8 lg:grid-cols-[minmax(260px,0.75fr)_minmax(0,1.25fr)]">
        {/* Reviews */}

        <div className="min-w-0 rounded-[1.75rem] border border-[#241712]/20 bg-[#f5efe6] p-6 shadow-[0_18px_45px_rgba(36,23,18,0.08)] sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[8px] font-medium uppercase tracking-[0.3em] text-[#8c6849] sm:text-[9px]">
                Customer Love
              </p>

              <h3 className="mt-3 text-xl font-semibold tracking-[-0.04em] text-[#241712] sm:text-2xl">
                Reviews
              </h3>
            </div>

            <span className="shrink-0 text-2xl text-[#b8895f]">
              ★
            </span>
          </div>

          <div className="mt-7 flex items-end gap-3">
            <p className="text-4xl font-semibold tracking-[-0.06em] text-[#241712] sm:text-5xl">
              {stats.averageRating > 0
                ? stats.averageRating.toFixed(
                    1
                  )
                : "—"}
            </p>

            {stats.averageRating > 0 && (
              <span className="pb-1 text-sm text-[#241712]/45">
                / 5
              </span>
            )}
          </div>

          <p className="mt-3 text-sm text-[#241712]/60">
            Based on{" "}
            {stats.reviews}{" "}
            customer{" "}
            {stats.reviews === 1
              ? "review"
              : "reviews"}
            .
          </p>

          <a
            href="/owner/reviews"
            className="mt-6 inline-flex rounded-full bg-[#241712] px-5 py-3 text-[8px] font-semibold uppercase tracking-[0.18em] text-[#f5efe6] transition hover:bg-[#8c6849] sm:mt-7"
          >
            Open Reviews →
          </a>
        </div>

        {/* Management */}

        <div className="min-w-0 rounded-[1.75rem] bg-[#17110d] p-6 text-[#f5efe6] shadow-[0_20px_50px_rgba(23,17,13,0.16)] sm:p-8 lg:p-9">
          <p className="text-[8px] font-medium uppercase tracking-[0.35em] text-[#c89b6d] sm:text-[9px]">
            Management
          </p>

          <h3 className="mt-4 text-2xl font-semibold leading-[0.95] tracking-[-0.04em] sm:text-3xl">
            Keep everything in
            <br />
            <span className="text-[#c89b6d]">
              one place.
            </span>
          </h3>

          <div className="mt-7 grid gap-3 sm:mt-8 sm:grid-cols-3">
            <a
              href="/owner/menu"
              className="group min-w-0 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition duration-300 hover:bg-white/[0.07]"
            >
              <p className="text-[8px] uppercase tracking-[0.2em] text-white/35">
                01
              </p>

              <p className="mt-3 text-sm font-medium">
                Menu
              </p>

              <p className="mt-1 text-xs text-white/35">
                Manage items
              </p>

              <span className="mt-4 block text-xs text-[#c89b6d] opacity-0 transition group-hover:opacity-100">
                →
              </span>
            </a>

            <a
              href="/owner/orders"
              className="group min-w-0 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition duration-300 hover:bg-white/[0.07]"
            >
              <p className="text-[8px] uppercase tracking-[0.2em] text-white/35">
                02
              </p>

              <p className="mt-3 text-sm font-medium">
                Orders
              </p>

              <p className="mt-1 text-xs text-white/35">
                Track orders
              </p>

              <span className="mt-4 block text-xs text-[#c89b6d] opacity-0 transition group-hover:opacity-100">
                →
              </span>
            </a>

            <a
              href="/owner/settings"
              className="group min-w-0 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition duration-300 hover:bg-white/[0.07]"
            >
              <p className="text-[8px] uppercase tracking-[0.2em] text-white/35">
                03
              </p>

              <p className="mt-3 text-sm font-medium">
                Settings
              </p>

              <p className="mt-1 text-xs text-white/35">
                Cafe setup
              </p>

              <span className="mt-4 block text-xs text-[#c89b6d] opacity-0 transition group-hover:opacity-100">
                →
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;