import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Music, Brush, Sparkles } from "lucide-react";

const IntroSplash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 4000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-watercolor-green via-watercolor-gold to-watercolor-white flex items-center justify-center overflow-hidden relative">
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 50,
              opacity: 0 
            }}
            animate={{
              y: -50,
              opacity: [0, 1, 0],
              x: Math.random() * window.innerWidth
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          >
            {i % 3 === 0 ? (
              <Music className="w-6 h-6 text-primary/30" />
            ) : i % 3 === 1 ? (
              <Brush className="w-6 h-6 text-accent/30" />
            ) : (
              <Sparkles className="w-6 h-6 text-secondary/30" />
            )}
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <div className="text-center z-10">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="text-8xl font-bold bg-gradient-elegant bg-clip-text text-transparent mb-4">
            കലാവീര്യം
          </div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="h-1 bg-gradient-primary mx-auto"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <h2 className="text-4xl font-semibold text-foreground mb-2">
            Kalaveeryam
          </h2>
          <p className="text-2xl text-muted-foreground">
            MIAC Arts Fest
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="mt-8"
        >
          <div className="animate-pulse text-primary">
            Loading celebration...
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default IntroSplash;
