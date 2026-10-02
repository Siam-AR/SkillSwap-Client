"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const paymentLogos = [
  { name: "Visa", icon: "/assets/payments/visa.svg" },
  { name: "Mastercard", icon: "/assets/payments/mastercard.svg" },
  { name: "PayPal", icon: "/assets/payments/paypal.svg" },
  { name: "Google Pay", icon: "/assets/payments/gpay.svg" },
  { name: "Apple Pay", icon: "/assets/payments/apple-pay.svg" },
  { name: "SEPA", icon: "/assets/payments/sepa.svg" },
  { name: "Crypto", icon: "/assets/payments/crypto.svg" },
];

export default function PaymentMethodsSection() {
  const spinTransition = {
    repeat: Infinity,
    duration: 32,
    ease: "linear",
  };

  return (
    <section id="payment-methods" className="w-full pt-12 lg:pt-16 pb-8 relative z-10">
      {/* Full Bleed Background */}
      <div className="absolute inset-y-0 bg-white -z-10" style={{ width: '100vw', left: 'calc(-50vw + 50%)' }}></div>
      {/* Header Structure */}
      <div className="flex flex-col items-center px-6 sm:px-10 lg:px-16">
        <div className="text-center">
          <h3 className="text-xs sm:text-sm font-semibold text-[#009689] uppercase tracking-wider">
            Payment Methods
          </h3>
          <div className="relative flex items-center justify-center mt-2 w-32 mx-auto">
            <div className="h-[1.5px] w-full bg-gradient-to-r from-transparent via-[#009689] to-transparent"></div>
            <div className="absolute w-2 h-2 rounded-full bg-[#009689] ring-[3px] ring-white"></div>
          </div>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#1A1A1A] text-center mt-6 tracking-tight">
          Multiple Payment <span className="text-[#009689]">Methods</span>
        </h2>
        <p className="text-sm sm:text-base text-neutral-600 text-center max-w-3xl mx-auto mt-4 leading-relaxed font-medium px-4">
          We accept Visa, Mastercard, American Express, Bkash, Nagad, Rocket, and more, so you are never stuck at checkout. Deposits are instant, and you can start with as little as $1, which means there is no reason to wait before placing your first order.
        </p>
      </div>

      {/* Visual Canvas & Semicircle Arc Layout */}
      <div className="relative w-full max-w-5xl mx-auto mt-6 h-[260px] sm:h-[300px] md:h-[340px] flex flex-col items-center justify-end overflow-hidden select-none">
        
        {/* Background World Map */}
        <div className="absolute inset-x-0 top-0 sm:top-4 h-full max-h-[420px] pointer-events-none -z-10 flex items-center justify-center">
          <Image alt="Global Coverage" className="object-contain opacity-90 brightness-95 saturate-125" fill priority sizes="(max-width: 768px) 100vw, 1000px" src="/assets/payments/world-map.svg"/>
        </div>

        {/* Concentric Arc Graphic Layers */}
        <div className="absolute -bottom-16 sm:-bottom-24 lg:-bottom-28 left-1/2 -translate-x-1/2 w-full max-w-4xl flex items-center justify-center pointer-events-none z-0">
          
          {/* Outer Glow Arch (Ring 1) - Translucent teal gradient fill with fine border */}
          <div className="w-[560px] sm:w-[660px] md:w-[800px] aspect-square rounded-full border border-teal-300/60 bg-gradient-to-t from-teal-200/40 via-teal-100/20 to-transparent absolute bottom-0 translate-y-1/2 flex items-center justify-center">
            
            {/* Middle White Ribbon Track (Ring 2) - Clean semi-opaque white with crisp borders */}
            <div className="w-[83%] aspect-square rounded-full border-t border-b border-teal-300/80 bg-white/95 shadow-[0_0_20px_rgba(255,255,255,0.8)] flex items-center justify-center">
              
              {/* Inner Arch (Ring 3) - Smooth fading center dome */}
              <div className="w-[77%] aspect-square rounded-full border-t border-teal-300/60 bg-gradient-to-b from-[#F0FDF9]/90 to-white" />
              
            </div>
          </div>

          {/* Wheel Parent Container (Sized to match the 83% Middle Ribbon Track) */}
          <div className="absolute bottom-0 translate-y-1/2 w-[465px] sm:w-[548px] md:w-[664px] aspect-square rounded-full pointer-events-auto z-10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={spinTransition}
              className="relative w-full h-full rounded-full"
            >
              {paymentLogos.map((item, index) => {
                const total = paymentLogos.length;
                // Start from the top (270 degrees) and distribute evenly
                const angle = (index / total) * 360 - 90;
                const radius = 50; // percentage from center
                const x = (50 + radius * Math.cos((angle * Math.PI) / 180)).toFixed(4);
                const y = (50 + radius * Math.sin((angle * Math.PI) / 180)).toFixed(4);

                return (
                  <div
                    key={item.name}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${x}%`, top: `${y}%` }}
                  >
                    {/* Counter-rotate each badge so the logo remains strictly upright */}
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={spinTransition}
                      className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-white border border-teal-300/80 shadow-[0_6px_18px_rgba(0,150,137,0.12)] flex items-center justify-center p-2.5 sm:p-3 hover:scale-110 transition-transform duration-200"
                    >
                      <Image alt={item.name} className="w-auto h-auto max-w-full max-h-full object-contain" height={36} src={item.icon} width={36} />
                    </motion.div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>

        {/* Bottom Fade Mask */}
        <div className="absolute inset-x-0 bottom-0 h-16 sm:h-20 bg-gradient-to-t from-white via-white/40 to-transparent pointer-events-none z-10" />
      </div>

      {/* Large Bottom Watermark Text */}
      <h3 className="font-nevera text-5xl sm:text-7xl md:text-8xl lg:text-[110px] xl:text-[128px] font-normal uppercase text-center tracking-[-0.02em] leading-[1.4] bg-gradient-to-r from-[#5EEAD4]/30 via-[#009689]/15 to-[#5EEAD4]/30 bg-clip-text text-transparent select-none pointer-events-none -mt-4 sm:-mt-6 mb-2 whitespace-nowrap relative z-20">
        MULTIPLE PAYMENTS
      </h3>
    </section>
  );
}
