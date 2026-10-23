import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";

import { gsap } from "../../animations/gsapConfig";

function Hero() {
  useGSAP(() => {
    const tl = gsap.timeline();

    tl.from(".hero-kicker", {
      y: 25,
      opacity: 0,
      duration: 0.7,
      ease: "power3.out",
    })
      .from(
        ".hero-line",
        {
          y: 60,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power4.out",
        },
        "-=0.3"
      )
      .from(
        ".hero-copy",
        {
          y: 25,
          opacity: 0,
          duration: 0.6,
          ease: "power3.out",
        },
        "-=0.4"
      )
      .from(
        ".hero-cta",
        {
          y: 20,
          opacity: 0,
          duration: 0.5,
          ease: "power3.out",
        },
        "-=0.3"
      )
      .from(
        ".hero-image-wrap",
        {
          scale: 0.95,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        },
        "-=0.7"
      )
      .from(
        ".hero-meta",
        {
          y: 15,
          opacity: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "power3.out",
        },
        "-=0.5"
      );
  });

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#17110d] text-[#f3eee5]">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[65%] top-[30%] h-[420px] w-[420px] rounded-full bg-[#6d4832]/20 blur-[120px]" />

        <div className="absolute -bottom-20 -left-20 h-[280px] w-[280px] rounded-full bg-[#b8895f]/10 blur-[100px]" />
      </div>

      <div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-6 pb-20 pt-32 sm:px-10 lg:grid-cols-[1fr_0.75fr] lg:px-12 lg:pt-28">
        {/* Left content */}
        <div className="relative z-10">
          <div className="hero-kicker mb-6 flex items-center gap-3">
            <span className="h-px w-10 bg-[#b8895f]" />

            <p className="text-[10px] uppercase tracking-[0.4em] text-[#b8895f]">
              Specialty Coffee · Jaipur
            </p>
          </div>

          <h1 className="max-w-3xl overflow-hidden text-5xl font-semibold leading-[0.9] tracking-[-0.05em] sm:text-7xl lg:text-[6.5rem]">
            <span className="hero-line block">
              GOOD
            </span>

            <span className="hero-line block text-[#b8895f]">
              COFFEE.
            </span>

            <span className="hero-line block">
              GOOD
            </span>

            <span className="hero-line block">
              MOMENTS.
            </span>
          </h1>

          <div className="mt-8 flex max-w-xl flex-col gap-7 sm:mt-10 sm:flex-row sm:items-end">
            <div className="hero-copy">
              <p className="max-w-md text-base leading-7 text-white/55 sm:text-lg">
                Slow mornings, bold espresso and a warm space designed to
                make staying awhile feel effortless.
              </p>
            </div>

            <div className="hero-cta flex shrink-0 gap-3">
              <Link
                to="/menu"
                className="group inline-flex items-center gap-4 rounded-full bg-[#f3eee5] px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#17110d] transition duration-300 hover:-translate-y-1 hover:bg-[#b8895f]"
              >
                Explore Menu

                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <a
                href="#about"
                className="hidden rounded-full border border-white/15 px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70 transition hover:border-[#b8895f] hover:text-[#b8895f] sm:block"
              >
                Our Story
              </a>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap gap-8 sm:mt-14 sm:gap-10">
            <div className="hero-meta">
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/30">
                Open
              </p>

              <p className="mt-2 text-sm text-white/75">
                Daily · 8 AM — 10 PM
              </p>
            </div>

            <div className="hero-meta">
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/30">
                Location
              </p>

              <p className="mt-2 text-sm text-white/75">
                Jaipur, Rajasthan
              </p>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="relative flex justify-center lg:justify-end">
          <div className="hero-image-wrap relative aspect-[4/5] w-full max-w-[460px] overflow-hidden rounded-[2rem]">
            <img
              src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=90"
              alt="Freshly brewed coffee"
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#17110d]/70 via-transparent to-transparent" />

            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/60">
                  Signature Roast
                </p>

                <p className="mt-2 text-xl font-medium">
                  House Blend No. 01
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-sm backdrop-blur-md">
                ↓
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom indicator */}
      <div className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 items-center gap-4 md:flex">
        <span className="text-[9px] uppercase tracking-[0.35em] text-white/30">
          Scroll to explore
        </span>

        <span className="h-px w-12 bg-white/20" />
      </div>
    </section>
  );
}

export default Hero;