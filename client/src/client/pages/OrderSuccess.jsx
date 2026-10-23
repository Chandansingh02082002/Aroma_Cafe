import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

const ORDER_HISTORY_KEY =
  "aroma_order_history";

const statusSteps = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Ready",
  "Completed",
];

function formatDate(date) {
  if (!date) return "—";

  return new Date(date).toLocaleString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}

function getStatusIndex(status) {
  const index =
    statusSteps.indexOf(status);

  return index === -1 ? 0 : index;
}

function OrderSuccess() {
  const { id } = useParams();

  const [order, setOrder] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /*
   * Save order ID locally.
   */

  useEffect(() => {
    if (!id) return;

    try {
      const existing =
        JSON.parse(
          localStorage.getItem(
            ORDER_HISTORY_KEY
          ) || "[]"
        );

      const updated = [
        id,
        ...existing.filter(
          (orderId) =>
            orderId !== id
        ),
      ].slice(0, 20);

      localStorage.setItem(
        ORDER_HISTORY_KEY,
        JSON.stringify(updated)
      );
    } catch (storageError) {
      console.error(
        "Unable to save order history:",
        storageError
      );
    }
  }, [id]);

  /*
   * Fetch order.
   */

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) {
        setError(
          "No order ID was provided."
        );
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response =
          await axios.get(
            `${API_URL}/api/orders/${id}`
          );

        setOrder(
          response.data?.data
        );
      } catch (err) {
        console.error(
          "Failed to fetch order:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to load your order."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  /*
   * Loading.
   */

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#17110d] via-[#120d0a] to-[#090604] px-5 py-20 text-[#f3eee5]">
        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-[#b8895f]" />

            <p className="mt-6 text-[9px] uppercase tracking-[0.3em] text-[#b8895f]">
              Loading your order
            </p>
          </div>
        </div>
      </main>
    );
  }

  /*
   * Error.
   */

  if (error || !order) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#17110d] via-[#120d0a] to-[#090604] px-5 py-20 text-[#f3eee5]">
        <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center">
          <div className="w-full rounded-[2rem] border border-white/10 bg-[#1b130f] p-8 text-center shadow-[0_25px_70px_rgba(0,0,0,0.35)] sm:p-12">
            <p className="text-[9px] uppercase tracking-[0.3em] text-red-300">
              Order unavailable
            </p>

            <h1 className="mt-4 text-3xl font-semibold">
              We couldn't find that order.
            </h1>

            <p className="mt-4 text-sm leading-7 text-white/35">
              {error ||
                "The order may have been removed or the link may be invalid."}
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/menu"
                className="rounded-full bg-[#b8895f] px-6 py-3.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#17110d] transition hover:bg-[#f3eee5]"
              >
                Browse Menu
              </Link>

              <Link
                to="/orders"
                className="rounded-full border border-white/15 px-6 py-3.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/70 transition hover:border-[#b8895f] hover:text-[#b8895f]"
              >
                My Orders
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const statusIndex =
    getStatusIndex(order.status);

  const paymentPaid =
    order.paymentStatus === "Paid";

  return (
    <main className="min-h-screen overflow-hidden bg-gradient-to-b from-[#17110d] via-[#120d0a] to-[#090604] px-5 py-20 text-[#f3eee5] sm:px-6 sm:py-28 lg:px-10">
      <div className="pointer-events-none fixed right-[-100px] top-20 h-80 w-80 rounded-full bg-[#b8895f]/10 blur-[120px]" />

      <div className="pointer-events-none fixed bottom-[-120px] left-[-100px] h-80 w-80 rounded-full bg-[#6d4832]/12 blur-[120px]" />

      <div className="relative mx-auto max-w-5xl">
        {/* Header */}

        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <Link
              to="/menu"
              className="text-[9px] uppercase tracking-[0.3em] text-white/35 transition hover:text-[#b8895f]"
            >
              ← Back to Menu
            </Link>

            <p className="mt-8 text-[9px] uppercase tracking-[0.35em] text-[#b8895f]">
              Aroma · Order Confirmed
            </p>

            <h1 className="mt-3 text-5xl font-semibold leading-[0.9] tracking-[-0.05em] sm:text-6xl">
              Thank you.
              <br />
              <span className="text-[#b8895f]">
                Your order is in.
              </span>
            </h1>
          </div>

          <div className="sm:text-right">
            <p className="text-[8px] uppercase tracking-[0.25em] text-white/25">
              Order ID
            </p>

            <p className="mt-2 max-w-[220px] break-all text-sm text-white/65">
              #{order._id}
            </p>
          </div>
        </div>

        {/* Payment banner */}

        <div className="mt-9 flex flex-col gap-4 rounded-[1.5rem] border border-[#b8895f]/20 bg-[#b8895f]/[0.06] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#b8895f]/10 text-lg text-[#b8895f]">
              ✓
            </div>

            <div>
              <p className="text-sm font-medium">
                Payment successful
              </p>

              <p className="mt-1 text-xs text-white/30">
                {formatDate(
                  order.createdAt
                )}
              </p>
            </div>
          </div>

          <span className="w-fit rounded-full border border-[#b8895f]/30 px-3 py-1.5 text-[8px] uppercase tracking-[0.22em] text-[#b8895f]">
            {order.paymentMethod ||
              "Razorpay"}{" "}
            ·{" "}
            {order.paymentStatus ||
              "Paid"}
          </span>
        </div>

        {/* Status */}

        <section className="mt-6 rounded-[2rem] border border-white/10 bg-[#1b130f] p-6 shadow-[0_25px_70px_rgba(0,0,0,0.25)] sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[9px] uppercase tracking-[0.3em] text-[#b8895f]">
                Order status
              </p>

              <h2 className="mt-2 text-2xl font-semibold">
                {order.status}
              </h2>
            </div>

            <p className="text-xs text-white/30">
              We'll keep your order moving.
            </p>
          </div>

          <div className="mt-9">
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute left-[10%] right-[10%] top-5 h-px bg-white/10" />

                <div
                  className="absolute left-[10%] top-5 h-px bg-[#b8895f] transition-all duration-700"
                  style={{
                    width: `${Math.min(
                      statusIndex /
                        (statusSteps.length -
                          1),
                      1
                    ) * 80}%`,
                  }}
                />

                <div className="relative grid grid-cols-5 gap-2">
                  {statusSteps.map(
                    (status, index) => {
                      const completed =
                        index <=
                        statusIndex;

                      const active =
                        index ===
                        statusIndex;

                      return (
                        <div
                          key={status}
                          className="text-center"
                        >
                          <div
                            className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full border text-xs transition-all duration-500 ${
                              completed
                                ? "border-[#b8895f] bg-[#b8895f] text-[#17110d]"
                                : "border-white/10 bg-[#120d0a] text-white/20"
                            } ${
                              active
                                ? "shadow-[0_0_0_6px_rgba(184,137,95,0.08)]"
                                : ""
                            }`}
                          >
                            {completed
                              ? "✓"
                              : index + 1}
                          </div>

                          <p
                            className={`mt-3 text-[8px] uppercase tracking-[0.18em] ${
                              active
                                ? "text-[#b8895f]"
                                : completed
                                  ? "text-white/50"
                                  : "text-white/20"
                            }`}
                          >
                            {status}
                          </p>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3 md:hidden">
              {statusSteps.map(
                (status, index) => {
                  const completed =
                    index <=
                    statusIndex;

                  const active =
                    index ===
                    statusIndex;

                  return (
                    <div
                      key={status}
                      className={`flex items-center gap-4 rounded-2xl border p-4 ${
                        active
                          ? "border-[#b8895f]/30 bg-[#b8895f]/[0.06]"
                          : "border-white/5 bg-[#120d0a]"
                      }`}
                    >
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-xs ${
                          completed
                            ? "border-[#b8895f] bg-[#b8895f] text-[#17110d]"
                            : "border-white/10 text-white/20"
                        }`}
                      >
                        {completed
                          ? "✓"
                          : index + 1}
                      </div>

                      <div>
                        <p
                          className={`text-[9px] font-medium uppercase tracking-[0.2em] ${
                            active
                              ? "text-[#b8895f]"
                              : "text-white/50"
                          }`}
                        >
                          {status}
                        </p>

                        {active && (
                          <p className="mt-1 text-xs text-white/25">
                            Current status
                          </p>
                        )}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </section>

        {/* Content */}

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* Items */}

          <section className="rounded-[2rem] border border-white/10 bg-[#1b130f] p-6 sm:p-8">
            <div className="flex items-end justify-between border-b border-white/10 pb-5">
              <div>
                <p className="text-[9px] uppercase tracking-[0.3em] text-[#b8895f]">
                  What you ordered
                </p>

                <h2 className="mt-2 text-2xl font-semibold">
                  Order items
                </h2>
              </div>

              <span className="text-xs text-white/25">
                {order.items.length}{" "}
                {order.items.length === 1
                  ? "item"
                  : "items"}
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {order.items.map(
                (item, index) => (
                  <div
                    key={`${item.menuItem?._id || item.menuItem || item.name}-${index}`}
                    className="flex items-center gap-4 rounded-2xl border border-white/5 bg-[#120d0a] p-4"
                  >
                    {item.menuItem?.image ? (
                      <img
                        src={
                          item.menuItem
                            .image
                        }
                        alt={item.name}
                        className="h-14 w-14 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#211711] text-[#b8895f]">
                        ☕
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {item.name}
                      </p>

                      <p className="mt-1 text-xs text-white/25">
                        ₹{item.price} ×{" "}
                        {item.quantity}
                      </p>
                    </div>

                    <p className="shrink-0 text-sm font-semibold text-[#b8895f]">
                      ₹
                      {(
                        Number(item.price) *
                        Number(item.quantity)
                      ).toFixed(2)}
                    </p>
                  </div>
                )
              )}
            </div>
          </section>

          {/* Details */}

          <aside className="rounded-[2rem] border border-white/10 bg-[#201610] p-6 sm:p-8">
            <p className="text-[9px] uppercase tracking-[0.3em] text-[#b8895f]">
              Order details
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <p className="text-[8px] uppercase tracking-[0.25em] text-white/20">
                  Customer
                </p>

                <p className="mt-2 text-sm text-white/70">
                  {order.customer.name}
                </p>
              </div>

              <div>
                <p className="text-[8px] uppercase tracking-[0.25em] text-white/20">
                  Email
                </p>

                <p className="mt-2 break-all text-sm text-white/50">
                  {order.customer.email}
                </p>
              </div>

              <div>
                <p className="text-[8px] uppercase tracking-[0.25em] text-white/20">
                  Phone
                </p>

                <p className="mt-2 text-sm text-white/50">
                  {order.customer.phone}
                </p>
              </div>

              <div className="border-t border-white/10 pt-5">
                <p className="text-[8px] uppercase tracking-[0.25em] text-white/20">
                  Total paid
                </p>

                <p className="mt-2 text-3xl font-semibold text-[#b8895f]">
                  ₹
                  {Number(
                    order.totalAmount
                  ).toFixed(2)}
                </p>
              </div>

              <div>
                <p className="text-[8px] uppercase tracking-[0.25em] text-white/20">
                  Payment
                </p>

                <div className="mt-2 rounded-xl border border-[#b8895f]/15 bg-[#b8895f]/[0.05] px-3 py-2">
                  <p className="text-xs text-white/50">
                    {order.paymentMethod ||
                      "Razorpay"}
                  </p>

                  <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-[#b8895f]">
                    {paymentPaid
                      ? "Payment successful"
                      : order.paymentStatus ||
                        "Pending"}
                  </p>
                </div>
              </div>
            </div>

           <div className="mt-7 border-t border-white/10 pt-6">
  <Link
    to="/orders"
    className="flex h-12 w-full items-center justify-center rounded-full bg-[#b8895f] text-[9px] font-semibold uppercase tracking-[0.18em] text-[#17110d] transition hover:bg-[#f3eee5]"
  >
    View My Orders
  </Link>

  {order.status === "Completed" && (
    <Link
      to={`/review/${order._id}`}
      className="mt-3 flex h-12 w-full items-center justify-center rounded-full border border-[#b8895f]/30 bg-[#b8895f]/[0.06] text-[9px] font-semibold uppercase tracking-[0.18em] text-[#b8895f] transition hover:bg-[#b8895f] hover:text-[#17110d]"
    >
      ★ Leave a Review
    </Link>
  )}

  <Link
    to="/menu"
    className="mt-3 flex h-12 w-full items-center justify-center rounded-full border border-white/10 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/55 transition hover:border-[#b8895f] hover:text-[#b8895f]"
  >
    Order Something Else
  </Link>
</div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default OrderSuccess;