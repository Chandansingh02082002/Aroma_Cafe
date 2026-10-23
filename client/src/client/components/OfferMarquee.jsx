function OfferMarquee() {
  const offers = [
    "30% OFF ON COLD BEVERAGES",
    "20% OFF ON HOT BEVERAGES",
    "VISIT AROMA TODAY",
    "LIMITED TIME OFFER",
  ];

  const marqueeItems = [
    ...offers,
    ...offers,
  ];

  return (
    <section className="relative z-30 w-full overflow-hidden border-y border-[#b8895f]/20 bg-[#241712] text-[#f5efe6]">
      <div className="flex h-11 items-center overflow-hidden">
        <div className="flex w-max animate-aroma-marquee items-center whitespace-nowrap">
          {marqueeItems.map(
            (offer, index) => (
              <div
                key={`${offer}-${index}`}
                className="flex items-center"
              >
                <span className="px-6 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#f5efe6] sm:px-8 sm:text-[10px]">
                  {offer}
                </span>

                <span className="text-[#b8895f]">
                  •
                </span>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}

export default OfferMarquee;