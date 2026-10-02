"use client";

import { useRef, useEffect } from "react";
import { FiUsers, FiCheckCircle, FiDollarSign } from "react-icons/fi";
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
      icon: FiUsers,
      isCurrency: false,
    },
    {
      label: "Total Tasks",
      value: stats?.totalTasks || 46,
      icon: FiCheckCircle,
      isCurrency: false,
    },
    {
      label: "Total Payout Completed",
      value: stats?.totalPayout || 2228,
      icon: FiDollarSign,
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
    <section className="relative z-20 pt-10 sm:pt-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="grid gap-4 sm:gap-6 md:grid-cols-3 bg-white/80 backdrop-blur-md rounded-2xl sm:rounded-[2rem] border border-teal-100 shadow-lg shadow-teal-900/5 p-4 sm:p-6 lg:p-8"
      >
        {items.map((item) => (
          <motion.div
            key={item.label}
            variants={itemVariants}
            className="flex items-center gap-5 p-4 rounded-xl hover:bg-teal-50/50 transition-colors duration-300"
          >
            {/* ICON BOX */}
            <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-50 text-[#009689] shadow-sm shadow-teal-100/50">
              <item.icon className="w-7 h-7" />
            </div>

            {/* TEXT */}
            <div>
              <p className="text-3xl font-black text-slate-800 tracking-tight">
                <CountUp value={item.value} isCurrency={item.isCurrency} />
              </p>
              <p className="text-sm font-medium text-slate-500 mt-0.5">
                {item.label}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
