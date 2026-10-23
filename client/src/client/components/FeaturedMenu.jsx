import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";

import { gsap } from "../../animations/gsapConfig";
import { getMenuItems } from "../../services/api";

function FeaturedMenu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const activeCardRef = useRef(null);
  const nextImageRef = useRef(null);

  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        const result = await getMenuItems({
          featured: true,
          available: true,
        });

        let featuredItems = result.data || [];

        // Older records may predate the `featured` flag. If no items are
        // marked featured yet, fill this section with available menu items.
        if (featuredItems.length === 0) {
          const fallbackResult = await getMenuItems({
            available: true,
          });
          featuredItems = fallbackResult.data || [];
        }

        setItems(featuredItems);
      } catch (error) {
        console.error(
          "Failed to load featured menu:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedItems();
  }, []);

  const nextIndex =
    items.length > 0
      ? (activeIndex + 1) % items.length
      : 0;

  const currentItem = items[activeIndex];
  const nextItem = items[nextIndex];

  /*
   * Initial section animation
   */
  useGSAP(
    () => {
      if (
        loading ||
        !currentItem ||
        !activeCardRef.current
      ) {
        return;
      }

      gsap.from(".featured-heading", {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".featured-section",
          start: "top 80%",
          once: true,
        },
      });

      gsap.from(activeCardRef.current, {
        y: 35,
        opacity: 0,
        scale: 0.96,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".featured-card-stage",
          start: "top 80%",
          once: true,
        },
      });

      if (nextImageRef.current) {
        gsap.fromTo(
          nextImageRef.current,
          {
            x: 35,
            opacity: 0,
          },
          {
            x: 0,
            opacity: 0.18,
            duration: 0.9,
            delay: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".featured-card-stage",
              start: "top 80%",
              once: true,
            },
          }
        );
      }
    },
    {
      dependencies: [loading],
    }
  );

  /*
   * Animate the newly active card and
   * the new upcoming image.
   */
  useGSAP(
    () => {
      if (
        loading ||
        !currentItem ||
        !activeCardRef.current
      ) {
        return;
      }

      gsap.fromTo(
        activeCardRef.current,
        {
          opacity: 0,
          x: 35,
          scale: 0.97,
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.55,
          ease: "power3.out",
        }
      );

      if (nextImageRef.current) {
        gsap.fromTo(
          nextImageRef.current,
          {
            opacity: 0,
            x: 35,
          },
          {
            opacity: 0.18,
            x: 0,
            duration: 0.6,
            delay: 0.1,
            ease: "power3.out",
          }
        );
      }
    },
    {
      dependencies: [activeIndex],
    }
  );

  const nextProduct = () => {
    if (items.length <= 1) return;

    const currentCard = activeCardRef.current;
    const upcomingImage = nextImageRef.current;

    if (!currentCard) {
      setActiveIndex(
        (current) => (current + 1) % items.length
      );

      return;
    }

    const timeline = gsap.timeline({
      onComplete: () => {
        setActiveIndex(
          (current) => (current + 1) % items.length
        );
      },
    });

    timeline
      .to(
        currentCard,
        {
          x: -45,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
        },
        0
      )
      .to(
        upcomingImage,
        {
          x: -70,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
        },
        0
      );
  };

  const previousProduct = () => {
    if (items.length <= 1) return;

    const currentCard = activeCardRef.current;

    if (!currentCard) {
      setActiveIndex(
        (current) =>
          (current - 1 + items.length) %
          items.length
      );

      return;
    }

    gsap.to(currentCard, {
      x: 45,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        setActiveIndex(
          (current) =>
            (current - 1 + items.length) %
            items.length
        );
      },
    });

    if (nextImageRef.current) {
      gsap.to(nextImageRef.current, {
        x: 70,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      });
    }
  };

  if (loading) {
    return (
      <section className="bg-[#f3eee5] px-6 py-20 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="text-[10px] uppercase tracking-[0.35em] text-[#6d4832]">
            Loading favourites...
          </p>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="featured-section overflow-hidden bg-[#f3eee5] px-6 py-20 text-[#17110d] sm:py-24 lg:px-12">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="featured-heading flex flex-col justify-between gap-6 border-b border-[#17110d]/10 pb-8 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#b8895f]" />

              <p className="text-[10px] uppercase tracking-[0.35em] text-[#6d4832]">
                House favourites
              </p>
            </div>

            <h2 className="mt-4 max-w-2xl text-4xl font-semibold leading-[0.92] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              Made for your{" "}
              <span className="text-[#b8895f]">
                perfect pause.
              </span>
            </h2>
          </div>

          <p className="max-w-sm text-sm leading-6 text-[#17110d]/50">
            A few of the things our guests keep coming back for.
            Made carefully and served fresh.
          </p>
        </div>

        {/* Product stage */}
        <div className="featured-card-stage relative mx-auto mt-12 flex h-[450px] max-w-[1000px] items-center justify-center overflow-hidden">
          {/* Next product image — ONLY IMAGE */}
          {items.length > 1 && (
            <div
              ref={nextImageRef}
              className="pointer-events-none absolute left-[calc(50%+220px)] top-1/2 z-10 hidden h-[330px] w-[220px] -translate-y-1/2 overflow-hidden rounded-[1.5rem] opacity-20 blur-[0.5px] md:block"
            >
              <img
                src={nextItem.image}
                alt=""
                aria-hidden="true"
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-[#f3eee5]/30" />
            </div>
          )}

          {/* Active card */}
          <article
            ref={activeCardRef}
            className="relative z-20 w-full max-w-[550px] overflow-hidden rounded-[1.75rem] bg-white shadow-[0_20px_60px_rgba(23,17,13,0.12)]"
          >
            <div className="relative h-[285px] overflow-hidden sm:h-[310px]">
              <img
                src={currentItem.image}
                alt={currentItem.name}
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />

              <div className="absolute left-5 top-5">
                <span className="rounded-full bg-[#f3eee5]/90 px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] text-[#17110d]">
                  {currentItem.category}
                </span>
              </div>

              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between text-white">
                <div>
                  <p className="mb-1 text-[9px] uppercase tracking-[0.25em] text-white/55">
                    {String(activeIndex + 1).padStart(
                      2,
                      "0"
                    )}
                  </p>

                  <h3 className="text-2xl font-semibold sm:text-3xl">
                    {currentItem.name}
                  </h3>
                </div>

                <p className="text-lg font-medium">
                  ₹{currentItem.price}
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <p className="text-sm leading-6 text-[#17110d]/55">
                {currentItem.description}
              </p>

              <div className="mt-5 flex items-center justify-between">
                <Link
                  to="/menu"
                  className="group inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.18em]"
                >
                  View menu

                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>

                <span className="text-[9px] uppercase tracking-[0.18em] text-[#17110d]/25">
                  Crafted daily
                </span>
              </div>
            </div>
          </article>
        </div>

        {/* Controls */}
        <div className="mx-auto mt-5 flex max-w-[550px] items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[9px] uppercase tracking-[0.28em] text-[#17110d]/35">
              Featured
            </span>

            <span className="h-px w-7 bg-[#17110d]/10" />

            <span className="text-[9px] tracking-[0.25em] text-[#6d4832]">
              {String(activeIndex + 1).padStart(
                2,
                "0"
              )}{" "}
              /{" "}
              {String(items.length).padStart(2, "0")}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={previousProduct}
              disabled={items.length <= 1}
              aria-label="Previous featured item"
              className="group flex h-11 w-11 items-center justify-center rounded-full border border-[#17110d]/15 transition-all duration-300 hover:border-[#6d4832] hover:bg-[#6d4832] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            >
              <span className="text-lg transition-transform duration-300 group-hover:-translate-x-1">
                ←
              </span>
            </button>

            <button
              type="button"
              onClick={nextProduct}
              disabled={items.length <= 1}
              aria-label="Next featured item"
              className="group flex h-11 w-11 items-center justify-center rounded-full bg-[#17110d] text-[#f3eee5] transition-all duration-300 hover:bg-[#b8895f] hover:text-[#17110d] disabled:cursor-not-allowed disabled:opacity-30"
            >
              <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </button>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 flex justify-center">
          <Link
            to="/menu"
            className="rounded-full border border-[#17110d]/15 px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] transition duration-300 hover:border-[#6d4832] hover:text-[#6d4832]"
          >
            Explore full menu
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedMenu;