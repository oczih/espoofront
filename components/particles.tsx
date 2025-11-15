"use client";
import { motion } from "framer-motion";

const PARTICLE_COUNT = 20;

// module-level deterministic seed
let seed = 1;
function rnd() {
  seed = (seed * 16807) % 2147483647;
  return seed / 2147483647;
}

const STABLE_PARTICLES = Array.from({ length: PARTICLE_COUNT }, () => ({
  left: rnd() * 100,
  top: rnd() * 100,
  size: 2 + rnd() * 4,
}));

export default function Particles() {
  return (
    <div className="absolute inset-0">
      {STABLE_PARTICLES.map((p, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: `${p.left}%`, top: `${p.top}%` }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <div
            className="absolute rounded-full bg-blue-400/10"
            style={{ width: p.size, height: p.size }}
          />
        </motion.div>
      ))}
    </div>
  );
}
