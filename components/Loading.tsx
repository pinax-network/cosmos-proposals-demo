"use client";
import { useEffect, useState } from "react";

export function Loading() {
  const [dots, setDots] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : `${prev}.`));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  if (!show) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-white via-gray-100 to-white dark:from-[#0D1117] dark:via-[#161B22] dark:to-[#0D1117]">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 border-4 border-t-emerald-500 dark:border-t-[#7EE7D0] border-gray-200 dark:border-[#1C2128] rounded-full animate-spin" />
      </div>
      <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
        Loading{dots}
      </p>
    </div>
  );
}
