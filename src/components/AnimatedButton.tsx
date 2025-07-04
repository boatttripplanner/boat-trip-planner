"use client";
import { motion, HTMLMotionProps } from "framer-motion";
import type { PropsWithChildren } from "react";

export default function AnimatedButton({ children, className = '', ...props }: PropsWithChildren<HTMLMotionProps<'button'>>) {
  return (
    <motion.button
      whileHover={{ scale: 1.05, boxShadow: "0 4px 24px #0e749033" }}
      whileTap={{ scale: 0.97 }}
      className={`transition-colors ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
} 