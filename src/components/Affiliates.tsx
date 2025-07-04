// import AnimatedButton from "@/components/AnimatedButton";
import { motion } from "framer-motion";
import Image from "next/image";

interface AmazonProduct {
  title: string;
  url: string;
  image: string;
  price: string;
}

interface AffiliatesProps {
  amazon: AmazonProduct[];
  samBoat: string;
}

export default function Affiliates({ amazon, samBoat }: AffiliatesProps) {
  return (
    <section className="mb-8">
      <h3 className="text-2xl font-bold text-cyan-800 mb-2">Productos y alquiler</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
        {amazon?.map((p, i) => (
          <a key={i} href={p.url} target="_blank" rel="noopener noreferrer" className="flex gap-4 bg-cyan-50 rounded-lg p-4 shadow hover:shadow-lg transition">
            <div className="relative w-20 h-20 flex-shrink-0">
              <Image
                src={p.image}
                alt={p.title}
                fill
                className="rounded object-cover"
                sizes="80px"
                loading="lazy"
                placeholder="empty"
              />
            </div>
            <div>
              <div className="font-semibold text-cyan-700">{p.title}</div>
              <div className="text-cyan-900 font-bold">{p.price}</div>
              <div className="text-cyan-500 text-xs mt-1">Amazon afiliado</div>
            </div>
          </a>
        ))}
      </div>
      <motion.a
        whileHover={{ scale: 1.05, boxShadow: "0 4px 24px #0e749033" }}
        whileTap={{ scale: 0.97 }}
        href={samBoat}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-cyan-700 hover:bg-cyan-800 text-white font-bold py-3 px-6 rounded-lg text-center shadow-md transition-colors w-full mt-2"
      >
        Alquila un barco en SamBoat
      </motion.a>
    </section>
  );
} 