import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

const ORDER_HISTORY_KEY =
  "aroma_order_history";

function formatDate(date) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

function getStatusStyle(status) {
  switch (status) {
    case "Completed":
      return "border-green-400/20 bg-green-400/[0.06] text-green-300";

    case "Ready":
      return "border-[#b8895f]/30 bg-[#b8895f]/[0.08] text-[#b8895f]";

    case "Preparing":
      return "border-blue-400/20 bg-blue-400/[0.06] text-blue-300";

    case "Confirmed":
      return "border-purple-400/20 bg-purple-400/[0.06] text-purple-300";

    case "Cancelled":
      return "border-red-400/20 bg-red-400/[0.06] text-red-300";

    default:
      return "border-white/10 bg-white/[0.03] text-white/40";
  }
}

function Orders() {
  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const savedIds =
          JSON.parse(
            localStorage.getItem(
              ORDER_HISTORY_KEY
            ) || "[]"
          );

        if (
          !Array.isArray(savedIds) ||
          savedIds.length === 0
        ) {
          setOrders([]);
          return;
        }

        const responses =
          await Promise.all(
            savedIds.map(async (orderId) => {
              try {
                const response =
                  await axios.get(
                    `${API_URL}/api/orders/${orderId}`
                  );

                return (
                  response.data?.data ||
                  null
                );
              } catch (orderError) {
                console.error(
                  `Failed to fetch order ${orderId}:`,
                  orderError
                );

                return null;
              }
            })
          );

        const validOrders =
          responses.filter(Boolean);

        validOrders.sort(
          (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        );

        setOrders(validOrders);
      } catch (err) {
        console.error(
          "Failed to fetch order history:",
          err
        );

        setError(
          "Unable to load your orders."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  /*
   * Loading
   */

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#17110d] via-[#120d0a] to-[#090604] px-5 py-20 text-[#f3eee5]">
        <div className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-[#b8895f]" />

            <p className="mt-6 text-[9px] uppercase tracking-[0.3em] text-[#b8895f]">
              Loading your orders
            </p>
          </div>
        </div>
      </main>
    );
  }

  /*
   * Empty
   */

  if (!error && orders.length === 0) {
    return (
      <main className="min-h-screen overflow-hidden bg-gradient-to-b from-[#17110d] via-[#120d0a] to-[#090604] px-5 py-20 text-[#f3eee5] sm:px-6 sm:py-28">
        <div className="pointer-events-none fixed right-[-100px] top-20 h-80 w-80 rounded-full bg-[#b8895f]/10 blur-[120px]" />

        <div className="relative mx-auto flex min-h-[65vh] max-w-2xl items-center justify-center">
          <div className="w-full rounded-[2rem] border border-white/10 bg-[#1b130f] p-8 text-center shadow-[0_25px_70px_rgba(0,0,0,0.35)] sm:p-12">
            <p className="text-[9px] uppercase tracking-[0.35em] text-[#b8895f]">
              Aroma
            </p>

            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">
              No orders yet.
            </h1>

            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-white/35">
              Your future coffee adventures will appear here after you place
              your first order.
            </p>

            <Link
              to="/menu"
              className="mt-8 inline-flex rounded-full bg-[#b8895f] px-7 py-3.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#17110d] transition hover:bg-[#f3eee5]"
            >
              Explore Menu
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-gradient-to-b from-[#17110d] via-[#120d0a] to-[#090604] px-5 py-20 text-[#f3eee5] sm:px-6 sm:py-28 lg:px-10">
      <div className="pointer-events-none fixed right-[-120px] top-16 h-80 w-80 rounded-full bg-[#b8895f]/10 blur-[120px]" />

      <div className="pointer-events-none fixed bottom-[-100px] left-[-100px] h-80 w-80 rounded-full bg-[#6d4832]/10 blur-[120px]" />

      <div className="relative mx-auto max-w-5xl">
        {/* Header */}

        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <Link
              to="/menu"
              className="text-[9px] uppercase tracking-[0.3em] text-white/35 transition hover:text-[#b8895f]"
            >
              ← Back to Menu
            </Link>

            <p className="mt-8 text-[9px] uppercase tracking-[0.35em] text-[#b8895f]">
              Aroma · Customer Area
            </p>

            <h1 className="mt-3 text-5xl font-semibold leading-[0.9] tracking-[-0.05em] sm:text-6xl">
              My
              <br />
              <span className="text-[#b8895f]">
                Orders.
              </span>
            </h1>
          </div>

          <Link
            to="/menu"
            className="w-fit rounded-full border border-white/10 px-5 py-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/55 transition hover:border-[#b8895f] hover:text-[#b8895f]"
          >
            Order Again
          </Link>
        </div>

        {/* Error */}

        {error && (
          <div className="mt-8 rounded-2xl border border-red-400/20 bg-red-950/30 p-5">
            <p className="text-sm text-red-300">
              {error}
            </p>
          </div>
        )}

        {/* Orders */}

        <div className="mt-10 space-y-4">
          {orders.map((order) => (
            <article
              key={order._id}
              className="group overflow-hidden rounded-[2rem] border border-white/10 bg-[#1b130f] shadow-[0_20px_60px_rgba(0,0,0,0.2)] transition-all duration-500 hover:-translate-y-1 hover:border-[#b8895f]/25"
            >
              <div className="p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full border border-white/10 bg-[#120d0a] px-3 py-1.5 text-[8px] uppercase tracking-[0.18em] text-white/45">
                        #{order._id}
                      </span>

                      <span
                        className={`rounded-full border px-3 py-1.5 text-[8px] uppercase tracking-[0.18em] ${getStatusStyle(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>

                      {order.paymentStatus && (
                        <span className="rounded-full border border-[#b8895f]/15 bg-[#b8895f]/[0.05] px-3 py-1.5 text-[8px] uppercase tracking-[0.18em] text-[#b8895f]">
                          {order.paymentStatus}
                        </span>
                      )}
                    </div>

                    <p className="mt-3 text-sm text-white/35">
                      {formatDate(
                        order.createdAt
                      )}
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-[8px] uppercase tracking-[0.25em] text-white/20">
                      Total
                    </p>

                    <p className="mt-1 text-2xl font-semibold text-[#b8895f]">
                      ₹
                      {Number(
                        order.totalAmount
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="mt-6 border-t border-white/10 pt-5">
                  <div className="space-y-3">
                    {order.items
                      .slice(0, 3)
                      .map(
                        (item, index) => (
                          <div
                            key={`${item.name}-${index}`}
                            className="flex items-center justify-between gap-4"
                          >
                            <div className="min-w-0">
                              <p className="truncate text-sm text-white/70">
                                {item.name}
                              </p>

                              <p className="mt-1 text-[9px] text-white/20">
                                Qty{" "}
                                {
                                  item.quantity
                                }
                              </p>
                            </div>

                            <p className="shrink-0 text-sm text-white/45">
                              ₹
                              {(
                                Number(
                                  item.price
                                ) *
                                Number(
                                  item.quantity
                                )
                              ).toFixed(2)}
                            </p>
                          </div>
                        )
                      )}

                    {order.items.length >
                      3 && (
                      <p className="pt-1 text-[8px] uppercase tracking-[0.2em] text-white/20">
                        +
                        {order.items.length -
                          3}{" "}
                        more item
                        {order.items.length -
                          3 ===
                        1
                          ? ""
                          : "s"}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[8px] uppercase tracking-[0.22em] text-white/20">
                      Payment
                    </p>

                    <p className="mt-1 text-xs text-white/45">
                      {order.paymentMethod ||
                        "Razorpay"}
                    </p>
                  </div>

                  <Link
                    to={`/order-success/${order._id}`}
                    className="flex h-11 items-center justify-center rounded-full bg-[#b8895f] px-6 text-[8px] font-semibold uppercase tracking-[0.18em] text-[#17110d] transition hover:bg-[#f3eee5]"
                  >
                    View Order
                    <span className="ml-2">
                      →
                    </span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

export default Orders;