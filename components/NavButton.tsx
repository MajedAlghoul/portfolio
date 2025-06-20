"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NavButton({
  isOn,
  link,
  children,
}: {
  isOn: boolean;
  link: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`relative w-[92px] flex items-center justify-center rounded-full h-full ${
        isOn
          ? ""
          : "hover:text-[var(--accent-color)] hover:transition-all duration-300"
      }`}
    >
      {isOn && (
        <motion.div
          layoutId="nav-select"
          className="absolute inset-0 rounded-full Nav-button-selected"
          transition={{ type: "spring", stiffness: 500, damping: 50 }}
        />
      )}

      <Link
        href={link}
        className={`w-full h-full flex items-center justify-center ${
          isOn ? "cursor-default pointer-events-none" : ""
        }`}
        onClick={(e) => {
          if (isOn) e.preventDefault();
        }}
      >
        {children}
      </Link>
    </div>
  );
}
