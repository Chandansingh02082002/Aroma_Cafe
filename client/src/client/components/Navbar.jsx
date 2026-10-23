import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";

import { gsap } from "../../animations/gsapConfig";
import { useCart } from "../../context/CartContext";
import CartDrawer from "./CartDrawer";

function Navbar() {
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState("up");

  const { cartCount } = useCart();

  useGSAP(() => {
    gsap.from(".nav-shell", {
      y: -25,
      opacity: 0,
      duration: 0.8,
      delay: 0.1,
      ease: "power3.out",
    });

    gsap.from(".nav-logo", {
      x: -20,
      opacity: 0,
      duration: 0.6,
      delay: 0.25,
      ease: "power3.out",
    });

    gsap.from(".nav-item", {
      y: -12,
      opacity: 0,
      duration: 0.5,
      stagger: 0.07,
      delay: 0.3,
      ease: "power3.out",
    });

    gsap.from(".nav-actions", {
      x: 20,
      opacity: 0,
      duration: 0.6,
      delay: 0.35,
      ease: "power3.out",
    });
  });

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setScrolled(currentScrollY > 40);

      if (currentScrollY > lastScrollY && currentScrollY > 120) {
        setScrollDirection("down");
      } else {
        setScrollDirection("up");
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useGSAP(
    () => {
      gsap.to(".nav-shell", {
        y: scrollDirection === "down" && scrolled ? -8 : 0,
        duration: 0.35,
        ease: "power2.out",
      });
    },
    {
      dependencies: [scrollDirection, scrolled],
    }
  );

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  return (
    <>
      <header
        className={`fixed left-0 top-0 z-[90] w-full transition-all duration-500 ${
          scrolled
            ? "px-3 pt-3 sm:px-5 sm:pt-4"
            : "px-4 pt-4 sm:px-7 sm:pt-5"
        }`}
      >
        <div
          className={`nav-shell mx-auto transition-all duration-500 ${
            scrolled ? "max-w-5xl" : "max-w-[1500px]"
          }`}
        >
          <nav
            className={`relative flex items-center justify-between transition-all duration-500 ${
              scrolled
                ? "h-[62px] rounded-full border border-white/15 bg-[#17110d]/65 px-4 shadow-[0_10px_40px_rgba(0,0,0,0.18)] backdrop-blur-2xl sm:px-5"
                : "h-[72px] rounded-full border border-white/10 bg-white/[0.025] px-5 backdrop-blur-[10px] sm:px-7"
            }`}
          >
            {/* Logo */}
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="nav-logo relative z-10 flex items-center gap-3"
            >
              <span className="text-base font-semibold tracking-[0.28em] text-[#f3eee5] sm:text-lg">
                AROMA
              </span>

              <span className="h-1.5 w-1.5 rounded-full bg-[#b8895f]" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-7 lg:flex">
              <Link
                to="/"
                className="nav-item text-[10px] uppercase tracking-[0.25em] text-white/65 transition-colors duration-300 hover:text-[#b8895f]"
              >
                Home
              </Link>

              <Link
                to="/menu"
                className="nav-item text-[10px] uppercase tracking-[0.25em] text-white/65 transition-colors duration-300 hover:text-[#b8895f]"
              >
                Menu
              </Link>

              <a
                href="/#about"
                className="nav-item text-[10px] uppercase tracking-[0.25em] text-white/65 transition-colors duration-300 hover:text-[#b8895f]"
              >
                About
              </a>

              <a
                href="/#gallery"
                className="nav-item text-[10px] uppercase tracking-[0.25em] text-white/65 transition-colors duration-300 hover:text-[#b8895f]"
              >
                Gallery
              </a>

              <a
                href="/#contact"
                className="nav-item text-[10px] uppercase tracking-[0.25em] text-white/65 transition-colors duration-300 hover:text-[#b8895f]"
              >
                Contact
              </a>
            </div>

            {/* Right Actions */}
            <div className="nav-actions flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className="group flex items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.18em] text-[#f3eee5] transition-all duration-300 hover:border-[#b8895f] hover:text-[#b8895f]"
              >
                Cart

                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#b8895f] px-1 text-[9px] font-bold text-[#17110d]">
                  {cartCount}
                </span>
              </button>

              <Link
                to="/menu"
                className="hidden rounded-full bg-[#f3eee5] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#17110d] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#b8895f] sm:block"
              >
                Order Now
              </Link>

              {/* Mobile button */}
              <button
                type="button"
                onClick={() =>
                  setMobileOpen((value) => !value)
                }
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 lg:hidden"
                aria-label="Toggle menu"
              >
                <span className="relative block h-4 w-5">
                  <span
                    className={`absolute left-0 top-0 h-px w-full bg-white transition-transform duration-300 ${
                      mobileOpen
                        ? "translate-y-2 rotate-45"
                        : ""
                    }`}
                  />

                  <span
                    className={`absolute left-0 top-2 h-px w-full bg-white transition-opacity duration-300 ${
                      mobileOpen ? "opacity-0" : ""
                    }`}
                  />

                  <span
                    className={`absolute left-0 top-4 h-px w-full bg-white transition-transform duration-300 ${
                      mobileOpen
                        ? "-translate-y-2 -rotate-45"
                        : ""
                    }`}
                  />
                </span>
              </button>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
              <div className="absolute left-0 right-0 top-[calc(100%+10px)] overflow-hidden rounded-[2rem] border border-white/10 bg-[#17110d]/90 p-5 shadow-2xl backdrop-blur-2xl lg:hidden">
                <div className="flex flex-col">
                  <Link
                    to="/"
                    onClick={closeMobileMenu}
                    className="border-b border-white/10 py-5 text-sm uppercase tracking-[0.2em] text-white/80 transition hover:text-[#b8895f]"
                  >
                    Home
                  </Link>

                  <Link
                    to="/menu"
                    onClick={closeMobileMenu}
                    className="border-b border-white/10 py-5 text-sm uppercase tracking-[0.2em] text-white/80 transition hover:text-[#b8895f]"
                  >
                    Menu
                  </Link>

                  <a
                    href="/#about"
                    onClick={closeMobileMenu}
                    className="border-b border-white/10 py-5 text-sm uppercase tracking-[0.2em] text-white/80 transition hover:text-[#b8895f]"
                  >
                    About
                  </a>

                  <a
                    href="/#gallery"
                    onClick={closeMobileMenu}
                    className="border-b border-white/10 py-5 text-sm uppercase tracking-[0.2em] text-white/80 transition hover:text-[#b8895f]"
                  >
                    Gallery
                  </a>

                  <a
                    href="/#contact"
                    onClick={closeMobileMenu}
                    className="py-5 text-sm uppercase tracking-[0.2em] text-white/80 transition hover:text-[#b8895f]"
                  >
                    Contact
                  </a>
                </div>
              </div>
            )}
          </nav>
        </div>
      </header>

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
      />
    </>
  );
}

export default Navbar;