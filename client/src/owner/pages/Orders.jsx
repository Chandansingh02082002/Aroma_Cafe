import { useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";

import { gsap } from "../../animations/gsapConfig";
import {
  getOrders,
  updateOrderStatus,
} from "../../services/api";

const statuses = [
  "All",
  "Pending",
  "Confirmed",
  "Preparing",
  "Ready",
  "Completed",
  "Cancelled",
];

function Orders() {
  const [orders, setOrders] = useState([]);
  const [activeStatus, setActiveStatus] =
    useState("All");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [updatingId, setUpdatingId] =
    useState(null);

  /*
   * =========================================================
   * FETCH ORDERS
   * =========================================================
   */

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getOrders();

      setOrders(result.data || []);
    } catch (err) {
      console.error(
        "Failed to load orders:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /*
   * =========================================================
   * GSAP
   * =========================================================
   *
   * IMPORTANT:
   * No opacity animation here.
   * This prevents older orders from appearing faded.
   * =========================================================
   */

  useGSAP(
    () => {
      if (loading) return;

      gsap.fromTo(
        ".order-card",
        {
          y: 16,
        },
        {
          y: 0,
          duration: 0.4,
          stagger: 0.04,
          ease: "power2.out",
          clearProps: "transform",
        }
      );
    },
    {
      dependencies: [loading, activeStatus],
    }
  );

  /*
   * =========================================================
   * FILTER
   * =========================================================
   */

  const filteredOrders =
    activeStatus === "All"
      ? orders
      : orders.filter(
          (order) =>
            order.status === activeStatus
        );

  /*
   * =========================================================
   * UPDATE ORDER STATUS
   * =========================================================
   */

  const handleStatusChange = async (
    id,
    status
  ) => {
    try {
      setUpdatingId(id);
      setError("");

      const result =
        await updateOrderStatus(
          id,
          status
        );

      setOrders(
        (currentOrders) =>
          currentOrders.map(
            (order) =>
              order._id === id
                ? result.data
                : order
          )
      );
    } catch (err) {
      console.error(
        "Failed to update order:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to update order status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  /*
   * =========================================================
   * STATUS COLORS
   * =========================================================
   */

  const getStatusClasses = (
    status
  ) => {
    switch (status) {
      case "Pending":
        return "border-[#b8895f]/25 bg-[#b8895f]/10 text-[#8c6849]";

      case "Confirmed":
        return "border-[#8c6849]/25 bg-[#8c6849]/10 text-[#6f503b]";

      case "Preparing":
        return "border-[#c89b6d]/30 bg-[#c89b6d]/10 text-[#744f35]";

      case "Ready":
        return "border-[#788b62]/25 bg-[#788b62]/10 text-[#5f7448]";

      case "Completed":
        return "border-[#788b62]/35 bg-[#788b62]/15 text-[#52663d]";

      case "Cancelled":
        return "border-[#a85d4a]/25 bg-[#a85d4a]/10 text-[#944b3b]";

      default:
        return "border-[#241712]/15 bg-[#241712]/5 text-[#241712]/65";
    }
  };

  /*
   * =========================================================
   * DATE
   * =========================================================
   */

  const formatDate = (date) => {
    return new Date(date).toLocaleString(
      "en-IN",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );
  };

  /*
   * =========================================================
   * PAGE
   * =========================================================
   */

  return (
    <section className="w-full min-w-0 pb-8 sm:pb-10">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col gap-5 border-b border-[#241712]/20 pb-6 sm:gap-6 sm:pb-8 xl:flex-row xl:items-end xl:justify-between">
        <div className="min-w-0">
          <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-[#8c6849] sm:text-sm">
            Order Management
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#241712] sm:text-4xl md:text-5xl">
            Customer Orders
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-6 text-[#241712]/70">
            Track every order from checkout to
            completion.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchOrders}
          disabled={loading}
          className="w-full rounded-full border border-[#241712]/25 bg-[#f5efe6] px-6 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-[#241712] transition duration-300 hover:border-[#8c6849] hover:bg-[#e7ddce] hover:text-[#6f503b] disabled:cursor-not-allowed disabled:opacity-50 sm:w-fit"
        >
          {loading
            ? "Refreshing..."
            : "Refresh"}
        </button>
      </div>

      {/* =====================================================
          FILTERS
      ====================================================== */}

      <div className="mt-6 overflow-x-auto pb-2 sm:mt-8">
        <div className="flex min-w-max gap-2.5 sm:gap-3">
          {statuses.map((status) => {
            const active =
              activeStatus === status;

            return (
              <button
                key={status}
                type="button"
                onClick={() =>
                  setActiveStatus(
                    status
                  )
                }
                className={`whitespace-nowrap rounded-full border px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.12em] transition duration-300 sm:px-5 sm:text-sm ${
                  active
                    ? "border-[#241712] bg-[#241712] text-[#f5efe6] shadow-[0_8px_20px_rgba(36,23,18,0.12)]"
                    : "border-[#241712]/20 bg-[#f5efe6] text-[#241712]/70 hover:border-[#8c6849] hover:bg-[#e7ddce] hover:text-[#6f503b]"
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>
      </div>

      {/* =====================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="mt-5 rounded-2xl border border-[#a85d4a]/30 bg-[#a85d4a]/10 px-4 py-4 text-sm font-medium text-[#944b3b] sm:mt-6 sm:px-5">
          {error}
        </div>
      )}

      {/* =====================================================
          LOADING
      ====================================================== */}

      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center sm:min-h-[350px]">
          <div className="text-center">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-[#241712]/10 border-t-[#8c6849]" />

            <p className="mt-5 text-[9px] font-medium uppercase tracking-[0.3em] text-[#241712]/55">
              Loading orders
            </p>
          </div>
        </div>
      ) : filteredOrders.length ===
        0 ? (
        /* ===================================================
            EMPTY
        ==================================================== */

        <div className="mt-6 rounded-[1.75rem] border border-[#241712]/25 bg-[#f5efe6] px-5 py-16 text-center shadow-[0_20px_50px_rgba(36,23,18,0.10)] sm:mt-8 sm:px-6 sm:py-20">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#e7ddce] text-[#8c6849]">
            —
          </div>

          <p className="mt-5 text-2xl font-semibold text-[#241712]">
            No orders found.
          </p>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#241712]/60">
            There are no orders in this
            status yet.
          </p>
        </div>
      ) : (
        /* ===================================================
            ORDERS
        ==================================================== */

        <div className="mt-6 space-y-4 sm:mt-8 sm:space-y-5">
          {filteredOrders.map(
            (order) => (
              <article
                key={order._id}
                className="order-card min-w-0 overflow-hidden rounded-[1.75rem] border border-[#241712]/25 bg-[#f5efe6] shadow-[0_20px_50px_rgba(36,23,18,0.12)] transition duration-300 hover:shadow-[0_24px_60px_rgba(36,23,18,0.16)] sm:rounded-[2rem]"
              >
                {/* =================================================
                    ORDER HEADER
                ================================================== */}

                <div className="flex flex-col gap-5 border-b border-[#241712]/20 p-5 sm:gap-6 sm:p-7 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                      <h3 className="break-all text-lg font-semibold text-[#241712] sm:text-2xl">
                        Order #
                        {order._id
                          .slice(-6)
                          .toUpperCase()}
                      </h3>

                      <span
                        className={`rounded-full border px-3 py-1.5 text-[10px] font-semibold ${getStatusClasses(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="mt-4 space-y-1.5 text-sm text-[#241712]/70">
                      <p className="break-words font-medium text-[#241712]/85">
                        {
                          order
                            .customer
                            .name
                        }
                      </p>

                      <p className="break-all">
                        {
                          order
                            .customer
                            .email
                        }
                      </p>

                      <p>
                        {
                          order
                            .customer
                            .phone
                        }
                      </p>

                      <p className="text-[#241712]/55">
                        {formatDate(
                          order.createdAt
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Total */}

                  <div className="shrink-0 lg:text-right">
                    <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#241712]/50">
                      Total
                    </p>

                    <p className="mt-1 text-3xl font-semibold tracking-[-0.04em] text-[#241712] sm:text-4xl">
                      ₹
                      {
                        order.totalAmount
                      }
                    </p>

                    {order.paymentStatus && (
                      <span className="mt-3 inline-flex rounded-full border border-[#b8895f]/20 bg-[#b8895f]/10 px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.18em] text-[#8c6849]">
                        {
                          order.paymentStatus
                        }
                      </span>
                    )}
                  </div>
                </div>

                {/* =================================================
                    ITEMS
                ================================================== */}

                <div className="p-5 sm:p-7">
                  <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.25em] text-[#241712]/50">
                    Items
                  </p>

                  <div className="space-y-3">
                    {order.items.map(
                      (
                        item,
                        index
                      ) => (
                        <div
                          key={`${order._id}-${index}`}
                          className="flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-[#241712]/10 bg-[#e7ddce] px-3.5 py-3.5 sm:gap-4 sm:px-4 sm:py-4"
                        >
                          <div className="min-w-0">
                            <p className="break-words font-semibold text-[#241712]">
                              {
                                item.name
                              }
                            </p>

                            <p className="mt-1 text-xs text-[#241712]/65 sm:text-sm">
                              ₹
                              {
                                item.price
                              }{" "}
                              ×{" "}
                              {
                                item.quantity
                              }
                            </p>
                          </div>

                          <p className="shrink-0 text-sm font-semibold text-[#241712] sm:text-base">
                            ₹
                            {Number(
                              item.price
                            ) *
                              Number(
                                item.quantity
                              )}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* =================================================
                    STATUS ACTION
                ================================================== */}

                <div className="flex flex-col gap-4 border-t border-[#241712]/20 bg-[#f3ede3] p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between lg:px-7 lg:py-5">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#241712]">
                      Update order status
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#241712]/50">
                      Move the order through the
                      preparation process.
                    </p>
                  </div>

                  <select
                    value={
                      order.status
                    }
                    onChange={(
                      event
                    ) =>
                      handleStatusChange(
                        order._id,
                        event.target
                          .value
                      )
                    }
                    disabled={
                      updatingId ===
                      order._id
                    }
                    className="h-12 w-full rounded-full border border-[#241712]/25 bg-[#f5efe6] px-5 text-sm font-semibold text-[#241712] outline-none transition focus:border-[#8c6849] focus:ring-2 focus:ring-[#b8895f]/20 disabled:cursor-not-allowed disabled:opacity-50 lg:w-auto lg:min-w-[190px]"
                  >
                    <option value="Pending">
                      Pending
                    </option>

                    <option value="Confirmed">
                      Confirmed
                    </option>

                    <option value="Preparing">
                      Preparing
                    </option>

                    <option value="Ready">
                      Ready
                    </option>

                    <option value="Completed">
                      Completed
                    </option>

                    <option value="Cancelled">
                      Cancelled
                    </option>
                  </select>
                </div>
              </article>
            )
          )}
        </div>
      )}
    </section>
  );
}

export default Orders;