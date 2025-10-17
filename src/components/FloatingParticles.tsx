import { motion } from "framer-motion";
import { Music, Brush, Sparkles, Star } from "lucide-react";

const FloatingParticles = () => {
  const particles = [...Array(30)].map((_, i) => ({
    id: i,
    icon: [Music, Brush, Sparkles, Star][i % 4],
    x: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 5 + Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => {
        const Icon = particle.icon;
        return (
          <motion.div
            key={particle.id}
            className="absolute"
            style={{ left: `${particle.x}%` }}
            initial={{ y: "100vh", opacity: 0, rotate: 0 }}
            animate={{
              y: "-10vh",
              opacity: [0, 0.6, 0],
              rotate: 360,
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "linear",
            }}
          >
            <Icon className="w-6 h-6 text-primary/20" />
          </motion.div>
        );
      })}
    </div>
  );
};

export default FloatingParticles;
