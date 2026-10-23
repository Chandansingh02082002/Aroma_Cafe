import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { useCart } from "../../context/CartContext";
import { createOrder } from "../../services/api";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

const ORDER_HISTORY_KEY =
  "aroma_order_history";

function Checkout() {
  const navigate = useNavigate();

  const {
    cartItems,
    cartTotal,
    clearCart,
  } = useCart();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [paymentStarted, setPaymentStarted] =
    useState(false);

  /*
   * =========================================================
   * FORM
   * =========================================================
   */

  const handleChange = (event) => {
    setForm((previous) => ({
      ...previous,
      [event.target.name]:
        event.target.value,
    }));
  };

  /*
   * =========================================================
   * LOAD RAZORPAY
   * =========================================================
   */

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script =
        document.createElement("script");

      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => {
        resolve(true);
      };

      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };

  /*
   * =========================================================
   * VALIDATION
   * =========================================================
   */

  const validateForm = () => {
    if (!form.name.trim()) {
      return "Please enter your full name.";
    }

    if (!form.email.trim()) {
      return "Please enter your email.";
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email.trim()
      )
    ) {
      return "Please enter a valid email address.";
    }

    if (!form.phone.trim()) {
      return "Please enter your phone number.";
    }

    if (!/^[0-9]{10}$/.test(form.phone.trim())) {
      return "Please enter a valid 10-digit phone number.";
    }

    if (cartItems.length === 0) {
      return "Your cart is empty.";
    }

    if (
      !Number.isFinite(Number(cartTotal)) ||
      Number(cartTotal) <= 0
    ) {
      return "Invalid order total.";
    }

    return "";
  };

  /*
   * =========================================================
   * CREATE RAZORPAY ORDER
   * =========================================================
   */

  const createRazorpayOrder = async () => {
    const response = await axios.post(
      `${API_URL}/api/payments/create-order`,
      {
        amount: Number(cartTotal),

        receipt: `AROMA_${Date.now()}`,

        notes: {
          customerName:
            form.name.trim(),

          customerEmail:
            form.email.trim(),
        },
      }
    );

    if (
      !response.data?.success ||
      !response.data?.data?.id
    ) {
      throw new Error(
        response.data?.message ||
          "Unable to create payment order."
      );
    }

    return response.data.data;
  };

  /*
   * =========================================================
   * VERIFY PAYMENT
   * =========================================================
   */

  const verifyPayment = async (
    paymentResponse
  ) => {
    const response = await axios.post(
      `${API_URL}/api/payments/verify`,
      {
        razorpay_order_id:
          paymentResponse.razorpay_order_id,

        razorpay_payment_id:
          paymentResponse.razorpay_payment_id,

        razorpay_signature:
          paymentResponse.razorpay_signature,
      }
    );

    if (!response.data?.success) {
      throw new Error(
        response.data?.message ||
          "Payment verification failed."
      );
    }

    return response.data;
  };

  /*
   * =========================================================
   * CREATE AROMA ORDER
   * =========================================================
   */

  const createCafeOrder = async (
    paymentResponse
  ) => {
    const orderData = {
      customer: {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
      },

      items: cartItems.map((item) => ({
        menuItem: item._id,
        quantity: item.quantity,
      })),

      paymentMethod: "Razorpay",

      paymentStatus: "Paid",

      razorpayOrderId:
        paymentResponse.razorpay_order_id,

      razorpayPaymentId:
        paymentResponse.razorpay_payment_id,

      razorpaySignature:
        paymentResponse.razorpay_signature,
    };

    return createOrder(orderData);
  };

  /*
   * =========================================================
   * SAVE ORDER ID LOCALLY
   * =========================================================
   */

  const saveOrderToHistory = (orderId) => {
    try {
      const existing =
        JSON.parse(
          localStorage.getItem(
            ORDER_HISTORY_KEY
          ) || "[]"
        );

      const updated = [
        orderId,
        ...existing.filter(
          (savedId) =>
            savedId !== orderId
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
  };

  /*
   * =========================================================
   * PAYMENT FLOW
   * =========================================================
   */

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError =
      validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setPaymentStarted(false);
      setError("");

      /*
       * Load Razorpay.
       */

      const razorpayLoaded =
        await loadRazorpay();

      if (!razorpayLoaded) {
        throw new Error(
          "Unable to load Razorpay Checkout."
        );
      }

      /*
       * Create Razorpay order.
       */

      const razorpayOrder =
        await createRazorpayOrder();

      setPaymentStarted(true);

      /*
       * Razorpay options.
       */

      const options = {
        key: razorpayOrder.keyId,

        amount: razorpayOrder.amount,

        currency:
          razorpayOrder.currency ||
          "INR",

        name: "Aroma",

        description:
          "Aroma Cafe Order",

        order_id:
          razorpayOrder.id,

        prefill: {
          name: form.name.trim(),
          email: form.email.trim(),
          contact: form.phone.trim(),
        },

        notes: {
          cafe: "Aroma",
        },

        theme: {
          color: "#b8895f",
        },

        modal: {
          confirm_close: true,

          ondismiss: () => {
            setLoading(false);
            setPaymentStarted(false);
          },
        },

        /*
         * Payment success.
         */

        handler: async (
          paymentResponse
        ) => {
          try {
            /*
             * Verify with backend first.
             */

            await verifyPayment(
              paymentResponse
            );

            /*
             * Create actual cafe order.
             */

            const result =
              await createCafeOrder(
                paymentResponse
              );

            if (!result?.success) {
              throw new Error(
                result?.message ||
                  "Unable to create your order."
              );
            }

            const orderId =
              result.data._id;

            /*
             * Save order ID before
             * clearing the cart.
             */

            saveOrderToHistory(
              orderId
            );

            clearCart();

            setLoading(false);
            setPaymentStarted(false);

            navigate(
              `/order-success/${orderId}`
            );
          } catch (paymentError) {
            console.error(
              "Payment verification/order creation failed:",
              paymentError
            );

            setError(
              paymentError.response?.data
                ?.message ||
                paymentError.message ||
                "Payment was completed, but we couldn't confirm your order."
            );

            setLoading(false);
            setPaymentStarted(false);
          }
        },
      };

      const razorpay =
        new window.Razorpay(options);

      /*
       * Payment failed.
       */

      razorpay.on(
        "payment.failed",
        (response) => {
          console.error(
            "Razorpay payment failed:",
            response
          );

          setError(
            response.error?.description ||
              "Payment failed. Please try again."
          );

          setLoading(false);
          setPaymentStarted(false);
        }
      );

      razorpay.open();
    } catch (err) {
      console.error(
        "Checkout/payment failed:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to start payment."
      );

      setLoading(false);
      setPaymentStarted(false);
    }
  };

  /*
   * =========================================================
   * EMPTY CART
   * =========================================================
   */

  if (cartItems.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0e0a08] px-6 text-[#f3eee5]">
        <div className="text-center">
          <p className="text-[9px] uppercase tracking-[0.35em] text-[#b8895f]">
            Aroma
          </p>

          <h1 className="mt-4 text-4xl font-semibold">
            Your cart is empty.
          </h1>

          <p className="mt-3 text-sm text-white/35">
            Add something from our menu to continue.
          </p>

          <Link
            to="/menu"
            className="mt-7 inline-block rounded-full bg-[#b8895f] px-6 py-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#17110d] transition hover:bg-[#f3eee5]"
          >
            Browse Menu
          </Link>
        </div>
      </main>
    );
  }

  /*
   * =========================================================
   * PAGE
   * =========================================================
   */

  return (
    <main className="min-h-screen overflow-hidden bg-gradient-to-b from-[#17110d] via-[#120d0a] to-[#090604] px-5 py-28 text-[#f3eee5] sm:px-6 sm:py-32">
      <div className="pointer-events-none fixed -right-32 top-16 h-80 w-80 rounded-full bg-[#b8895f]/10 blur-[120px]" />

      <div className="pointer-events-none fixed -left-40 bottom-[-120px] h-96 w-96 rounded-full bg-[#6d4832]/10 blur-[130px]" />

      <div className="relative mx-auto max-w-6xl">
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/menu"
            className="text-[9px] uppercase tracking-[0.25em] text-white/40 transition hover:text-[#b8895f]"
          >
            ← Back to Menu
          </Link>

          <p className="text-[9px] uppercase tracking-[0.3em] text-[#b8895f]">
            Aroma Checkout
          </p>
        </div>

        <div className="mt-10 grid gap-7 lg:grid-cols-[1fr_390px]">
          {/* =================================================
              CHECKOUT FORM
          ================================================== */}

          <section>
            <p className="text-[9px] uppercase tracking-[0.35em] text-[#b8895f]">
              Checkout
            </p>

            <h1 className="mt-4 max-w-3xl text-5xl font-semibold leading-[0.9] tracking-[-0.05em] sm:text-6xl">
              Complete your
              <br />
              <span className="text-[#b8895f]">
                order.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-white/35">
              Enter your details and continue to our secure Razorpay test
              checkout.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-9 rounded-[2rem] border border-white/10 bg-[#1b130f] p-6 shadow-[0_25px_70px_rgba(0,0,0,0.28)] sm:p-8"
            >
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="checkout-name"
                    className="mb-2 block text-[9px] uppercase tracking-[0.25em] text-white/35"
                  >
                    Full Name
                  </label>

                  <input
                    id="checkout-name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                    placeholder="Your name"
                    className="w-full rounded-2xl border border-white/10 bg-[#100c09] px-4 py-4 text-sm text-[#f3eee5] outline-none transition placeholder:text-white/20 focus:border-[#b8895f]/60"
                  />
                </div>

                <div>
                  <label
                    htmlFor="checkout-email"
                    className="mb-2 block text-[9px] uppercase tracking-[0.25em] text-white/35"
                  >
                    Email
                  </label>

                  <input
                    id="checkout-email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border border-white/10 bg-[#100c09] px-4 py-4 text-sm text-[#f3eee5] outline-none transition placeholder:text-white/20 focus:border-[#b8895f]/60"
                  />
                </div>

                <div>
                  <label
                    htmlFor="checkout-phone"
                    className="mb-2 block text-[9px] uppercase tracking-[0.25em] text-white/35"
                  >
                    Phone
                  </label>

                  <input
                    id="checkout-phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    maxLength={10}
                    inputMode="numeric"
                    autoComplete="tel"
                    placeholder="9876543210"
                    className="w-full rounded-2xl border border-white/10 bg-[#100c09] px-4 py-4 text-sm text-[#f3eee5] outline-none transition placeholder:text-white/20 focus:border-[#b8895f]/60"
                  />
                </div>
              </div>

              {error && (
                <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-950/30 px-4 py-4">
                  <p className="text-sm leading-6 text-red-300">
                    {error}
                  </p>
                </div>
              )}

              <div className="mt-8 border-t border-white/10 pt-7">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[8px] uppercase tracking-[0.3em] text-white/25">
                      Payment method
                    </p>

                    <p className="mt-2 text-lg font-medium">
                      Razorpay
                    </p>
                  </div>

                  <span className="rounded-full border border-[#b8895f]/25 bg-[#b8895f]/10 px-3 py-1.5 text-[8px] uppercase tracking-[0.2em] text-[#b8895f]">
                    Test mode
                  </span>
                </div>

                <p className="mt-3 text-sm leading-6 text-white/30">
                  No real money will be charged while we're developing Aroma.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-8 flex h-14 w-full items-center justify-center rounded-full bg-[#b8895f] px-6 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#17110d] transition-all duration-300 hover:bg-[#f3eee5] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? paymentStarted
                    ? "Opening Payment..."
                    : "Preparing..."
                  : `Pay ₹${Number(
                      cartTotal
                    ).toFixed(2)}`}
              </button>
            </form>
          </section>

          {/* =================================================
              ORDER SUMMARY
          ================================================== */}

          <aside className="h-fit rounded-[2rem] border border-white/10 bg-[#201610] p-6 shadow-[0_25px_70px_rgba(0,0,0,0.3)] lg:sticky lg:top-28">
            <div className="flex items-end justify-between border-b border-white/10 pb-5">
              <div>
                <p className="text-[9px] uppercase tracking-[0.3em] text-[#b8895f]">
                  Order Summary
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
                  Your order
                </h2>
              </div>

              <span className="text-[8px] uppercase tracking-[0.2em] text-white/20">
                {cartItems.length}{" "}
                {cartItems.length === 1
                  ? "item"
                  : "items"}
              </span>
            </div>

            <div className="mt-6 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="rounded-2xl border border-white/5 bg-[#120d0a] p-3.5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {item.name}
                      </p>

                      <p className="mt-1 text-[9px] text-white/25">
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
                </div>
              ))}
            </div>

            <div className="mt-7 space-y-3 border-t border-white/10 pt-6">
              <div className="flex justify-between text-sm text-white/35">
                <span>Subtotal</span>

                <span>
                  ₹
                  {Number(
                    cartTotal
                  ).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-sm text-white/35">
                <span>Delivery</span>

                <span className="text-[#b8895f]">
                  Free
                </span>
              </div>

              <div className="flex items-end justify-between border-t border-white/10 pt-5">
                <span className="text-sm font-medium">
                  Total
                </span>

                <span className="text-2xl font-semibold text-[#b8895f]">
                  ₹
                  {Number(
                    cartTotal
                  ).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="mt-7 rounded-2xl border border-[#b8895f]/10 bg-[#b8895f]/5 p-4">
              <p className="text-[8px] uppercase tracking-[0.22em] text-[#b8895f]">
                Aroma
              </p>

              <p className="mt-2 text-xs leading-5 text-white/30">
                Your payment is processed through Razorpay Test Mode while we
                build and test the ordering system.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default Checkout;