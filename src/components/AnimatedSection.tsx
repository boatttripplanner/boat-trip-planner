import { motion } from "framer-motion";
import type { ReactNode } from "react";

export default function AnimatedSection({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="mb-8"
    >
      {children}
    </motion.section>
  );
} 