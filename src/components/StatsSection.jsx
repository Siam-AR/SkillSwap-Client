"use client";

import { useRef, useEffect } from "react";
import { Users, CheckCircle, Banknote } from "lucide-react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function CountUp({ value, isCurrency = false }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    duration: 2500,
    bounce: 0,
  });

  useEffect(() => {
    if (inView) {
      motionValue.set(value);
    }
  }, [inView, motionValue, value]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        const rounded = Math.round(latest);
        ref.current.textContent = isCurrency ? formatCurrency(rounded) : rounded.toString();
      }
    });
  }, [springValue, isCurrency]);

  return <span ref={ref}>{isCurrency ? formatCurrency(0) : "0"}</span>;
}

export default function StatsSection({ stats }) {
  const items = [
    {
      label: "Total Users",
      value: stats?.totalUsers || 44,
      icon: Users,
      isCurrency: false,
    },
    {
      label: "Total Tasks",
      value: stats?.totalTasks || 46,
      icon: CheckCircle,
      isCurrency: false,
    },
    {
      label: "Total Payout Completed",
      value: stats?.totalPayout || 2228,
      icon: Banknote,
      isCurrency: true,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  return (
    <section className="w-full sticky top-[72px] lg:top-[88px] z-0 py-6 md:py-16 bg-white border-y border-slate-100 shadow-[0_8px_30px_rgba(0,150,137,0.04)]">
      <div className="w-full max-w-7xl 2xl:max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 items-center"
        >
          {items.map((item, index) => (
            <motion.div
              key={item.label}
              variants={itemVariants}
              className={`flex items-center w-full ${index === 0 ? "justify-start" : index === 2 ? "justify-end" : "justify-center"}`}
            >
              {/* Responsive content block: stacked on mobile, row on desktop */}
              <div className="flex flex-col md:flex-row items-center md:items-center gap-1.5 md:gap-5 p-1 md:p-2 rounded-2xl lg:hover:bg-slate-50 transition-colors duration-300 w-full md:w-[260px]">
                {/* ICON BOX */}
                <div className="flex-shrink-0 h-8 w-8 md:h-12 md:w-12 rounded-lg md:rounded-xl flex items-center justify-center border border-teal-100 bg-teal-50 text-[#009689]">
                  <item.icon className="w-4 h-4 md:w-6 md:h-6" strokeWidth={2.25} />
                </div>

                {/* TEXT */}
                <div className="flex flex-col items-center md:items-start gap-0.5 md:gap-1 min-w-0">
                  <p className="order-2 md:order-1 text-[10px] sm:text-xs md:text-sm font-medium text-slate-500 text-center md:text-left leading-tight whitespace-normal md:whitespace-nowrap">
                    {item.label}
                  </p>
                  <p className="order-1 md:order-2 text-xl sm:text-2xl md:text-4xl lg:text-5xl font-black md:font-extrabold text-slate-950 tracking-tight whitespace-nowrap">
                    <CountUp value={item.value} isCurrency={item.isCurrency} />
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}