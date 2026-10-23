import { useEffect, useState } from "react";

const SETTINGS_KEY =
  "aroma_owner_settings";

const defaultSettings = {
  cafeName: "Aroma",
  address:
    "123 Coffee Street, Jaipur",
  phone: "+91 98765 43210",
  email: "hello@aroma.cafe",

  openingTime: "08:00",
  closingTime: "22:00",

  acceptOrders: true,
  acceptRazorpay: true,
  autoConfirmOrders: false,
};

function Settings() {
  const [settings, setSettings] =
    useState(defaultSettings);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [success, setSuccess] =
    useState("");

  const [error, setError] =
    useState("");

  /*
   * =========================================================
   * LOAD SETTINGS
   * =========================================================
   */

  useEffect(() => {
    try {
      const saved =
        localStorage.getItem(
          SETTINGS_KEY
        );

      if (saved) {
        const parsed =
          JSON.parse(saved);

        setSettings({
          ...defaultSettings,
          ...parsed,
        });
      }
    } catch (err) {
      console.error(
        "Failed to load owner settings:",
        err
      );

      setError(
        "Unable to load saved settings."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  /*
   * =========================================================
   * CHANGE
   * =========================================================
   */

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setSettings(
      (previous) => ({
        ...previous,
        [name]:
          type ===
          "checkbox"
            ? checked
            : value,
      })
    );

    setSuccess("");
    setError("");
  };

  /*
   * =========================================================
   * SAVE
   * =========================================================
   */

  const handleSave = async (
    event
  ) => {
    event.preventDefault();

    try {
      setSaving(true);
      setSuccess("");
      setError("");

      localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify(
          settings
        )
      );

      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            350
          )
      );

      setSuccess(
        "Settings saved successfully."
      );
    } catch (err) {
      console.error(
        "Failed to save settings:",
        err
      );

      setError(
        "Unable to save settings."
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * =========================================================
   * RESET
   * =========================================================
   */

  const handleReset = () => {
    const confirmed =
      window.confirm(
        "Reset all settings to the default values?"
      );

    if (!confirmed) {
      return;
    }

    setSettings(
      defaultSettings
    );

    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify(
        defaultSettings
      )
    );

    setSuccess(
      "Settings reset successfully."
    );

    setError("");
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
            Loading settings
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

      <div className="flex flex-col gap-5 border-b border-[#241712]/20 pb-6 sm:pb-8 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-[#8c6849] sm:text-sm">
            Owner Configuration
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#241712] sm:text-4xl md:text-5xl">
            Settings
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-6 text-[#241712]/70">
            Manage your cafe information,
            opening hours and ordering
            preferences.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="w-full rounded-full border border-[#241712]/25 bg-[#f5efe6] px-5 py-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#6f503b] transition hover:border-[#a85d4a]/50 hover:bg-[#a85d4a]/10 hover:text-[#944b3b] sm:w-fit"
        >
          Reset
        </button>
      </div>

      {/* =====================================================
          MESSAGES
      ====================================================== */}

      {success && (
        <div className="mt-5 rounded-2xl border border-[#788b62]/30 bg-[#788b62]/10 px-4 py-4 text-sm font-medium text-[#5f7448] sm:mt-6 sm:px-5">
          {success}
        </div>
      )}

      {error && (
        <div className="mt-5 rounded-2xl border border-[#a85d4a]/30 bg-[#a85d4a]/10 px-4 py-4 text-sm font-medium text-[#944b3b] sm:mt-6 sm:px-5">
          {error}
        </div>
      )}

      {/* =====================================================
          FORM
      ====================================================== */}

      <form
        onSubmit={handleSave}
        className="mt-6 space-y-5 sm:mt-8 sm:space-y-6"
      >
        {/* ===================================================
            BUSINESS INFORMATION
        ==================================================== */}

        <div className="min-w-0 rounded-[1.75rem] border border-[#241712]/25 bg-[#f5efe6] p-5 shadow-[0_20px_50px_rgba(36,23,18,0.10)] sm:rounded-[2rem] sm:p-8">
          <div className="border-b border-[#241712]/20 pb-5">
            <p className="text-[8px] font-medium uppercase tracking-[0.3em] text-[#8c6849] sm:text-[9px]">
              Business
            </p>

            <h3 className="mt-2 text-xl font-semibold text-[#241712] sm:text-2xl">
              Cafe Information
            </h3>
          </div>

          <div className="mt-5 grid gap-4 sm:mt-6 md:grid-cols-2 sm:gap-5">
            <div className="min-w-0">
              <label
                htmlFor="cafeName"
                className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.2em] text-[#241712]/65"
              >
                Cafe Name
              </label>

              <input
                id="cafeName"
                name="cafeName"
                value={
                  settings.cafeName
                }
                onChange={
                  handleChange
                }
                className="h-14 w-full min-w-0 rounded-2xl border border-[#241712]/20 bg-[#f3ede3] px-4 text-sm font-medium text-[#241712] outline-none transition focus:border-[#b8895f] focus:ring-2 focus:ring-[#b8895f]/10"
              />
            </div>

            <div className="min-w-0">
              <label
                htmlFor="phone"
                className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.2em] text-[#241712]/65"
              >
                Phone
              </label>

              <input
                id="phone"
                name="phone"
                value={
                  settings.phone
                }
                onChange={
                  handleChange
                }
                className="h-14 w-full min-w-0 rounded-2xl border border-[#241712]/20 bg-[#f3ede3] px-4 text-sm font-medium text-[#241712] outline-none transition focus:border-[#b8895f] focus:ring-2 focus:ring-[#b8895f]/10"
              />
            </div>

            <div className="min-w-0">
              <label
                htmlFor="email"
                className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.2em] text-[#241712]/65"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={
                  settings.email
                }
                onChange={
                  handleChange
                }
                className="h-14 w-full min-w-0 rounded-2xl border border-[#241712]/20 bg-[#f3ede3] px-4 text-sm font-medium text-[#241712] outline-none transition focus:border-[#b8895f] focus:ring-2 focus:ring-[#b8895f]/10"
              />
            </div>

            <div className="min-w-0 md:col-span-2">
              <label
                htmlFor="address"
                className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.2em] text-[#241712]/65"
              >
                Address
              </label>

              <textarea
                id="address"
                name="address"
                rows={3}
                value={
                  settings.address
                }
                onChange={
                  handleChange
                }
                className="w-full resize-none rounded-2xl border border-[#241712]/20 bg-[#f3ede3] px-4 py-3.5 text-sm font-medium leading-6 text-[#241712] outline-none transition focus:border-[#b8895f] focus:ring-2 focus:ring-[#b8895f]/10"
              />
            </div>
          </div>
        </div>

        {/* ===================================================
            OPENING HOURS
        ==================================================== */}

        <div className="min-w-0 rounded-[1.75rem] border border-[#241712]/25 bg-[#f5efe6] p-5 shadow-[0_20px_50px_rgba(36,23,18,0.10)] sm:rounded-[2rem] sm:p-8">
          <div className="border-b border-[#241712]/20 pb-5">
            <p className="text-[8px] font-medium uppercase tracking-[0.3em] text-[#8c6849] sm:text-[9px]">
              Schedule
            </p>

            <h3 className="mt-2 text-xl font-semibold text-[#241712] sm:text-2xl">
              Opening Hours
            </h3>
          </div>

          <div className="mt-5 grid gap-4 sm:mt-6 sm:grid-cols-2 sm:gap-5">
            <div>
              <label
                htmlFor="openingTime"
                className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.2em] text-[#241712]/65"
              >
                Opening Time
              </label>

              <input
                id="openingTime"
                name="openingTime"
                type="time"
                value={
                  settings.openingTime
                }
                onChange={
                  handleChange
                }
                className="h-14 w-full rounded-2xl border border-[#241712]/20 bg-[#f3ede3] px-4 text-sm font-medium text-[#241712] outline-none transition focus:border-[#b8895f] focus:ring-2 focus:ring-[#b8895f]/10"
              />
            </div>

            <div>
              <label
                htmlFor="closingTime"
                className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.2em] text-[#241712]/65"
              >
                Closing Time
              </label>

              <input
                id="closingTime"
                name="closingTime"
                type="time"
                value={
                  settings.closingTime
                }
                onChange={
                  handleChange
                }
                className="h-14 w-full rounded-2xl border border-[#241712]/20 bg-[#f3ede3] px-4 text-sm font-medium text-[#241712] outline-none transition focus:border-[#b8895f] focus:ring-2 focus:ring-[#b8895f]/10"
              />
            </div>
          </div>
        </div>

        {/* ===================================================
            ORDER SETTINGS
        ==================================================== */}

        <div className="min-w-0 rounded-[1.75rem] border border-[#241712]/25 bg-[#f5efe6] p-5 shadow-[0_20px_50px_rgba(36,23,18,0.10)] sm:rounded-[2rem] sm:p-8">
          <div className="border-b border-[#241712]/20 pb-5">
            <p className="text-[8px] font-medium uppercase tracking-[0.3em] text-[#8c6849] sm:text-[9px]">
              Ordering
            </p>

            <h3 className="mt-2 text-xl font-semibold text-[#241712] sm:text-2xl">
              Order Settings
            </h3>
          </div>

          <div className="mt-5 space-y-3 sm:mt-6">
            {/* Accept Orders */}

            <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-[#241712]/20 bg-[#f3ede3] p-4 transition hover:border-[#b8895f]/50 hover:bg-[#e7ddce] sm:gap-6 sm:p-5">
              <div className="min-w-0 pr-2">
                <p className="text-sm font-semibold text-[#241712]">
                  Accept Orders
                </p>

                <p className="mt-1 text-xs leading-5 text-[#241712]/65">
                  Allow customers to place
                  new online orders.
                </p>
              </div>

              <input
                type="checkbox"
                name="acceptOrders"
                checked={
                  settings.acceptOrders
                }
                onChange={
                  handleChange
                }
                className="h-5 w-5 shrink-0 accent-[#b8895f]"
              />
            </label>

            {/* Razorpay */}

            <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-[#241712]/20 bg-[#f3ede3] p-4 transition hover:border-[#b8895f]/50 hover:bg-[#e7ddce] sm:gap-6 sm:p-5">
              <div className="min-w-0 pr-2">
                <p className="text-sm font-semibold text-[#241712]">
                  Razorpay Payments
                </p>

                <p className="mt-1 text-xs leading-5 text-[#241712]/65">
                  Allow customers to pay
                  through Razorpay.
                </p>
              </div>

              <input
                type="checkbox"
                name="acceptRazorpay"
                checked={
                  settings.acceptRazorpay
                }
                onChange={
                  handleChange
                }
                className="h-5 w-5 shrink-0 accent-[#b8895f]"
              />
            </label>

            {/* Auto confirm */}

            <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-[#241712]/20 bg-[#f3ede3] p-4 transition hover:border-[#b8895f]/50 hover:bg-[#e7ddce] sm:gap-6 sm:p-5">
              <div className="min-w-0 pr-2">
                <p className="text-sm font-semibold text-[#241712]">
                  Auto-confirm Orders
                </p>

                <p className="mt-1 text-xs leading-5 text-[#241712]/65">
                  Automatically move paid
                  orders from Pending to
                  Confirmed.
                </p>
              </div>

              <input
                type="checkbox"
                name="autoConfirmOrders"
                checked={
                  settings.autoConfirmOrders
                }
                onChange={
                  handleChange
                }
                className="h-5 w-5 shrink-0 accent-[#b8895f]"
              />
            </label>
          </div>
        </div>

        {/* ===================================================
            SAVE
        ==================================================== */}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleReset}
            className="w-full rounded-full border border-[#241712]/25 bg-[#f5efe6] px-6 py-3.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#6f503b] transition hover:border-[#a85d4a]/50 hover:bg-[#a85d4a]/10 hover:text-[#944b3b] sm:w-auto"
          >
            Reset
          </button>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-full bg-[#241712] px-7 py-3.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#f5efe6] shadow-[0_10px_25px_rgba(36,23,18,0.12)] transition hover:bg-[#8c6849] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {saving
              ? "Saving..."
              : "Save Settings"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default Settings;