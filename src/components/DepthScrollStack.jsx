"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function DepthScrollStack({ statsComponent, sheetComponent }) {
  const sheetRef = useRef(null);

  // Track the scroll progress of the sheet.
  // 0 = when the top of the sheet hits the bottom of the viewport
  // 1 = when the top of the sheet reaches 88px from the top of the viewport (docking over Stats)
  const { scrollYProgress } = useScroll({
    target: sheetRef,
    offset: ["start end", "start 88px"],
  });

  // Scale the stats down slightly and dim it as the sheet scrolls up
  const statsScale = useTransform(scrollYProgress, [0, 1], [1, 0.98]);
  const statsOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.85]);

  // Scale the incoming sheet up from 0.96 to 1
  const sheetScale = useTransform(scrollYProgress, [0, 1], [0.96, 1]);
  
  // Animate the shadow so it grows as it gets closer
  const sheetShadow = useTransform(
    scrollYProgress,
    [0, 1],
    ["0 -4px 10px rgba(0,0,0,0.02)", "0 -20px 50px rgba(0,0,0,0.12)"]
  );

  return (
    <div className="relative w-full">
      <motion.div
        style={{
          scale: statsScale,
          opacity: statsOpacity,
          willChange: "transform, opacity",
          transformOrigin: "top center",
        }}
        className="sticky top-[72px] lg:top-[88px] z-0"
      >
        {statsComponent}
      </motion.div>

      <motion.div
        ref={sheetRef}
        style={{
          scale: sheetScale,
          boxShadow: sheetShadow,
          willChange: "transform, box-shadow",
          transformOrigin: "top center",
        }}
        className="relative z-20 w-full bg-[#F0FDF9] border-t border-white/60 rounded-t-[32px] lg:rounded-t-[40px]"
      >
        {sheetComponent}
      </motion.div>
    </div>
  );
}
