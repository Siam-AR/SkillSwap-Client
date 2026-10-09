"use client";

import dynamic from "next/dynamic";

const Bars = dynamic(() => import("react-loader-spinner").then((mod) => mod.Bars), {
  ssr: false,
});

export default function TaskifyLoader({ size = "80", minHeight = "min-h-screen" }) {
  return (
    <div className={`w-full ${minHeight} flex items-center justify-center bg-transparent`}>
      <Bars
        height={size}
        width={size}
        color="#009689"
        ariaLabel="bars-loading"
        visible={true}
      />
    </div>
  );
}
