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
    <section className="relative z-20 pt-10 sm:pt-16 max-w-7xl mx-auto px-4 w-full">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="grid gap-6 sm:gap-8 md:grid-cols-3 bg-white border border-slate-100 rounded-[2rem] p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,150,137,0.06)]"
      >
        {items.map((item) => (
          <motion.div
            key={item.label}
            variants={itemVariants}
            className="flex items-center gap-5 p-2 rounded-2xl hover:bg-slate-50 transition-colors duration-300"
          >
            {/* ICON BOX */}
            <div className="flex-shrink-0 h-12 w-12 rounded-xl flex items-center justify-center border border-teal-100 bg-teal-50 text-[#009689]">
              <item.icon className="w-6 h-6" strokeWidth={2.25} />
            </div>

            {/* TEXT (Label on top, Number on bottom) */}
            <div className="flex flex-col items-start gap-1">
              <p className="text-sm font-medium text-slate-500">
                {item.label}
              </p>
              <p className="text-4xl sm:text-5xl font-extrabold text-slate-950 tracking-tight">
                <CountUp value={item.value} isCurrency={item.isCurrency} />
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
