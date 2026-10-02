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
    <section className="w-full relative z-20 py-10 sm:py-16 bg-white border-y border-slate-100 shadow-[0_8px_30px_rgba(0,150,137,0.04)]">
      <div className="w-full max-w-6xl mx-auto px-8 sm:px-12 lg:px-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center"
        >
          {items.map((item) => (
            <motion.div
              key={item.label}
              variants={itemVariants}
              className="flex items-center justify-center w-full"
            >
              {/* Fixed width content block prevents wide text from distorting column centers */}
              <div className="flex items-center gap-4 sm:gap-5 p-2 rounded-2xl hover:bg-slate-50 transition-colors duration-300 w-[240px] sm:w-[260px]">
                {/* ICON BOX */}
                <div className="flex-shrink-0 h-12 w-12 rounded-xl flex items-center justify-center border border-teal-100 bg-teal-50 text-[#009689]">
                  <item.icon className="w-6 h-6" strokeWidth={2.25} />
                </div>

                {/* TEXT */}
                <div className="flex flex-col items-start gap-1 min-w-0">
                  <p className="text-sm font-medium text-slate-500 whitespace-nowrap">
                    {item.label}
                  </p>
                  <p className="text-4xl sm:text-5xl font-extrabold text-slate-950 tracking-tight whitespace-nowrap">
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