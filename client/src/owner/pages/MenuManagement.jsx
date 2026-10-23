import { useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";

import { gsap } from "../../animations/gsapConfig";
import {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  uploadImage,
} from "../../services/api";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "Coffee",
  image: "",
  available: true,
  featured: false,
};

function MenuManagement() {
  const [items, setItems] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [editingItem, setEditingItem] =
    useState(null);

  const [form, setForm] =
    useState(emptyForm);

  const [selectedImage, setSelectedImage] =
    useState(null);

  const [imagePreview, setImagePreview] =
    useState("");

  /*
   * =========================================================
   * FETCH MENU
   * =========================================================
   */

  const fetchMenu = async () => {
    try {
      setLoading(true);
      setError("");

      const result =
        await getMenuItems();

      setItems(
        result.data || []
      );
    } catch (err) {
      console.error(
        "Failed to fetch menu:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load menu items."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * =========================================================
   * IMAGE
   * =========================================================
   */

  const handleImageChange = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    setSelectedImage(file);
    setImagePreview(
      URL.createObjectURL(file)
    );
  };

  /*
   * =========================================================
   * INITIAL LOAD
   * =========================================================
   */

  useEffect(() => {
    fetchMenu();
  }, []);

  /*
   * =========================================================
   * GSAP
   * =========================================================
   */

  useGSAP(
    () => {
      if (loading) return;

      gsap.fromTo(
        ".owner-menu-row",
        {
          y: 15,
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
      dependencies: [
        loading,
        items.length,
      ],
    }
  );

  /*
   * =========================================================
   * FORM
   * =========================================================
   */

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  /*
   * =========================================================
   * ADD
   * =========================================================
   */

  const openAddModal = () => {
    setEditingItem(null);
    setForm(emptyForm);

    setSelectedImage(null);
    setImagePreview("");

    setError("");
    setSuccess("");

    setShowModal(true);
  };

  /*
   * =========================================================
   * EDIT
   * =========================================================
   */

  const openEditModal = (
    item
  ) => {
    setEditingItem(item);

    setForm({
      name: item.name,
      description:
        item.description,
      price: item.price,
      category: item.category,
      image: item.image,
      available: item.available !== false,
      featured: item.featured === true,
    });

    setSelectedImage(null);
    setImagePreview(
      item.image || ""
    );

    setError("");
    setSuccess("");

    setShowModal(true);
  };

  /*
   * =========================================================
   * CLOSE MODAL
   * =========================================================
   */

  const closeModal = () => {
    if (submitting) return;

    setShowModal(false);
    setEditingItem(null);
    setForm(emptyForm);

    setSelectedImage(null);
    setImagePreview("");
  };

  /*
   * =========================================================
   * SAVE ITEM
   * =========================================================
   */

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      let imageUrl =
        editingItem?.image || "";

      let imagePublicId =
        editingItem?.imagePublicId ||
        "";

      if (selectedImage) {
        const uploadResult =
          await uploadImage(
            selectedImage
          );

        imageUrl =
          uploadResult.data.url;

        imagePublicId =
          uploadResult.data
            .publicId;
      }

      if (!imageUrl) {
        setError(
          "Please select an image."
        );

        return;
      }

      const payload = {
        name: form.name,
        description:
          form.description,
        price: Number(
          form.price
        ),
        category:
          form.category,
        image: imageUrl,
        imagePublicId,
        available:
          form.available,
        featured:
          form.featured,
      };

      if (editingItem) {
        const result =
          await updateMenuItem(
            editingItem._id,
            payload
          );

        setItems(
          (previous) =>
            previous.map(
              (item) =>
                item._id ===
                editingItem._id
                  ? result.data
                  : item
            )
        );

        setSuccess(
          "Menu item updated successfully."
        );
      } else {
        const result =
          await createMenuItem(
            payload
          );

        setItems(
          (previous) => [
            result.data,
            ...previous,
          ]
        );

        setSuccess(
          "Menu item added successfully."
        );
      }

      // Close/reset directly: closeModal intentionally ignores manual closes
      // while submitting, but this path runs after a successful save.
      setShowModal(false);
      setEditingItem(null);
      setForm(emptyForm);
      setSelectedImage(null);
      setImagePreview("");
    } catch (err) {
      console.error(
        "Menu save error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to save menu item."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /*
   * =========================================================
   * DELETE
   * =========================================================
   */

  const handleDelete = async (
    id
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this menu item?"
      );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await deleteMenuItem(id);

      setItems(
        (previous) =>
          previous.filter(
            (item) =>
              item._id !== id
          )
      );

      setSuccess(
        "Menu item deleted successfully."
      );
    } catch (err) {
      console.error(
        "Delete menu error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to delete menu item."
      );
    }
  };

  /*
   * =========================================================
   * TOGGLE
   * =========================================================
   */

  const toggleItem = async (
    item,
    field
  ) => {
    try {
      setError("");
      setSuccess("");

      const updatedValue =
        !item[field];

      const result =
        await updateMenuItem(
          item._id,
          {
            [field]:
              updatedValue,
          }
        );

      setItems(
        (previous) =>
          previous.map(
            (currentItem) =>
              currentItem._id ===
              item._id
                ? result.data
                : currentItem
          )
      );
    } catch (err) {
      console.error(
        "Toggle menu item error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to update menu item."
      );
    }
  };

  /*
   * =========================================================
   * STATUS PILL
   * =========================================================
   */

  const availabilityClasses = (
    available
  ) => {
    return available
      ? "bg-[#788b62]/15 text-[#5f7448]"
      : "bg-[#a85d4a]/15 text-[#944b3b]";
  };

  /*
   * =========================================================
   * UI
   * =========================================================
   */

  return (
    <section className="w-full min-w-0 pb-8 sm:pb-10">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col gap-5 border-b border-[#241712]/20 pb-6 sm:flex-row sm:items-end sm:justify-between sm:pb-8">
        <div className="min-w-0">
          <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-[#8c6849] sm:text-sm">
            Menu Management
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#241712] sm:text-4xl md:text-5xl">
            Your Menu
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-6 text-[#241712]/70">
            Add, edit and manage
            everything customers can
            see.
          </p>
        </div>

        <button
          type="button"
          onClick={
            openAddModal
          }
          className="w-full rounded-full bg-[#241712] px-6 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-[#f5efe6] transition hover:bg-[#8c6849] sm:w-fit"
        >
          + Add Item
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
          LOADING
      ====================================================== */}

      {loading && (
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-[#241712]/10 border-t-[#8c6849]" />

            <p className="mt-5 text-[9px] font-medium uppercase tracking-[0.3em] text-[#241712]/55">
              Loading menu
            </p>
          </div>
        </div>
      )}

      {/* =====================================================
          EMPTY
      ====================================================== */}

      {!loading &&
        items.length === 0 && (
          <div className="mt-6 rounded-[1.75rem] border border-[#241712]/25 bg-[#f5efe6] px-6 py-16 text-center shadow-[0_20px_50px_rgba(36,23,18,0.10)] sm:mt-8 sm:py-20">
            <p className="text-xl font-semibold text-[#241712] sm:text-2xl">
              No menu items yet.
            </p>

            <p className="mx-auto mt-2 max-w-md text-sm text-[#241712]/65">
              Add your first menu
              item to get started.
            </p>

            <button
              type="button"
              onClick={
                openAddModal
              }
              className="mt-6 rounded-full bg-[#241712] px-6 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-[#f5efe6]"
            >
              Add Item
            </button>
          </div>
        )}

      {/* =====================================================
          DESKTOP / TABLET TABLE
      ====================================================== */}

      {!loading &&
        items.length > 0 && (
          <div className="mt-6 hidden overflow-hidden rounded-[2rem] border border-[#241712]/30 bg-[#f5efe6] shadow-[0_20px_50px_rgba(36,23,18,0.14)] md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px]">
                <thead>
                  <tr className="border-b border-[#241712]/25 text-left">
                    <th className="px-5 py-5 text-xs font-semibold uppercase tracking-[0.15em] text-[#241712]/65 lg:px-6">
                      Item
                    </th>

                    <th className="px-5 py-5 text-xs font-semibold uppercase tracking-[0.15em] text-[#241712]/65">
                      Category
                    </th>

                    <th className="px-5 py-5 text-xs font-semibold uppercase tracking-[0.15em] text-[#241712]/65">
                      Price
                    </th>

                    <th className="px-5 py-5 text-xs font-semibold uppercase tracking-[0.15em] text-[#241712]/65">
                      Available
                    </th>

                    <th className="px-5 py-5 text-xs font-semibold uppercase tracking-[0.15em] text-[#241712]/65">
                      Featured
                    </th>

                    <th className="px-5 py-5 text-xs font-semibold uppercase tracking-[0.15em] text-[#241712]/65">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {items.map(
                    (item) => (
                      <tr
                        key={
                          item._id
                        }
                        className="owner-menu-row border-b border-[#241712]/20 last:border-b-0"
                      >
                        <td className="px-5 py-5 lg:px-6">
                          <div className="flex min-w-0 items-center gap-3">
                            <img
                              src={
                                item.image
                              }
                              alt={
                                item.name
                              }
                              className="h-12 w-12 shrink-0 rounded-xl object-cover lg:h-14 lg:w-14"
                            />

                            <div className="min-w-0">
                              <p className="truncate font-semibold text-[#241712]">
                                {
                                  item.name
                                }
                              </p>

                              <p className="mt-1 max-w-xs truncate text-sm text-[#241712]/65">
                                {
                                  item.description
                                }
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-5 text-sm font-medium text-[#6f503b]">
                          {
                            item.category
                          }
                        </td>

                        <td className="px-5 py-5 font-semibold text-[#241712]">
                          ₹
                          {
                            item.price
                          }
                        </td>

                        <td className="px-5 py-5">
                          <button
                            type="button"
                            onClick={() =>
                              toggleItem(
                                item,
                                "available"
                              )
                            }
                            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${availabilityClasses(
                              item.available !== false
                            )}`}
                          >
                            {item.available !== false
                              ? "Available"
                              : "Unavailable"}
                          </button>
                        </td>

                        <td className="px-5 py-5">
                          <button
                            type="button"
                            onClick={() =>
                              toggleItem(
                                item,
                                "featured"
                              )
                            }
                            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                              item.featured
                                ? "bg-[#b8895f]/20 text-[#744f35]"
                                : "bg-[#241712]/8 text-[#241712]/60"
                            }`}
                          >
                            {item.featured
                              ? "Featured"
                              : "Regular"}
                          </button>
                        </td>

                        <td className="px-5 py-5">
                          <div className="flex items-center gap-4">
                            <button
                              type="button"
                              onClick={() =>
                                openEditModal(
                                  item
                                )
                              }
                              className="text-sm font-semibold text-[#6f503b] hover:text-[#b8895f] hover:underline"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  item._id
                                )
                              }
                              className="text-sm font-semibold text-[#944b3b] hover:text-[#7e382e] hover:underline"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      {/* =====================================================
          MOBILE CARDS
      ====================================================== */}

      {!loading &&
        items.length > 0 && (
          <div className="mt-6 space-y-4 md:hidden">
            {items.map((item) => (
              <article
                key={item._id}
                className="owner-menu-row overflow-hidden rounded-[1.5rem] border border-[#241712]/25 bg-[#f5efe6] shadow-[0_16px_40px_rgba(36,23,18,0.10)]"
              >
                <div className="flex gap-4 p-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-20 w-20 shrink-0 rounded-2xl object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-base font-semibold text-[#241712]">
                          {item.name}
                        </h3>

                        <p className="mt-1 text-xs font-medium text-[#6f503b]">
                          {item.category}
                        </p>
                      </div>

                      <p className="shrink-0 text-lg font-semibold text-[#241712]">
                        ₹
                        {
                          item.price
                        }
                      </p>
                    </div>

                    <p className="mt-3 line-clamp-2 text-xs leading-5 text-[#241712]/65">
                      {
                        item.description
                      }
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 border-t border-[#241712]/15">
                  <button
                    type="button"
                    onClick={() =>
                      toggleItem(
                        item,
                        "available"
                      )
                    }
                    className="border-r border-[#241712]/15 px-4 py-3 text-left"
                  >
                    <span className="block text-[8px] uppercase tracking-[0.2em] text-[#241712]/45">
                      Availability
                    </span>

                    <span
                      className={`mt-1 inline-block rounded-full px-2.5 py-1 text-[10px] font-semibold ${availabilityClasses(
                        item.available !== false
                      )}`}
                    >
                      {item.available !== false
                        ? "Available"
                        : "Unavailable"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      toggleItem(
                        item,
                        "featured"
                      )
                    }
                    className="px-4 py-3 text-left"
                  >
                    <span className="block text-[8px] uppercase tracking-[0.2em] text-[#241712]/45">
                      Homepage
                    </span>

                    <span
                      className={`mt-1 inline-block rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                        item.featured
                          ? "bg-[#b8895f]/20 text-[#744f35]"
                          : "bg-[#241712]/8 text-[#241712]/60"
                      }`}
                    >
                      {item.featured
                        ? "Featured"
                        : "Regular"}
                    </span>
                  </button>
                </div>

                <div className="flex border-t border-[#241712]/15">
                  <button
                    type="button"
                    onClick={() =>
                      openEditModal(
                        item
                      )
                    }
                    className="flex-1 px-4 py-3 text-sm font-semibold text-[#6f503b] transition hover:bg-[#e7ddce]"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(
                        item._id
                      )
                    }
                    className="flex-1 border-l border-[#241712]/15 px-4 py-3 text-sm font-semibold text-[#944b3b] transition hover:bg-[#a85d4a]/5"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

      {/* =====================================================
          MODAL
      ====================================================== */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#241712]/70 px-3 py-4 backdrop-blur-sm sm:px-4 sm:py-6">
          <div className="max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-[1.75rem] border border-[#241712]/25 bg-[#f5efe6] p-5 shadow-[0_25px_80px_rgba(36,23,18,0.25)] sm:max-h-[90vh] sm:rounded-[2rem] sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-[#8c6849] sm:text-sm">
                  {editingItem
                    ? "Edit Item"
                    : "New Item"}
                </p>

                <h3 className="mt-2 text-2xl font-semibold text-[#241712] sm:text-3xl">
                  {editingItem
                    ? "Update menu item"
                    : "Add to your menu"}
                </h3>
              </div>

              <button
                type="button"
                onClick={
                  closeModal
                }
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e7ddce] text-lg font-medium text-[#241712] transition hover:bg-[#b8895f]"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={
                handleSubmit
              }
              className="mt-7 space-y-5"
            >
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-[#241712]"
                >
                  Name
                </label>

                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={
                    handleChange
                  }
                  placeholder="Cappuccino"
                  required
                  className="h-14 w-full rounded-2xl border border-[#241712]/15 bg-[#fffaf3] px-4 text-sm text-[#241712] outline-none focus:border-[#b8895f]"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-semibold text-[#241712]"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={
                    form.description
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Rich espresso with steamed milk..."
                  rows={4}
                  required
                  className="w-full resize-none rounded-2xl border border-[#241712]/15 bg-[#fffaf3] px-4 py-3 text-sm leading-6 text-[#241712] outline-none focus:border-[#b8895f]"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="price"
                    className="mb-2 block text-sm font-semibold text-[#241712]"
                  >
                    Price
                  </label>

                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="1"
                    value={form.price}
                    onChange={
                      handleChange
                    }
                    placeholder="180"
                    required
                    className="h-14 w-full rounded-2xl border border-[#241712]/15 bg-[#fffaf3] px-4 text-sm text-[#241712] outline-none focus:border-[#b8895f]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="mb-2 block text-sm font-semibold text-[#241712]"
                  >
                    Category
                  </label>

                  <select
                    id="category"
                    name="category"
                    value={
                      form.category
                    }
                    onChange={
                      handleChange
                    }
                    className="h-14 w-full rounded-2xl border border-[#241712]/15 bg-[#fffaf3] px-4 text-sm text-[#241712] outline-none focus:border-[#b8895f]"
                  >
                    <option value="Coffee">
                      Coffee
                    </option>

                    <option value="Cold Coffee">
                      Cold Coffee
                    </option>

                    <option value="Tea">
                      Tea
                    </option>

                    <option value="Food">
                      Food
                    </option>

                    <option value="Dessert">
                      Dessert
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="image"
                  className="mb-2 block text-sm font-semibold text-[#241712]"
                >
                  Image URL
                </label>

                <input
                  id="image"
                  name="image"
                  type="url"
                  value={form.image}
                  onChange={
                    handleChange
                  }
                  placeholder="https://..."
                  required
                  className="h-14 w-full rounded-2xl border border-[#241712]/15 bg-[#fffaf3] px-4 text-sm text-[#241712] outline-none focus:border-[#b8895f]"
                />
              </div>

              <div>
                <label
                  htmlFor="image-file"
                  className="mb-2 block text-sm font-semibold text-[#241712]"
                >
                  Or upload image
                </label>

                <input
                  id="image-file"
                  type="file"
                  accept="image/*"
                  onChange={
                    handleImageChange
                  }
                  className="block w-full rounded-2xl border border-[#241712]/15 bg-[#fffaf3] px-3 py-3 text-xs text-[#241712]/70 file:mr-3 file:rounded-full file:border-0 file:bg-[#b8895f]/15 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-[#6f503b]"
                />

                {imagePreview && (
                  <div className="mt-4 overflow-hidden rounded-2xl border border-[#241712]/20 bg-[#e7ddce]">
                    <img
                      src={
                        imagePreview
                      }
                      alt="Preview"
                      className="h-48 w-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-[#241712]/15 bg-[#fffaf3] px-4 py-4">
                  <div>
                    <p className="font-semibold text-[#241712]">
                      Available
                    </p>

                    <p className="mt-1 text-xs text-[#241712]/65">
                      Show to customers
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    name="available"
                    checked={
                      form.available
                    }
                    onChange={
                      handleChange
                    }
                    className="h-5 w-5 shrink-0 accent-[#b8895f]"
                  />
                </label>

                <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-[#241712]/15 bg-[#fffaf3] px-4 py-4">
                  <div>
                    <p className="font-semibold text-[#241712]">
                      Featured
                    </p>

                    <p className="mt-1 text-xs text-[#241712]/65">
                      Show on homepage
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    name="featured"
                    checked={
                      form.featured
                    }
                    onChange={
                      handleChange
                    }
                    className="h-5 w-5 shrink-0 accent-[#b8895f]"
                  />
                </label>
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={
                    closeModal
                  }
                  disabled={
                    submitting
                  }
                  className="w-full rounded-full border border-[#241712]/20 px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.15em] text-[#241712] transition hover:border-[#8c6849] sm:w-auto"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    submitting
                  }
                  className="w-full rounded-full bg-[#241712] px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.15em] text-[#f5efe6] transition hover:bg-[#b8895f] hover:text-[#17110d] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  {submitting
                    ? "Saving..."
                    : editingItem
                    ? "Update Item"
                    : "Add Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default MenuManagement;