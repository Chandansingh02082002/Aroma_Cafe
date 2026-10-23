import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";

import { gsap } from "../../animations/gsapConfig";
import { loginOwner } from "../../services/api";
import { saveAuth } from "../../services/auth";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  /*
   * =========================================================
   * GSAP
   * =========================================================
   */

  useGSAP(() => {
    gsap
      .timeline()
      .from(".login-panel", {
        x: 60,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      })
      .from(
        ".login-content > *",
        {
          y: 25,
          opacity: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "power3.out",
        },
        "-=0.4"
      );
  });

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

    if (error) {
      setError("");
    }
  };

  /*
   * =========================================================
   * LOGIN
   * =========================================================
   */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result = await loginOwner({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      if (!result?.success || !result?.token) {
        throw new Error("The server did not return a valid login session.");
      }

      saveAuth(result.token, result.data);
      navigate("/owner/dashboard", { replace: true });
    } catch (err) {
      console.error(
        "Login failed:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to login. Please check that the server is running and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#241712] text-[#f5efe6]">
      <div className="grid min-h-screen lg:grid-cols-[0.9fr_1.1fr]">
        {/* =====================================================
            BRAND PANEL
        ====================================================== */}

        <section className="relative hidden min-h-screen overflow-hidden bg-[#8c6849] p-8 sm:p-10 lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
          {/* Decorative glow */}

          <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#c89b6d]/20 blur-[100px]" />

          <div className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-[#241712]/15 blur-[120px]" />

          {/* Brand */}

          <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-[#f5efe6]">
              AROMA
            </p>

            <p className="mt-2 text-[8px] uppercase tracking-[0.3em] text-white/45">
              Coffee House
            </p>
          </div>

          {/* Main copy */}

          <div className="relative">
            <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-white/60">
              Owner Portal
            </p>

            <h1 className="mt-5 max-w-xl text-5xl font-semibold leading-[0.9] tracking-[-0.05em] xl:text-7xl">
              Run your cafe
              <br />

              <span className="text-[#241712]">
                your way.
              </span>
            </h1>

            <p className="mt-7 max-w-md text-sm leading-7 text-white/65">
              Manage your menu, track orders
              and keep your cafe experience
              running smoothly.
            </p>
          </div>

          {/* Bottom statement */}

          <div className="relative flex items-center gap-3">
            <span className="h-px w-8 bg-[#c89b6d]" />

            <p className="text-[8px] uppercase tracking-[0.3em] text-white/45">
              Good coffee. Good people.
            </p>
          </div>
        </section>

        {/* =====================================================
            LOGIN PANEL
        ====================================================== */}

        <section className="login-panel relative flex min-h-screen items-center justify-center bg-[#17110d] px-5 py-10 sm:px-8 sm:py-12 lg:px-10 xl:px-16">
          {/* Decorative background */}

          <div className="pointer-events-none absolute -right-20 top-10 h-64 w-64 rounded-full bg-[#8c6849]/10 blur-[100px]" />

          <div className="pointer-events-none absolute -bottom-32 left-0 h-80 w-80 rounded-full bg-[#b8895f]/5 blur-[120px]" />

          <div className="login-content relative w-full max-w-md">
            {/* Mobile brand */}

            <div className="mb-12 lg:hidden">
              <p className="text-lg font-bold tracking-[0.3em] text-[#f5efe6]">
                AROMA
              </p>

              <div className="mt-3 flex items-center gap-3">
                <span className="h-px w-6 bg-[#b8895f]" />

                <p className="text-[8px] uppercase tracking-[0.3em] text-[#b8895f]">
                  Owner Portal
                </p>
              </div>
            </div>

            {/* Heading */}

            <div>
              <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-[#c89b6d] sm:text-[10px]">
                Owner Login
              </p>

              <h2 className="mt-4 text-4xl font-semibold leading-[0.95] tracking-[-0.04em] text-[#f5efe6] sm:text-5xl">
                Welcome back.
              </h2>

              <p className="mt-4 text-sm leading-6 text-white/55">
                Sign in to manage your cafe.
              </p>
            </div>

            {/* =================================================
                FORM
            ================================================== */}

            <form
              onSubmit={handleSubmit}
              className="mt-9 space-y-5 sm:mt-10 sm:space-y-6"
            >
              {/* Email */}

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-medium text-white/75"
                >
                  Email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="owner@aroma.com"
                  autoComplete="email"
                  required
                  className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#c89b6d] focus:bg-white/[0.06] focus:ring-2 focus:ring-[#c89b6d]/10"
                />
              </div>

              {/* Password */}

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-xs font-medium text-white/75"
                >
                  Password
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#c89b6d] focus:bg-white/[0.06] focus:ring-2 focus:ring-[#c89b6d]/10"
                />
              </div>

              {/* Error */}

              {error && (
                <div className="rounded-2xl border border-[#a85d4a]/30 bg-[#a85d4a]/10 px-4 py-3.5 text-sm leading-6 text-[#d99583]">
                  {error}
                </div>
              )}

              {/* Submit */}

              <button
                type="submit"
                disabled={loading}
                className="h-14 w-full rounded-2xl bg-[#c89b6d] px-6 text-sm font-semibold uppercase tracking-[0.2em] text-[#241712] shadow-[0_12px_30px_rgba(200,155,109,0.10)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#d8af83] hover:shadow-[0_18px_35px_rgba(200,155,109,0.15)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Signing in..."
                  : "Sign In"}
              </button>
            </form>

            {/* Mobile footer */}

            <div className="mt-10 flex items-center gap-3 lg:hidden">
              <span className="h-px w-6 bg-white/10" />

              <p className="text-[8px] uppercase tracking-[0.25em] text-white/25">
                Aroma Owner Portal
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Login;