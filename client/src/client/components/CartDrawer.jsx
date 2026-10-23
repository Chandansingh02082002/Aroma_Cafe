import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";

import { gsap } from "../../animations/gsapConfig";
import { useCart } from "../../context/CartContext";

function CartDrawer({ isOpen, onClose }) {
  const {
    cartItems,
    cartCount,
    cartTotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  useGSAP(
    () => {
      if (!isOpen) return;

      gsap.fromTo(
        ".cart-drawer",
        {
          x: "100%",
        },
        {
          x: "0%",
          duration: 0.5,
          ease: "power3.out",
        }
      );

      gsap.from(".cart-item", {
        x: 30,
        opacity: 0,
        duration: 0.4,
        stagger: 0.08,
        delay: 0.15,
        ease: "power2.out",
      });
    },
    {
      dependencies: [isOpen, cartItems.length],
    }
  );

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100]">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        aria-label="Close cart"
      />

      <aside className="cart-drawer absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-[#f5efe6] shadow-2xl">
        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="flex items-center justify-between border-b border-[#241712]/20 px-6 py-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#8c6849]">
              Your order
            </p>

            <h2 className="mt-1 text-2xl font-semibold text-[#241712]">
              Cart ({cartCount})
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e7ddce] text-xl font-medium text-[#241712] transition hover:bg-[#b8895f]"
            aria-label="Close cart"
          >
            ×
          </button>
        </div>

        {/* =====================================================
            CART CONTENT
        ====================================================== */}

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {cartItems.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-2xl font-semibold text-[#241712]">
                Your cart is empty.
              </p>

              <p className="mt-3 text-sm text-[#241712]/70">
                Add something delicious from the menu.
              </p>

              <Link
                to="/menu"
                onClick={onClose}
                className="mt-6 rounded-full bg-[#241712] px-6 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-[#f5efe6] transition hover:bg-[#8c6849]"
              >
                Browse Menu
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="cart-item rounded-2xl border border-[#241712]/10 bg-[#fffaf3] p-4"
                >
                  <div className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-20 rounded-xl object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-[#241712]">
                            {item.name}
                          </h3>

                          <p className="mt-1 text-sm font-medium text-[#6f503b]">
                            ₹{item.price}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeFromCart(item._id)
                          }
                          className="text-sm font-medium text-[#944b3b] transition hover:text-[#7e382e] hover:underline"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        {/* Quantity */}

                        <div className="flex items-center rounded-full border border-[#241712]/20 bg-[#f5efe6]">
                          <button
                            type="button"
                            onClick={() =>
                              decreaseQuantity(item._id)
                            }
                            className="px-4 py-2 font-medium text-[#6f503b] transition hover:text-[#241712]"
                            aria-label={`Decrease ${item.name} quantity`}
                          >
                            −
                          </button>

                          <span className="min-w-8 text-center text-sm font-semibold text-[#241712]">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              increaseQuantity(item._id)
                            }
                            className="px-4 py-2 font-medium text-[#6f503b] transition hover:text-[#241712]"
                            aria-label={`Increase ${item.name} quantity`}
                          >
                            +
                          </button>
                        </div>

                        {/* Item total */}

                        <p className="font-semibold text-[#241712]">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* =====================================================
            TOTAL
        ====================================================== */}

        {cartItems.length > 0 && (
          <div className="border-t border-[#241712]/20 bg-[#f3ede3] px-6 py-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium uppercase tracking-[0.2em] text-[#6f503b]">
                Total
              </span>

              <span className="text-2xl font-semibold text-[#241712]">
                ₹{cartTotal}
              </span>
            </div>

            <Link
              to="/checkout"
              onClick={onClose}
              className="mt-5 block rounded-full bg-[#241712] px-6 py-4 text-center text-sm font-semibold uppercase tracking-[0.18em] text-[#f5efe6] transition hover:bg-[#8c6849]"
            >
              Checkout
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}

export default CartDrawer;