import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

function Review() {
  const { id } = useParams();

  const navigate =
    useNavigate();

  const [order, setOrder] =
    useState(null);

  const [rating, setRating] =
    useState(5);

  const [comment, setComment] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  const [existingReview, setExistingReview] =
    useState(null);

  /*
   * =========================================================
   * FETCH ORDER + EXISTING REVIEW
   * =========================================================
   */

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const orderResponse =
          await axios.get(
            `${API_URL}/api/orders/${id}`
          );

        const currentOrder =
          orderResponse.data?.data;

        if (!currentOrder) {
          throw new Error(
            "Order not found."
          );
        }

        setOrder(
          currentOrder
        );

        /*
         * Prefill email from order.
         * User still has to confirm/type it.
         */

        setEmail(
          currentOrder.customer?.email ||
            ""
        );

        /*
         * Check if review exists.
         */

        const reviewResponse =
          await axios.get(
            `${API_URL}/api/reviews/order/${id}`
          );

        if (
          reviewResponse.data?.exists
        ) {
          setExistingReview(
            reviewResponse.data.data
          );
        }
      } catch (err) {
        console.error(
          "Failed to load review page:",
          err
        );

        setError(
          err.response?.data
            ?.message ||
            err.message ||
            "Unable to load this order."
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  /*
   * =========================================================
   * SUBMIT REVIEW
   * =========================================================
   */

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (!order) {
      return;
    }

    if (
      order.status !==
      "Completed"
    ) {
      setError(
        "You can review this order only after it has been completed."
      );

      return;
    }

    if (!email.trim()) {
      setError(
        "Please enter the email used for this order."
      );

      return;
    }

    if (!comment.trim()) {
      setError(
        "Please write something about your experience."
      );

      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const response =
        await axios.post(
          `${API_URL}/api/reviews`,
          {
            orderId: id,

            email:
              email.trim(),

            rating,

            comment:
              comment.trim(),
          }
        );

      if (
        !response.data?.success
      ) {
        throw new Error(
          response.data?.message ||
            "Unable to submit your review."
        );
      }

      setSuccess(true);
    } catch (err) {
      console.error(
        "Review submission failed:",
        err
      );

      setError(
        err.response?.data
          ?.message ||
          err.message ||
          "Unable to submit review."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /*
   * =========================================================
   * LOADING
   * =========================================================
   */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#17110d] via-[#120d0a] to-[#090604] text-[#f3eee5]">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-[#b8895f]" />

          <p className="mt-6 text-[9px] uppercase tracking-[0.3em] text-[#b8895f]">
            Loading review
          </p>
        </div>
      </main>
    );
  }

  /*
   * =========================================================
   * ERROR WITHOUT ORDER
   * =========================================================
   */

  if (error && !order) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#17110d] via-[#120d0a] to-[#090604] px-5 text-[#f3eee5]">
        <div className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-[#1b130f] p-8 text-center">
          <p className="text-[9px] uppercase tracking-[0.3em] text-red-300">
            Review unavailable
          </p>

          <h1 className="mt-4 text-3xl font-semibold">
            We couldn't load this order.
          </h1>

          <p className="mt-4 text-sm leading-7 text-white/35">
            {error}
          </p>

          <Link
            to="/orders"
            className="mt-8 inline-flex rounded-full bg-[#b8895f] px-6 py-3.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#17110d]"
          >
            My Orders
          </Link>
        </div>
      </main>
    );
  }

  /*
   * =========================================================
   * ALREADY REVIEWED
   * =========================================================
   */

  if (existingReview) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#17110d] via-[#120d0a] to-[#090604] px-5 py-20 text-[#f3eee5] sm:px-6 sm:py-28">
        <div className="mx-auto flex min-h-[65vh] max-w-2xl items-center justify-center">
          <div className="w-full rounded-[2rem] border border-[#b8895f]/20 bg-[#1b130f] p-8 text-center shadow-[0_25px_70px_rgba(0,0,0,0.35)] sm:p-12">
            <div className="text-5xl text-[#b8895f]">
              ★
            </div>

            <p className="mt-6 text-[9px] uppercase tracking-[0.3em] text-[#b8895f]">
              Already reviewed
            </p>

            <h1 className="mt-3 text-3xl font-semibold">
              Thanks for sharing.
            </h1>

            <div className="mt-6 text-2xl tracking-[0.2em] text-[#b8895f]">
              {"★".repeat(
                existingReview.rating
              )}
              <span className="text-white/10">
                {"★".repeat(
                  5 -
                    existingReview.rating
                )}
              </span>
            </div>

            <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-white/40">
              "{existingReview.comment}"
            </p>

            <Link
              to="/orders"
              className="mt-8 inline-flex rounded-full bg-[#b8895f] px-7 py-3.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#17110d]"
            >
              Back to My Orders
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /*
   * =========================================================
   * ORDER NOT COMPLETED
   * =========================================================
   */

  if (
    order &&
    order.status !==
      "Completed"
  ) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#17110d] via-[#120d0a] to-[#090604] px-5 py-20 text-[#f3eee5] sm:px-6 sm:py-28">
        <div className="mx-auto flex min-h-[65vh] max-w-2xl items-center justify-center">
          <div className="w-full rounded-[2rem] border border-white/10 bg-[#1b130f] p-8 text-center sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#b8895f]/20 bg-[#b8895f]/[0.06] text-2xl text-[#b8895f]">
              ☕
            </div>

            <p className="mt-6 text-[9px] uppercase tracking-[0.3em] text-[#b8895f]">
              Order {order.status}
            </p>

            <h1 className="mt-3 text-3xl font-semibold">
              Not quite review time.
            </h1>

            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-white/35">
              You can leave a review once your order has been completed.
            </p>

            <Link
              to={`/order-success/${order._id}`}
              className="mt-8 inline-flex rounded-full border border-white/10 px-6 py-3.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/55 transition hover:border-[#b8895f] hover:text-[#b8895f]"
            >
              View Order
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /*
   * =========================================================
   * SUCCESS
   * =========================================================
   */

  if (success) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#17110d] via-[#120d0a] to-[#090604] px-5 py-20 text-[#f3eee5] sm:px-6 sm:py-28">
        <div className="mx-auto flex min-h-[65vh] max-w-2xl items-center justify-center">
          <div className="w-full rounded-[2rem] border border-[#b8895f]/20 bg-[#1b130f] p-8 text-center shadow-[0_25px_70px_rgba(0,0,0,0.35)] sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#b8895f] text-2xl text-[#17110d]">
              ✓
            </div>

            <p className="mt-6 text-[9px] uppercase tracking-[0.3em] text-[#b8895f]">
              Review received
            </p>

            <h1 className="mt-3 text-4xl font-semibold">
              Thank you.
            </h1>

            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-white/35">
              Your feedback helps us make Aroma better.
            </p>

            <Link
              to="/orders"
              className="mt-8 inline-flex rounded-full bg-[#b8895f] px-7 py-3.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#17110d]"
            >
              Back to My Orders
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /*
   * =========================================================
   * REVIEW FORM
   * =========================================================
   */

  return (
    <main className="min-h-screen overflow-hidden bg-gradient-to-b from-[#17110d] via-[#120d0a] to-[#090604] px-5 py-20 text-[#f3eee5] sm:px-6 sm:py-28">
      <div className="pointer-events-none fixed right-[-100px] top-20 h-80 w-80 rounded-full bg-[#b8895f]/10 blur-[120px]" />

      <div className="relative mx-auto max-w-3xl">
        <Link
          to={`/order-success/${order._id}`}
          className="text-[9px] uppercase tracking-[0.3em] text-white/35 transition hover:text-[#b8895f]"
        >
          ← Back to Order
        </Link>

        <div className="mt-10">
          <p className="text-[9px] uppercase tracking-[0.35em] text-[#b8895f]">
            Share your experience
          </p>

          <h1 className="mt-3 text-5xl font-semibold leading-[0.9] tracking-[-0.05em] sm:text-6xl">
            How was your
            <br />
            <span className="text-[#b8895f]">
              Aroma experience?
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-white/35">
            Your order is complete. Tell us what you thought.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-10 rounded-[2rem] border border-white/10 bg-[#1b130f] p-6 shadow-[0_25px_70px_rgba(0,0,0,0.3)] sm:p-8"
        >
          {/* Rating */}

          <div>
            <p className="text-[9px] uppercase tracking-[0.3em] text-white/30">
              Rating
            </p>

            <div className="mt-5 flex gap-2 sm:gap-3">
              {[1, 2, 3, 4, 5].map(
                (value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      setRating(value)
                    }
                    aria-label={`${value} star rating`}
                    className={`text-4xl transition-all duration-200 sm:text-5xl ${
                      value <= rating
                        ? "scale-105 text-[#b8895f]"
                        : "text-white/10 hover:text-white/25"
                    }`}
                  >
                    ★
                  </button>
                )
              )}
            </div>

            <p className="mt-3 text-xs text-white/25">
              {rating === 5
                ? "Excellent"
                : rating === 4
                  ? "Great"
                  : rating === 3
                    ? "Good"
                    : rating === 2
                      ? "Could be better"
                      : "Not good"}
            </p>
          </div>

          {/* Email */}

          <div className="mt-8">
            <label
              htmlFor="review-email"
              className="mb-2 block text-[9px] uppercase tracking-[0.25em] text-white/30"
            >
              Order email
            </label>

            <input
              id="review-email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
              required
              placeholder="Email used for your order"
              className="w-full rounded-2xl border border-white/10 bg-[#100c09] px-4 py-4 text-sm text-[#f3eee5] outline-none placeholder:text-white/20 focus:border-[#b8895f]/60"
            />
          </div>

          {/* Comment */}

          <div className="mt-6">
            <label
              htmlFor="review-comment"
              className="mb-2 block text-[9px] uppercase tracking-[0.25em] text-white/30"
            >
              Your review
            </label>

            <textarea
              id="review-comment"
              value={comment}
              onChange={(event) =>
                setComment(
                  event.target.value
                )
              }
              required
              maxLength={1000}
              rows={6}
              placeholder="Tell us what you loved, what stood out, or what we could do better..."
              className="w-full resize-none rounded-2xl border border-white/10 bg-[#100c09] px-4 py-4 text-sm leading-7 text-[#f3eee5] outline-none placeholder:text-white/20 focus:border-[#b8895f]/60"
            />

            <p className="mt-2 text-right text-[8px] text-white/20">
              {comment.length}/1000
            </p>
          </div>

          {error && (
            <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-950/30 px-4 py-4">
              <p className="text-sm leading-6 text-red-300">
                {error}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-8 flex h-14 w-full items-center justify-center rounded-full bg-[#b8895f] px-6 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#17110d] transition hover:bg-[#f3eee5] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting
              ? "Submitting..."
              : "Submit Review →"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default Review;