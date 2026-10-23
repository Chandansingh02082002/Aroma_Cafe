import { useEffect, useState } from "react";
import axios from "axios";

import { getToken } from "../../services/auth";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

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

function getAuthConfig() {
  const token = getToken();

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

function Review() {
  const [reviews, setReviews] =
    useState([]);

  const [averageRating, setAverageRating] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [replyingId, setReplyingId] =
    useState(null);

  const [replyText, setReplyText] =
    useState("");

  const [savingId, setSavingId] =
    useState(null);

  /*
   * =========================================================
   * FETCH REVIEWS
   * =========================================================
   */

  const fetchReviews = async () => {
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

      const response =
        await axios.get(
          `${API_URL}/api/reviews`,
          getAuthConfig()
        );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Unable to load reviews."
        );
      }

      setReviews(
        response.data?.data || []
      );

      setAverageRating(
        Number(
          response.data?.averageRating || 0
        )
      );
    } catch (err) {
      console.error(
        "Failed to fetch reviews:",
        err
      );

      if (
        err.response?.status ===
        401
      ) {
        setError(
          "Your owner session has expired. Please log in again."
        );
      } else {
        setError(
          err.response?.data
            ?.message ||
            "Unable to load reviews."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  /*
   * =========================================================
   * REPLY
   * =========================================================
   */

  const startReply = (review) => {
    setReplyingId(review._id);

    setReplyText(
      review.ownerReply || ""
    );

    setError("");
  };

  const cancelReply = () => {
    setReplyingId(null);
    setReplyText("");
  };

  const saveReply = async (
    reviewId
  ) => {
    if (!replyText.trim()) {
      setError(
        "Reply cannot be empty."
      );

      return;
    }

    try {
      setSavingId(reviewId);
      setError("");

      const token = getToken();

      if (!token) {
        setError(
          "Your owner session has expired. Please log in again."
        );

        return;
      }

      const response =
        await axios.patch(
          `${API_URL}/api/reviews/${reviewId}/reply`,
          {
            ownerReply:
              replyText.trim(),
          },
          getAuthConfig()
        );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Unable to save reply."
        );
      }

      setReviews(
        (previous) =>
          previous.map(
            (review) =>
              review._id ===
              reviewId
                ? response.data.data
                : review
          )
      );

      setReplyingId(null);
      setReplyText("");
    } catch (err) {
      console.error(
        "Failed to save reply:",
        err
      );

      if (
        err.response?.status ===
        401
      ) {
        setError(
          "Your owner session has expired. Please log in again."
        );
      } else {
        setError(
          err.response?.data
            ?.message ||
            "Unable to save reply."
        );
      }
    } finally {
      setSavingId(null);
    }
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

          <p className="mt-5 text-[9px] font-medium uppercase tracking-[0.3em] text-[#241712]/55">
            Loading reviews
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full min-w-0 pb-8 sm:pb-10">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col gap-6 border-b border-[#241712]/20 pb-6 sm:pb-8 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-[#8c6849] sm:text-sm">
            Customer Feedback
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#241712] sm:text-4xl md:text-5xl">
            Reviews
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-[#241712]/70">
            See what customers think about
            their Aroma experience and
            respond directly.
          </p>
        </div>

        {/* Rating */}

        <div className="w-full rounded-[1.5rem] border border-[#241712]/25 bg-[#f5efe6] px-5 py-5 shadow-[0_18px_45px_rgba(36,23,18,0.10)] sm:px-6 sm:py-5 md:w-auto md:min-w-[230px]">
          <p className="text-[8px] font-medium uppercase tracking-[0.25em] text-[#8c6849]">
            Overall Rating
          </p>

          <div className="mt-2 flex items-center gap-3">
            <span className="text-3xl font-semibold tracking-[-0.04em] text-[#241712] sm:text-4xl">
              {averageRating.toFixed(
                1
              )}
            </span>

            <span className="text-2xl text-[#b8895f]">
              ★
            </span>

            <span className="text-xs text-[#241712]/55">
              {reviews.length}{" "}
              {reviews.length === 1
                ? "review"
                : "reviews"}
            </span>
          </div>
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
          EMPTY
      ====================================================== */}

      {reviews.length === 0 && (
        <div className="mt-6 rounded-[1.75rem] border border-[#241712]/25 bg-[#f5efe6] px-5 py-16 text-center shadow-[0_20px_50px_rgba(36,23,18,0.10)] sm:mt-8 sm:px-6 sm:py-24">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#e7ddce] text-2xl text-[#b8895f]">
            ★
          </div>

          <h2 className="mt-5 text-2xl font-semibold text-[#241712]">
            No reviews yet.
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#241712]/65">
            Customer reviews will appear
            here after completed orders are
            reviewed.
          </p>
        </div>
      )}

      {/* =====================================================
          REVIEWS
      ====================================================== */}

      {reviews.length > 0 && (
        <div className="mt-6 space-y-4 sm:mt-8 sm:space-y-5">
          {reviews.map((review) => (
            <article
              key={review._id}
              className="min-w-0 overflow-hidden rounded-[1.75rem] border border-[#241712]/25 bg-[#f5efe6] shadow-[0_20px_50px_rgba(36,23,18,0.10)] transition duration-300 hover:shadow-[0_24px_60px_rgba(36,23,18,0.14)] sm:rounded-[2rem]"
            >
              {/* Review header */}

              <div className="flex flex-col gap-5 border-b border-[#241712]/20 p-5 sm:p-7 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map(
                      (star) => (
                        <span
                          key={star}
                          className={
                            star <=
                            review.rating
                              ? "text-lg text-[#b8895f] sm:text-xl"
                              : "text-lg text-[#241712]/15 sm:text-xl"
                          }
                        >
                          ★
                        </span>
                      )
                    )}
                  </div>

                  <h2 className="mt-3 text-lg font-semibold text-[#241712] sm:text-xl">
                    {review.customer
                      ?.name ||
                      "Customer"}
                  </h2>

                  <p className="mt-1 break-all text-xs text-[#241712]/60">
                    {review.customer
                      ?.email ||
                      "No email"}
                  </p>
                </div>

                <div className="shrink-0 md:text-right">
                  <p className="text-[8px] font-medium uppercase tracking-[0.25em] text-[#241712]/45">
                    Reviewed
                  </p>

                  <p className="mt-1 text-sm font-medium text-[#241712]/70">
                    {formatDate(
                      review.createdAt
                    )}
                  </p>

                  {review.order && (
                    <p className="mt-1 max-w-full break-all text-[9px] text-[#241712]/45 md:max-w-[220px]">
                      Order #
                      {typeof review.order ===
                      "object"
                        ? review.order._id
                        : review.order}
                    </p>
                  )}
                </div>
              </div>

              {/* Review body */}

              <div className="p-5 sm:p-7">
                <div className="rounded-2xl border border-[#241712]/10 bg-[#e7ddce] p-4 sm:p-5">
                  <p className="break-words text-sm leading-7 text-[#241712]/80">
                    "{review.comment}"
                  </p>
                </div>

                {/* Existing owner reply */}

                {review.ownerReply &&
                  replyingId !==
                    review._id && (
                    <div className="mt-5 rounded-2xl border border-[#b8895f]/25 bg-[#b8895f]/10 p-4 sm:p-5">
                      <div className="flex items-center gap-2">
                        <span className="h-px w-5 bg-[#b8895f]" />

                        <p className="text-[8px] font-semibold uppercase tracking-[0.25em] text-[#744f35]">
                          Aroma Reply
                        </p>
                      </div>

                      <p className="mt-3 break-words text-sm leading-6 text-[#241712]/75">
                        {review.ownerReply}
                      </p>

                      {review.repliedAt && (
                        <p className="mt-3 text-[8px] text-[#241712]/45">
                          Replied{" "}
                          {formatDate(
                            review.repliedAt
                          )}
                        </p>
                      )}
                    </div>
                  )}

                {/* Reply editor */}

                {replyingId ===
                review._id ? (
                  <div className="mt-5 sm:mt-6">
                    <label
                      htmlFor={`reply-${review._id}`}
                      className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.25em] text-[#241712]/60"
                    >
                      Your Reply
                    </label>

                    <textarea
                      id={`reply-${review._id}`}
                      rows={4}
                      maxLength={1000}
                      value={replyText}
                      onChange={(event) =>
                        setReplyText(
                          event.target
                            .value
                        )
                      }
                      placeholder="Thank the customer or respond to their feedback..."
                      className="w-full resize-none rounded-2xl border border-[#241712]/20 bg-[#f3ede3] px-4 py-4 text-sm leading-6 text-[#241712] outline-none transition placeholder:text-[#241712]/40 focus:border-[#b8895f] focus:ring-2 focus:ring-[#b8895f]/10"
                    />

                    <div className="mt-3 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                      <button
                        type="button"
                        onClick={
                          cancelReply
                        }
                        disabled={
                          savingId ===
                          review._id
                        }
                        className="w-full rounded-full border border-[#241712]/25 px-5 py-3 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#241712] transition hover:border-[#8c6849] hover:text-[#6f503b] sm:w-auto"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          saveReply(
                            review._id
                          )
                        }
                        disabled={
                          savingId ===
                            review._id ||
                          !replyText.trim()
                        }
                        className="w-full rounded-full bg-[#241712] px-6 py-3 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#f5efe6] transition hover:bg-[#8c6849] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                      >
                        {savingId ===
                        review._id
                          ? "Saving..."
                          : "Save Reply"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      startReply(
                        review
                      )
                    }
                    className="mt-5 w-full rounded-full border border-[#241712]/20 bg-[#f3ede3] px-5 py-3 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#6f503b] transition hover:border-[#8c6849] hover:bg-[#e7ddce] sm:mt-6 sm:w-auto"
                  >
                    {review.ownerReply
                      ? "Edit Reply"
                      : "Reply to Customer"}
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Review;