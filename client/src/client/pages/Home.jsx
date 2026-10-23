import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FeaturedMenu from "../components/FeaturedMenu";
import OfferMarquee from "../components/OfferMarquee";

import { gsap } from "../../animations/gsapConfig";

function Home() {
  const [activePhilosophy, setActivePhilosophy] =
    useState(0);

  const [activeMoment, setActiveMoment] =
    useState(0);

  const pageDarknessRef = useRef(null);

  const philosophyCurrentRef =
    useRef(null);

  const philosophyPreviousRef =
    useRef(null);

  const momentCardRef =
    useRef(null);

  const nextMomentImageRef =
    useRef(null);

  const philosophyFeatures = [
    {
      number: "01",
      label: "BEANS",
      title: "Freshly roasted",
      description:
        "Carefully selected beans with roast profiles designed to bring out their best character in every cup.",
    },
    {
      number: "02",
      label: "CRAFT",
      title: "Made to order",
      description:
        "Every drink is prepared fresh when you order it, with attention to the details that make a familiar favourite taste special.",
    },
    {
      number: "03",
      label: "SPACE",
      title: "A place to linger",
      description:
        "Comfortable corners, warm light and enough time to enjoy your coffee without feeling like you need to rush away.",
    },
  ];

  const beliefs = [
    {
      number: "01",
      title: "Slow by design.",
      description:
        "We believe the best conversations happen when there is nowhere else you need to be.",
    },
    {
      number: "02",
      title: "Crafted with care.",
      description:
        "Every drink, plate and detail is prepared with intention, patience and a little obsession.",
    },
    {
      number: "03",
      title: "Made for people.",
      description:
        "A cafe is more than what is in the cup. It is the people, stories and moments around it.",
    },
  ];

  const moments = [
    {
      number: "01",
      title: "The Morning Ritual",
      description:
        "Fresh coffee, warm light and the first quiet moments of the day.",
      image:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=90",
      alt: "Coffee being prepared",
    },
    {
      number: "02",
      title: "Made Slowly",
      description:
        "Behind every cup is a little patience, attention and craft.",
      image:
        "https://images.unsplash.com/photo-1511081692775-05d0f180a065?auto=format&fit=crop&w=1000&q=90",
      alt: "Coffee on a cafe table",
    },
    {
      number: "03",
      title: "Stay Awhile",
      description:
        "A comfortable corner, good company and nowhere else to be.",
      image:
        "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1000&q=90",
      alt: "Cafe interior",
    },
  ];

  const previousPhilosophyIndex =
    (activePhilosophy -
      1 +
      philosophyFeatures.length) %
    philosophyFeatures.length;

  const nextPhilosophyIndex =
    (activePhilosophy + 1) %
    philosophyFeatures.length;

  const currentPhilosophy =
    philosophyFeatures[activePhilosophy];

  const previousPhilosophy =
    philosophyFeatures[
      previousPhilosophyIndex
    ];

  const nextMomentIndex =
    (activeMoment + 1) %
    moments.length;

  const previousMomentIndex =
    (activeMoment -
      1 +
      moments.length) %
    moments.length;

  const currentMoment =
    moments[activeMoment];

  const nextMoment =
    moments[nextMomentIndex];

  /*
   * =========================================================
   * GLOBAL PAGE DARKENING
   * =========================================================
   */

  useGSAP(() => {
    if (!pageDarknessRef.current) return;

    gsap.fromTo(
      pageDarknessRef.current,
      {
        opacity: 0.05,
      },
      {
        opacity: 0.32,
        ease: "none",
        scrollTrigger: {
          trigger: "main",
          start: "top top",
          end: "bottom bottom",
          scrub: 1.4,
        },
      }
    );
  });

  /*
   * =========================================================
   * SCROLL REVEALS
   * =========================================================
   */

  useGSAP(() => {
    gsap.from(".philosophy-kicker", {
      y: 30,
      opacity: 0,
      duration: 0.7,
      ease: "power3.out",
      scrollTrigger: {
        trigger: "#about",
        start: "top 80%",
        once: true,
      },
    });

    gsap.from(".philosophy-title-line", {
      yPercent: 110,
      opacity: 0,
      duration: 0.9,
      stagger: 0.12,
      ease: "power4.out",
      scrollTrigger: {
        trigger: "#about",
        start: "top 75%",
        once: true,
      },
    });

    gsap.from(".belief-card", {
      y: 35,
      opacity: 0,
      duration: 0.65,
      stagger: 0.12,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".belief-grid",
        start: "top 80%",
        once: true,
      },
    });

    gsap.from(".philosophy-description", {
      y: 25,
      opacity: 0,
      duration: 0.7,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".philosophy-description",
        start: "top 85%",
        once: true,
      },
    });

    gsap.from(".moments-heading", {
      y: 30,
      opacity: 0,
      duration: 0.7,
      ease: "power3.out",
      scrollTrigger: {
        trigger: "#gallery",
        start: "top 80%",
        once: true,
      },
    });

    gsap.from(".moments-controls", {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: "power3.out",
      scrollTrigger: {
        trigger: "#gallery",
        start: "top 80%",
        once: true,
      },
    });

    gsap.from(".contact-content", {
      y: 35,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: "#contact",
        start: "top 80%",
        once: true,
      },
    });

    gsap.to(".moments-glow", {
      x: 80,
      y: -30,
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    gsap.to(".contact-glow", {
      x: -80,
      y: 40,
      duration: 9,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  });

  /*
   * =========================================================
   * PHILOSOPHY CAROUSEL
   * =========================================================
   */

  const animatePhilosophy = (
    direction
  ) => {
    const currentCard =
      philosophyCurrentRef.current;

    const previousCard =
      philosophyPreviousRef.current;

    const targetIndex =
      direction === "next"
        ? nextPhilosophyIndex
        : previousPhilosophyIndex;

    if (
      !currentCard ||
      !previousCard
    ) {
      setActivePhilosophy(
        targetIndex
      );

      return;
    }

    const currentX =
      direction === "next"
        ? -55
        : 55;

    const previousX =
      direction === "next"
        ? 35
        : -35;

    gsap
      .timeline({
        onComplete: () => {
          setActivePhilosophy(
            targetIndex
          );
        },
      })
      .to(
        currentCard,
        {
          x: currentX,
          opacity: 0,
          duration: 0.35,
          ease: "power2.in",
        },
        0
      )
      .to(
        previousCard,
        {
          x: previousX,
          opacity: 0,
          duration: 0.35,
          ease: "power2.in",
        },
        0
      );
  };

  /*
   * =========================================================
   * MOMENTS CAROUSEL
   * =========================================================
   */

  const animateMoment = (
    direction
  ) => {
    const currentCard =
      momentCardRef.current;

    const nextImage =
      nextMomentImageRef.current;

    const targetIndex =
      direction === "next"
        ? nextMomentIndex
        : previousMomentIndex;

    if (!currentCard) {
      setActiveMoment(targetIndex);
      return;
    }

    const exitX =
      direction === "next"
        ? -45
        : 45;

    const previewX =
      direction === "next"
        ? -55
        : 55;

    const timeline =
      gsap.timeline({
        onComplete: () => {
          setActiveMoment(
            targetIndex
          );
        },
      });

    timeline.to(
      currentCard,
      {
        x: exitX,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      },
      0
    );

    if (nextImage) {
      timeline.to(
        nextImage,
        {
          x: previewX,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
        },
        0
      );
    }
  };

  /*
   * =========================================================
   * PHILOSOPHY ENTRY
   * =========================================================
   */

  useGSAP(
    () => {
      if (
        philosophyCurrentRef.current
      ) {
        gsap.fromTo(
          philosophyCurrentRef.current,
          {
            x: 35,
            opacity: 0,
            scale: 0.97,
          },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            duration: 0.55,
            ease: "power3.out",
            overwrite: true,
          }
        );
      }

      if (
        philosophyPreviousRef.current
      ) {
        gsap.fromTo(
          philosophyPreviousRef.current,
          {
            x: -20,
            opacity: 0,
            scale: 0.97,
          },
          {
            x: 0,
            opacity: 0.3,
            scale: 1,
            duration: 0.55,
            ease: "power3.out",
            overwrite: true,
          }
        );
      }
    },
    {
      dependencies: [
        activePhilosophy,
      ],
    }
  );

  /*
   * =========================================================
   * MOMENT ENTRY
   * =========================================================
   */

  useGSAP(
    () => {
      if (
        momentCardRef.current
      ) {
        gsap.fromTo(
          momentCardRef.current,
          {
            x: 30,
            opacity: 0,
            scale: 0.97,
          },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            duration: 0.55,
            ease: "power3.out",
            overwrite: true,
          }
        );
      }

      if (
        nextMomentImageRef.current
      ) {
        gsap.fromTo(
          nextMomentImageRef.current,
          {
            x: 25,
            opacity: 0,
          },
          {
            x: 0,
            opacity: 0.2,
            duration: 0.55,
            ease: "power3.out",
            overwrite: true,
          }
        );
      }
    },
    {
      dependencies: [
        activeMoment,
      ],
    }
  );

  /*
   * =========================================================
   * KEYBOARD CONTROLS
   * =========================================================
   */

  useEffect(() => {
    const handleKeyDown = (
      event
    ) => {
      if (
        event.key ===
        "ArrowRight"
      ) {
        animateMoment("next");
      }

      if (
        event.key ===
        "ArrowLeft"
      ) {
        animateMoment(
          "previous"
        );
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  });

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#2a1b14] via-[#21150f] via-[45%] to-[#0b0705] text-[#f3eee5]">
      {/* =====================================================
          GLOBAL DARKNESS LAYER
      ====================================================== */}

      <div
        ref={pageDarknessRef}
        className="pointer-events-none fixed inset-0 z-[5] bg-[#050302] opacity-[0.05]"
      />

      {/* =====================================================
          CONTENT
      ====================================================== */}

      
       <div className="relative z-10">
  <Navbar />

  {/* Space reserved for the fixed navbar */}
  <div className="h-[82px] sm:h-[96px] lg:h-[112px]" />

  <OfferMarquee />

  <Hero />

  <FeaturedMenu />

        {/* ===================================================
            PHILOSOPHY
        ==================================================== */}

        <section
          id="about"
          className="relative overflow-hidden bg-transparent px-5 py-20 text-[#f3eee5] sm:px-6 sm:py-24 lg:px-12 lg:py-28"
        >
          <div className="pointer-events-none absolute -right-24 top-20 h-64 w-64 rounded-full bg-[#6d4832]/18 blur-[90px] sm:h-80 sm:w-80" />

          <div className="relative mx-auto max-w-6xl">
            <div className="grid gap-7 lg:grid-cols-[0.65fr_1.35fr] lg:items-end lg:gap-10">
              <div className="philosophy-kicker">
                <div className="flex items-center gap-3">
                  <span className="h-px w-7 bg-[#b8895f] sm:w-8" />

                  <p className="text-[9px] uppercase tracking-[0.35em] text-[#b8895f] sm:text-[10px]">
                    Our Philosophy
                  </p>
                </div>

                <p className="mt-4 max-w-sm text-sm leading-6 text-white/35 sm:mt-5">
                  Simple ideas that shape the way we make coffee and the way we
                  want you to experience the cafe.
                </p>
              </div>

              <div className="overflow-hidden">
                <div className="philosophy-title-line text-4xl font-semibold leading-[0.92] tracking-[-0.045em] sm:text-5xl md:text-6xl">
                  Coffee should not
                </div>

                <div className="philosophy-title-line text-4xl font-semibold leading-[0.92] tracking-[-0.045em] text-[#b8895f] sm:text-5xl md:text-6xl">
                  be rushed.
                </div>
              </div>
            </div>

            <div className="mt-10 h-px bg-white/10 sm:mt-12" />

            <div className="mt-8 sm:mt-10">
              <div className="relative hidden min-h-[350px] md:block lg:min-h-[390px]">
                <article
                  ref={
                    philosophyPreviousRef
                  }
                  className="absolute left-0 top-1/2 h-[320px] w-[46%] -translate-y-1/2 rounded-[1.75rem] border border-white/5 bg-[#1b130f]/80 p-6 opacity-30 backdrop-blur-sm sm:p-7 lg:h-[350px] lg:p-8"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] uppercase tracking-[0.3em] text-[#b8895f]">
                      {
                        previousPhilosophy.number
                      }
                    </span>

                    <span className="text-[8px] uppercase tracking-[0.25em] text-white/20">
                      {
                        previousPhilosophy.label
                      }
                    </span>
                  </div>

                  <div className="mt-20 lg:mt-24">
                    <h3 className="text-3xl font-semibold tracking-[-0.04em] lg:text-4xl">
                      {
                        previousPhilosophy.title
                      }
                    </h3>

                    <p className="mt-4 max-w-md text-sm leading-6 text-white/30">
                      {
                        previousPhilosophy.description
                      }
                    </p>
                  </div>

                  <div className="absolute bottom-6 left-6 right-6 border-t border-white/10 pt-4 lg:left-8 lg:right-8">
                    <span className="text-[8px] uppercase tracking-[0.25em] text-white/20">
                      Aroma Philosophy
                    </span>
                  </div>
                </article>

                <article
                  ref={
                    philosophyCurrentRef
                  }
                  className="absolute right-0 top-1/2 h-[350px] w-[58%] -translate-y-1/2 rounded-[1.75rem] border border-white/10 bg-[#201610]/90 p-6 shadow-[0_20px_55px_rgba(0,0,0,0.25)] backdrop-blur-sm sm:p-7 lg:h-[380px] lg:p-8"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] uppercase tracking-[0.3em] text-[#b8895f]">
                        {
                          currentPhilosophy.number
                        }
                      </span>

                      <span className="h-px w-6 bg-white/15" />
                    </div>

                    <span className="text-[8px] uppercase tracking-[0.25em] text-white/30">
                      {
                        currentPhilosophy.label
                      }
                    </span>
                  </div>

                  <div className="mt-20 lg:mt-24">
                    <h3 className="text-4xl font-semibold leading-none tracking-[-0.045em] sm:text-5xl">
                      {
                        currentPhilosophy.title
                      }
                    </h3>

                    <p className="mt-5 max-w-xl text-sm leading-7 text-white/45 sm:text-base">
                      {
                        currentPhilosophy.description
                      }
                    </p>
                  </div>

                  <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between border-t border-white/10 pt-4 lg:left-8 lg:right-8">
                    <span className="text-[8px] uppercase tracking-[0.25em] text-white/25">
                      Aroma Philosophy
                    </span>

                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-[9px] text-[#b8895f]">
                      {
                        currentPhilosophy.number
                      }
                    </span>
                  </div>
                </article>
              </div>

              <article className="rounded-[1.5rem] border border-white/10 bg-[#201610]/90 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.2)] backdrop-blur-sm md:hidden sm:p-6">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] uppercase tracking-[0.3em] text-[#b8895f]">
                    {
                      currentPhilosophy.number
                    }
                  </span>

                  <span className="text-[8px] uppercase tracking-[0.25em] text-white/25">
                    {
                      currentPhilosophy.label
                    }
                  </span>
                </div>

                <div className="mt-12">
                  <h3 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                    {
                      currentPhilosophy.title
                    }
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-white/40">
                    {
                      currentPhilosophy.description
                    }
                  </p>
                </div>

                <div className="mt-8 border-t border-white/10 pt-4">
                  <p className="text-[8px] uppercase tracking-[0.25em] text-white/20">
                    Aroma Philosophy
                  </p>
                </div>
              </article>

              <div className="mt-5 flex items-center justify-between sm:mt-6">
                <div className="flex items-center gap-2.5">
                  <span className="text-[8px] uppercase tracking-[0.28em] text-white/25 sm:text-[9px]">
                    Philosophy
                  </span>

                  <span className="h-px w-5 bg-white/10 sm:w-7" />

                  <span className="text-[8px] tracking-[0.18em] text-[#b8895f] sm:text-[9px]">
                    {String(
                      activePhilosophy +
                        1
                    ).padStart(
                      2,
                      "0"
                    )}{" "}
                    / 03
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      animatePhilosophy(
                        "previous"
                      )
                    }
                    aria-label="Previous philosophy"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-sm transition hover:border-[#b8895f] hover:bg-[#b8895f] hover:text-[#17110d] sm:h-11 sm:w-11"
                  >
                    ←
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      animatePhilosophy(
                        "next"
                      )
                    }
                    aria-label="Next philosophy"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#b8895f] text-sm text-[#17110d] transition hover:bg-[#f3eee5] sm:h-11 sm:w-11"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>

            <div className="belief-section mt-16 border-t border-white/10 pt-10 sm:mt-20 sm:pt-12">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.32em] text-white/25">
                    What We Believe
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
                    The little things matter.
                  </h2>
                </div>

                <p className="max-w-sm text-sm leading-6 text-white/30">
                  Three principles that shape the way we serve and welcome people
                  into the cafe.
                </p>
              </div>

              <div className="belief-grid mt-8 grid gap-3 sm:mt-10 md:grid-cols-3 md:gap-4">
                {beliefs.map(
                  (belief) => (
                    <article
                      key={
                        belief.number
                      }
                      className="belief-card rounded-[1.5rem] border border-white/10 bg-[#1b130f]/70 p-5 backdrop-blur-sm transition duration-300 hover:border-[#b8895f]/30 hover:bg-[#211711] sm:p-6"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] uppercase tracking-[0.3em] text-[#b8895f]">
                          {
                            belief.number
                          }
                        </span>

                        <span className="text-[8px] uppercase tracking-[0.25em] text-white/20">
                          Principle
                        </span>
                      </div>

                      <h3 className="mt-10 text-xl font-medium tracking-[-0.02em] sm:text-2xl">
                        {
                          belief.title
                        }
                      </h3>

                      <p className="mt-3 text-sm leading-6 text-white/35">
                        {
                          belief.description
                        }
                      </p>
                    </article>
                  )
                )}
              </div>
            </div>

            <div className="philosophy-description mt-14 grid gap-8 border-t border-white/10 pt-9 sm:mt-16 sm:pt-10 lg:grid-cols-2 lg:gap-12">
              <div>
                <p className="text-[9px] uppercase tracking-[0.3em] text-[#b8895f]">
                  Why Aroma exists
                </p>

                <p className="mt-4 max-w-xl text-lg leading-8 text-white/65 sm:text-xl">
                  Aroma began with a simple idea — create a place where excellent
                  coffee doesn't have to be rushed.
                </p>
              </div>

              <div className="lg:justify-self-end">
                <p className="max-w-lg text-sm leading-7 text-white/40">
                  From the beans we choose to the atmosphere we create, everything
                  is built around one feeling: there is always time for one more
                  coffee.
                </p>

                <p className="mt-4 text-[8px] uppercase tracking-[0.3em] text-white/20">
                  Stay a little longer.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================
            MOMENTS AT AROMA
        ==================================================== */}

        <section
          id="gallery"
          className="relative overflow-hidden bg-transparent px-5 py-20 text-[#f3eee5] sm:px-6 sm:py-24 lg:px-12 lg:py-28"
        >
          <div className="moments-glow pointer-events-none absolute -left-28 top-16 h-[360px] w-[360px] rounded-full bg-[#6d4832]/14 blur-[120px]" />

          <div className="pointer-events-none absolute -right-32 bottom-0 h-[400px] w-[400px] rounded-full bg-[#b8895f]/8 blur-[130px]" />

          <div className="relative mx-auto max-w-6xl">
            <div className="moments-heading flex flex-col gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span className="h-px w-8 bg-[#b8895f]" />

                  <p className="text-[9px] uppercase tracking-[0.35em] text-[#b8895f] sm:text-[10px]">
                    Moments at Aroma
                  </p>
                </div>

                <h2 className="mt-4 max-w-2xl text-4xl font-semibold leading-[0.92] tracking-[-0.045em] sm:text-5xl md:text-6xl">
                  More than just{" "}
                  <span className="text-[#b8895f]">
                    coffee.
                  </span>
                </h2>
              </div>

              <p className="max-w-sm text-sm leading-6 text-white/35">
                A glimpse into the cups, conversations and little moments that
                make Aroma feel like home.
              </p>
            </div>

            <div className="relative mx-auto mt-10 flex h-[390px] w-full max-w-[1100px] items-center justify-center overflow-hidden sm:h-[440px] md:h-[470px]">
              <div
                ref={
                  nextMomentImageRef
                }
                className="pointer-events-none absolute left-[calc(50%+30vw)] top-1/2 z-10 hidden h-[245px] w-[155px] -translate-y-1/2 overflow-hidden rounded-[1.5rem] border border-white/10 opacity-20 shadow-[0_20px_55px_rgba(0,0,0,0.35)] md:block lg:left-[calc(50%+270px)] lg:h-[300px] lg:w-[190px]"
              >
                <img
                  src={nextMoment.image}
                  alt=""
                  aria-hidden="true"
                  className="h-full w-full object-cover grayscale-[15%]"
                />

                <div className="absolute inset-0 bg-[#17110d]/45" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#100c09]/60 to-transparent" />
              </div>

              <article
                ref={
                  momentCardRef
                }
                className="relative z-20 w-full max-w-[680px] overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#201610]/90 shadow-[0_25px_70px_rgba(0,0,0,0.4)] backdrop-blur-sm"
              >
                <div className="relative h-[255px] overflow-hidden sm:h-[290px] md:h-[315px]">
                  <img
                    src={
                      currentMoment.image
                    }
                    alt={
                      currentMoment.alt
                    }
                    className="h-full w-full object-cover transition-transform duration-700"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
                  <div className="absolute inset-0 bg-[#6d4832]/10" />

                  <div className="absolute left-5 top-5">
                    <span className="rounded-full border border-white/20 bg-[#17110d]/55 px-3.5 py-1.5 text-[8px] uppercase tracking-[0.2em] text-white/85 backdrop-blur-xl sm:text-[9px]">
                      Moment{" "}
                      {
                        currentMoment.number
                      }
                    </span>
                  </div>

                  <div className="absolute bottom-5 left-5 right-5 sm:left-6 sm:right-6">
                    <p className="mb-2 text-[8px] uppercase tracking-[0.3em] text-[#b8895f]">
                      Aroma · Jaipur
                    </p>

                    <h3 className="text-3xl font-semibold leading-none tracking-[-0.04em] text-[#f3eee5] sm:text-4xl">
                      {
                        currentMoment.title
                      }
                    </h3>
                  </div>
                </div>

                <div className="p-5 sm:p-6 md:p-7">
                  <p className="max-w-xl text-sm leading-7 text-white/40 sm:text-base">
                    {
                      currentMoment.description
                    }
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
                    <span className="text-[8px] uppercase tracking-[0.25em] text-white/20 sm:text-[9px]">
                      A moment worth keeping
                    </span>

                    <span className="text-[8px] uppercase tracking-[0.25em] text-[#b8895f] sm:text-[9px]">
                      Stay awhile
                    </span>
                  </div>
                </div>
              </article>
            </div>

            <div className="moments-controls mx-auto flex max-w-[680px] items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-[8px] uppercase tracking-[0.3em] text-white/25 sm:text-[9px]">
                  Moments
                </span>

                <span className="h-px w-6 bg-white/10 sm:w-8" />

                <span className="text-[8px] tracking-[0.22em] text-[#b8895f] sm:text-[9px]">
                  {String(
                    activeMoment +
                      1
                  ).padStart(
                    2,
                    "0"
                  )}{" "}
                  /{" "}
                  {String(
                    moments.length
                  ).padStart(
                    2,
                    "0"
                  )}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    animateMoment(
                      "previous"
                    )
                  }
                  aria-label="Previous moment"
                  className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.02] text-white/70 backdrop-blur-sm transition-all duration-300 hover:border-[#b8895f] hover:bg-[#b8895f] hover:text-[#17110d] sm:h-12 sm:w-12"
                >
                  <span className="transition-transform duration-300 group-hover:-translate-x-1">
                    ←
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    animateMoment(
                      "next"
                    )
                  }
                  aria-label="Next moment"
                  className="group flex h-11 w-11 items-center justify-center rounded-full bg-[#b8895f] text-[#17110d] transition-all duration-300 hover:bg-[#f3eee5] sm:h-12 sm:w-12"
                >
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================
            CONTACT
        ==================================================== */}

        <section
          id="contact"
          className="relative overflow-hidden bg-transparent px-5 py-24 text-[#f3eee5] sm:px-6 sm:py-28 lg:px-12 lg:py-32"
        >
          <div className="contact-glow pointer-events-none absolute -right-24 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-[#b8895f]/10 blur-[120px]" />

          <div className="pointer-events-none absolute -left-28 bottom-[-120px] h-80 w-80 rounded-full bg-[#6d4832]/10 blur-[120px]" />

          <div className="contact-content relative mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <div>
                <div className="flex items-center gap-3">
                  <span className="h-px w-8 bg-[#b8895f]" />

                  <p className="text-[9px] uppercase tracking-[0.35em] text-[#b8895f] sm:text-[10px]">
                    Visit Us
                  </p>
                </div>

                <h2 className="mt-5 max-w-xl text-5xl font-semibold leading-[0.84] tracking-[-0.055em] sm:text-6xl md:text-7xl">
                  Come in.
                  <br />
                  Stay
                  <br />
                  <span className="text-[#b8895f]">
                    awhile.
                  </span>
                </h2>
              </div>

              <div className="lg:justify-self-end">
                <p className="max-w-xl text-base leading-7 text-white/55 sm:text-lg">
                  Good coffee, warm interiors and a table waiting for you.
                </p>

                <div className="mt-8 grid gap-6 border-t border-white/10 pt-6 sm:grid-cols-3 sm:gap-4">
                  <div>
                    <p className="text-[8px] uppercase tracking-[0.25em] text-white/30">
                      Hours
                    </p>

                    <p className="mt-2 text-sm leading-6 text-white/70">
                      Mon – Sun
                      <br />
                      8:00 AM – 10:00 PM
                    </p>
                  </div>

                  <div>
                    <p className="text-[8px] uppercase tracking-[0.25em] text-white/30">
                      Address
                    </p>

                    <p className="mt-2 text-sm leading-6 text-white/70">
                      123 Coffee Street,
                      <br />
                      Jaipur
                    </p>
                  </div>

                  <div>
                    <p className="text-[8px] uppercase tracking-[0.25em] text-white/30">
                      Contact
                    </p>

                    <p className="mt-2 text-sm leading-6 text-white/70">
                      +91 98765 43210
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    type="button"
                    className="group inline-flex items-center gap-4 rounded-full border border-white/10 bg-[#f3eee5] px-6 py-3.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#17110d] transition-all duration-300 hover:-translate-y-1 hover:bg-[#b8895f]"
                  >
                    Find us

                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-20 border-t border-white/10 pt-6">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <p className="text-[8px] uppercase tracking-[0.3em] text-white/20">
                  Aroma Coffee House
                </p>

                <p className="text-[8px] uppercase tracking-[0.3em] text-white/20">
                  Good coffee. Good people. Good time.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Home;