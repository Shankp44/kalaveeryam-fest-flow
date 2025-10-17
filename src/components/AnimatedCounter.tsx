import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

interface AnimatedCounterProps {
  value: number;
}

const AnimatedCounter = ({ value }: AnimatedCounterProps) => {
  const spring = useSpring(0, { duration: 2000 });
  const display = useTransform(spring, (current) =>
    Math.round(current).toString()
  );

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return (
    <motion.div className="text-4xl font-bold text-primary">
      {display}
    </motion.div>
  );
};

export default AnimatedCounter;
