import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";

import Navbar from "../components/Navbar";
import { gsap } from "../../animations/gsapConfig";
import { getMenuItems } from "../../services/api";
import { useCart } from "../../context/CartContext";

const categories = [
  "All",
  "Coffee",
  "Cold Coffee",
  "Tea",
  "Food",
  "Dessert",
];

const heroSlides = [
  {
    name: "Cappuccino",
    image:
      "https://images.pexels.com/photos/29516134/pexels-photo-29516134.jpeg?auto=compress&cs=tinysrgb&w=2000",
  },
  {
    name: "Mocha",
    image:
      "https://images.pexels.com/photos/15841658/pexels-photo-15841658.jpeg?auto=compress&cs=tinysrgb&w=2000",
  },
  {
    name: "Iced Latte",
    image:
      "https://images.pexels.com/photos/32681655/pexels-photo-32681655.jpeg?auto=compress&cs=tinysrgb&w=2000",
  },
];

function Menu() {
  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] =
    useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [heroIndex, setHeroIndex] = useState(0);

  const menuGridRef = useRef(null);

  const heroImagesRef = useRef([]);
  const heroProgressRef = useRef(null);

  const isAnimatingRef = useRef(false);
  const heroIndexRef = useRef(0);

  const ambientGlowRef = useRef(null);
  const ambientGlowTwoRef = useRef(null);
  const ambientGlowThreeRef = useRef(null);

  const {
    cartItems,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  /*
   * =========================================================
   * FETCH MENU
   * =========================================================
   */

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await getMenuItems({
          available: true,
        });

        setItems(result.data || []);
      } catch (err) {
        console.error("Failed to load menu:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load the menu right now."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  /*
   * =========================================================
   * FILTER MENU
   * =========================================================
   */

  const filteredItems =
    activeCategory === "All"
      ? items
      : items.filter(
          (item) => item.category === activeCategory
        );

  /*
   * =========================================================
   * GET QUANTITY
   * =========================================================
   */

  const getQuantity = (id) => {
    const cartItem = cartItems.find(
      (item) => item._id === id
    );

    return cartItem?.quantity || 0;
  };

  /*
   * =========================================================
   * HERO IMAGE CHANGE
   *
   * Only the image changes.
   * Text stays completely static.
   * =========================================================
   */

  const changeHeroImage = (nextIndex) => {
    const currentIndex = heroIndexRef.current;

    if (
      nextIndex === currentIndex ||
      isAnimatingRef.current
    ) {
      return;
    }

    const currentImage =
      heroImagesRef.current[currentIndex];

    const nextImage =
      heroImagesRef.current[nextIndex];

    const progress =
      heroProgressRef.current;

    if (!currentImage || !nextImage) {
      heroIndexRef.current = nextIndex;
      setHeroIndex(nextIndex);
      return;
    }

    isAnimatingRef.current = true;

    gsap.set(nextImage, {
      opacity: 0,
      scale: 1.06,
      zIndex: 3,
    });

    const timeline = gsap.timeline({
      onComplete: () => {
        gsap.set(currentImage, {
          opacity: 0,
          scale: 1,
          zIndex: 1,
        });

        gsap.set(nextImage, {
          opacity: 1,
          scale: 1,
          zIndex: 2,
        });

        heroIndexRef.current = nextIndex;
        setHeroIndex(nextIndex);

        isAnimatingRef.current = false;
      },
    });

    timeline.to(
      currentImage,
      {
        opacity: 0,
        scale: 1.025,
        duration: 0.85,
        ease: "power2.inOut",
      },
      0
    );

    timeline.to(
      nextImage,
      {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: "power3.out",
      },
      0.08
    );

    if (progress) {
      gsap.killTweensOf(progress);

      gsap.fromTo(
        progress,
        {
          scaleX: 0,
        },
        {
          scaleX: 1,
          duration: 15,
          ease: "none",
        }
      );
    }
  };

  /*
   * =========================================================
   * AUTO HERO CHANGE EVERY 15 SECONDS
   * =========================================================
   */

  useEffect(() => {
    const timer = setInterval(() => {
      if (isAnimatingRef.current) {
        return;
      }

      const nextIndex =
        (heroIndexRef.current + 1) %
        heroSlides.length;

      changeHeroImage(nextIndex);
    }, 15000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  /*
   * =========================================================
   * HERO INITIAL STATE
   * =========================================================
   */

  useGSAP(() => {
    heroImagesRef.current.forEach(
      (image, index) => {
        if (!image) return;

        gsap.set(image, {
          opacity: index === 0 ? 1 : 0,
          scale: 1,
          zIndex: index === 0 ? 2 : 1,
        });
      }
    );

    if (heroProgressRef.current) {
      gsap.fromTo(
        heroProgressRef.current,
        {
          scaleX: 0,
        },
        {
          scaleX: 1,
          duration: 15,
          ease: "none",
        }
      );
    }
  });

  /*
   * =========================================================
   * HERO CONTROLS
   * =========================================================
   */

  const previousHero = () => {
    const nextIndex =
      (heroIndexRef.current -
        1 +
        heroSlides.length) %
      heroSlides.length;

    changeHeroImage(nextIndex);
  };

  const nextHero = () => {
    const nextIndex =
      (heroIndexRef.current + 1) %
      heroSlides.length;

    changeHeroImage(nextIndex);
  };

  /*
   * =========================================================
   * MENU CARD ANIMATION
   * =========================================================
   */

  useGSAP(
    () => {
      if (loading) return;

      const cards =
        gsap.utils.toArray(".menu-card");

      if (cards.length === 0) return;

      gsap.fromTo(
        cards,
        {
          y: 25,
          scale: 0.985,
        },
        {
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
          clearProps: "transform",
        }
      );
    },
    {
      scope: menuGridRef,
      dependencies: [
        loading,
        activeCategory,
        filteredItems.length,
      ],
    }
  );

  /*
   * =========================================================
   * AMBIENT BACKGROUND
   * =========================================================
   */

  useGSAP(() => {
    if (ambientGlowRef.current) {
      gsap.to(ambientGlowRef.current, {
        x: 80,
        y: 50,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }

    if (ambientGlowTwoRef.current) {
      gsap.to(ambientGlowTwoRef.current, {
        x: -70,
        y: -40,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }

    if (ambientGlowThreeRef.current) {
      gsap.to(ambientGlowThreeRef.current, {
        x: 40,
        y: -50,
        duration: 12,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }
  });

  /*
   * =========================================================
   * CART ACTIONS
   * =========================================================
   */

  const handleAddToCart = (item) => {
    addToCart(item);
  };

  const handleIncrease = (id) => {
    increaseQuantity(id);
  };

  const handleDecrease = (id) => {
    decreaseQuantity(id);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#0e0a08] text-[#f3eee5]">
      <Navbar />

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative min-h-[680px] overflow-hidden bg-[#100c09] text-[#f3eee5] sm:min-h-[720px] lg:min-h-[760px]">
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.name}
              ref={(element) => {
                heroImagesRef.current[index] =
                  element;
              }}
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url("${slide.image}")`,
              }}
            />
          ))}

          <div className="absolute inset-0 z-10 bg-black/45" />

          <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#100c09]/95 via-[#100c09]/65 to-[#100c09]/15" />

          <div className="absolute inset-x-0 bottom-0 z-10 h-52 bg-gradient-to-t from-[#100c09] via-[#100c09]/65 to-transparent" />

          <div className="pointer-events-none absolute right-[-100px] top-[20%] z-10 h-80 w-80 rounded-full bg-[#b8895f]/15 blur-[120px]" />
        </div>

        {/* Static hero content */}
        <div className="relative z-20 mx-auto flex min-h-[680px] max-w-6xl flex-col justify-between px-5 pb-8 pt-32 sm:min-h-[720px] sm:px-6 sm:pb-10 sm:pt-36 lg:min-h-[760px] lg:px-12">
          <Link
            to="/"
            className="w-fit text-[9px] uppercase tracking-[0.3em] text-white/70 transition-colors duration-300 hover:text-[#b8895f]"
          >
            ← Back home
          </Link>

          <div className="grid gap-10 lg:grid-cols-[1fr_0.65fr] lg:items-end">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#b8895f]" />

                <p className="text-[9px] uppercase tracking-[0.4em] text-[#b8895f] sm:text-[10px]">
                  What we're brewing
                </p>
              </div>

              <h1 className="mt-5 text-6xl font-semibold leading-[0.82] tracking-[-0.055em] sm:text-7xl md:text-8xl lg:text-[8rem]">
                The
                <br />
                <span className="text-[#b8895f]">
                  Menu.
                </span>
              </h1>

              <p className="mt-7 max-w-lg text-sm leading-7 text-white/65 sm:text-base">
                Carefully crafted drinks, comforting plates and sweet little
                reasons to stay a little longer.
              </p>
            </div>

            <div className="hidden max-w-sm lg:block lg:justify-self-end">
              <div className="border-l border-white/15 pl-6">
                <p className="text-sm leading-7 text-white/55">
                  Every cup is prepared with intention, from the first shot of
                  espresso to the final pour.
                </p>

                <p className="mt-5 text-[9px] uppercase tracking-[0.3em] text-white/30">
                  Crafted at Aroma
                </p>
              </div>
            </div>
          </div>

          {/* Categories + controls */}
          <div>
            <div className="flex flex-col gap-6 border-t border-white/10 pt-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-full">
                <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
                  {categories.map((category) => {
                    const active =
                      activeCategory === category;

                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() =>
                          setActiveCategory(category)
                        }
                        className={`shrink-0 rounded-full border px-4 py-2.5 text-[8px] uppercase tracking-[0.2em] transition-all duration-300 sm:px-5 sm:text-[9px] ${
                          active
                            ? "border-[#b8895f] bg-[#b8895f] text-[#17110d]"
                            : "border-white/15 bg-black/10 text-white/60 hover:border-[#b8895f] hover:text-white"
                        }`}
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex shrink-0 items-center justify-between gap-5 md:justify-end">
                <div className="flex items-center gap-3">
                  <span className="text-[9px] tracking-[0.25em] text-[#b8895f]">
                    {String(
                      heroIndex + 1
                    ).padStart(2, "0")}
                  </span>

                  <div className="relative h-px w-20 overflow-hidden bg-white/20">
                    <span
                      ref={heroProgressRef}
                      className="absolute inset-y-0 left-0 w-full origin-left scale-x-0 bg-[#b8895f]"
                    />
                  </div>

                  <span className="text-[9px] tracking-[0.25em] text-white/35">
                    03
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={previousHero}
                    aria-label="Previous hero image"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/10 text-white backdrop-blur-sm transition hover:border-[#b8895f] hover:bg-[#b8895f] hover:text-[#17110d] sm:h-11 sm:w-11"
                  >
                    ←
                  </button>

                  <button
                    type="button"
                    onClick={nextHero}
                    aria-label="Next hero image"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[#b8895f] bg-[#b8895f] text-[#17110d] transition hover:bg-[#f3eee5] sm:h-11 sm:w-11"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MENU COLLECTION
      ====================================================== */}

      <section className="relative overflow-hidden bg-gradient-to-b from-[#17110d] via-[#1b1410] to-[#0f0b09] px-5 py-20 sm:px-6 sm:py-24 lg:px-12 lg:py-28">
        {/* Ambient glows */}
        <div
          ref={ambientGlowRef}
          className="pointer-events-none absolute -left-36 top-24 h-[380px] w-[380px] rounded-full bg-[#8c6849]/15 blur-[120px]"
        />

        <div
          ref={ambientGlowTwoRef}
          className="pointer-events-none absolute -right-32 top-[35%] h-[360px] w-[360px] rounded-full bg-[#b8895f]/10 blur-[120px]"
        />

        <div
          ref={ambientGlowThreeRef}
          className="pointer-events-none absolute bottom-[-100px] left-[35%] h-[340px] w-[340px] rounded-full bg-[#6d4832]/15 blur-[120px]"
        />

        <div className="relative mx-auto max-w-6xl">
          {/* Section heading */}
          <div className="mb-10 flex flex-col gap-5 border-b border-white/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#b8895f]" />

                <p className="text-[9px] uppercase tracking-[0.35em] text-[#b8895f]">
                  {activeCategory === "All"
                    ? "Everything we serve"
                    : activeCategory}
                </p>
              </div>

              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#f3eee5] sm:text-4xl">
                Pick your{" "}
                <span className="text-[#b8895f]">
                  favourite.
                </span>
              </h2>
            </div>

            <p className="text-[9px] uppercase tracking-[0.25em] text-white/30">
              {filteredItems.length}{" "}
              {filteredItems.length === 1
                ? "item"
                : "items"}
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex min-h-[320px] items-center justify-center">
              <div className="rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 backdrop-blur-xl">
                <p className="text-[9px] uppercase tracking-[0.3em] text-[#b8895f]">
                  Preparing the menu
                </p>
              </div>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="rounded-[1.75rem] border border-red-400/20 bg-red-950/30 p-8 text-center">
              <p className="text-sm font-medium text-red-300">
                {error}
              </p>
            </div>
          )}

          {/* Empty */}
          {!loading &&
            !error &&
            filteredItems.length === 0 && (
              <div className="flex min-h-[320px] items-center justify-center">
                <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-10 text-center backdrop-blur-xl">
                  <p className="text-2xl font-semibold text-[#f3eee5]">
                    Nothing here yet.
                  </p>

                  <p className="mt-3 max-w-md text-sm leading-6 text-white/40">
                    We don't have anything available in this category right
                    now. Try another one.
                  </p>
                </div>
              </div>
            )}

          {/* Product cards */}
          {!loading &&
            !error &&
            filteredItems.length > 0 && (
              <div
                ref={menuGridRef}
                className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
              >
                {filteredItems.map((item, index) => {
                  const quantity =
                    getQuantity(item._id);

                  return (
                    <article
                      key={item._id}
                      className="menu-card group overflow-hidden rounded-[1.75rem] border border-[#8c6849]/20 bg-[#201713] shadow-[0_20px_55px_rgba(0,0,0,0.32)] transition-all duration-500 hover:-translate-y-2 hover:border-[#b8895f]/40 hover:shadow-[0_30px_75px_rgba(0,0,0,0.45)]"
                    >
                      {/* Product Image */}
                      <div className="relative h-[280px] overflow-hidden sm:h-[300px]">
                        {/* Existing MongoDB product image */}
                        <img
                          src={item.image}
                          alt={item.name}
                          loading={
                            index < 3
                              ? "eager"
                              : "lazy"
                          }
                          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />

                        {/* Image overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                        {/* Warm hover tint */}
                        <div className="pointer-events-none absolute inset-0 bg-[#b8895f]/0 transition duration-500 group-hover:bg-[#b8895f]/10" />

                        {/* Category */}
                        <div className="absolute left-4 top-4">
                          <span className="rounded-full border border-white/20 bg-black/30 px-3.5 py-1.5 text-[8px] uppercase tracking-[0.2em] text-white/90 backdrop-blur-xl sm:text-[9px]">
                            {item.category}
                          </span>
                        </div>

                        {/* Featured */}
                        {item.featured && (
                          <div className="absolute right-4 top-4">
                            <span className="rounded-full border border-[#b8895f]/50 bg-[#b8895f]/90 px-3.5 py-1.5 text-[8px] font-semibold uppercase tracking-[0.2em] text-[#17110d] shadow-lg backdrop-blur-md sm:text-[9px]">
                              Featured
                            </span>
                          </div>
                        )}

                        {/* Product information */}
                        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4 text-white">
                          <div>
                            <p className="mb-1 text-[8px] uppercase tracking-[0.25em] text-white/45">
                              {String(
                                index + 1
                              ).padStart(2, "0")}
                            </p>

                            <h3 className="text-2xl font-semibold leading-none tracking-[-0.035em] sm:text-[1.8rem]">
                              {item.name}
                            </h3>
                          </div>

                          {/* Price */}
                          <span className="shrink-0 rounded-full border border-white/15 bg-black/30 px-3.5 py-2 text-sm font-medium backdrop-blur-xl">
                            ₹{item.price}
                          </span>
                        </div>
                      </div>

                      {/* Product body */}
                      <div className="p-5">
                        <p className="min-h-[48px] text-sm leading-6 text-[#d8c9b8]/55">
                          {item.description}
                        </p>

                        <div className="mt-5">
                          {quantity === 0 ? (
                            <button
                              type="button"
                              onClick={() =>
                                handleAddToCart(item)
                              }
                              className="group/button flex h-12 w-full items-center justify-center gap-3 rounded-[0.9rem] bg-[#30231d] px-5 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#f3eee5] transition-all duration-300 hover:bg-[#8c6849]"
                            >
                              Add to cart

                              <span className="transition-transform duration-300 group-hover/button:translate-x-1">
                                →
                              </span>
                            </button>
                          ) : (
                            <div className="flex h-12 w-full items-center justify-between overflow-hidden rounded-[0.9rem] border border-[#8c6849]/20 bg-[#100c09] text-[#f3eee6]">
                              <button
                                type="button"
                                onClick={() =>
                                  handleDecrease(
                                    item._id
                                  )
                                }
                                aria-label={`Decrease ${item.name} quantity`}
                                className="flex h-full w-14 items-center justify-center text-xl transition-colors duration-200 hover:bg-[#6d4832]"
                              >
                                −
                              </button>

                              <div className="flex items-center gap-2">
                                <span className="text-[8px] uppercase tracking-[0.25em] text-white/30">
                                  Qty
                                </span>

                                <span className="text-sm font-semibold text-[#b8895f]">
                                  {quantity}
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  handleIncrease(
                                    item._id
                                  )
                                }
                                aria-label={`Increase ${item.name} quantity`}
                                className="flex h-full w-14 items-center justify-center text-xl transition-colors duration-200 hover:bg-[#6d4832]"
                              >
                                +
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
        </div>
      </section>

      {/* =====================================================
          FOOTER CTA
      ====================================================== */}

      <section className="relative overflow-hidden border-t border-white/10 bg-[#120d0a] px-5 py-20 sm:px-6 lg:px-12">
        <div className="pointer-events-none absolute right-[-120px] top-[-100px] h-80 w-80 rounded-full bg-[#b8895f]/10 blur-[120px]" />

        <div className="relative mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="text-[9px] uppercase tracking-[0.35em] text-[#b8895f]">
              Still deciding?
            </p>

            <h2 className="mt-3 max-w-xl text-3xl font-semibold leading-[0.95] tracking-[-0.04em] text-[#f3eee5] sm:text-4xl">
              Take your time.
              <br />

              <span className="text-[#b8895f]">
                There's plenty to try.
              </span>
            </h2>
          </div>

          <Link
            to="/"
            className="group inline-flex items-center gap-3 rounded-full border border-white/10 bg-[#f3eee5] px-6 py-3.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#17110d] transition duration-300 hover:-translate-y-0.5 hover:bg-[#b8895f]"
          >
            Back home

            <span className="transition-transform duration-300 group-hover:-translate-x-1">
              ←
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Menu;