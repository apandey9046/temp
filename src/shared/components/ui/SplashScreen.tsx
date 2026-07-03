import React from 'react';
import { motion } from 'framer-motion';

export const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center"
      >
        <div className="w-16 h-16 bg-primary rounded-2xl mb-6 shadow-premium flex items-center justify-center">
          <div className="w-8 h-1 bg-white rounded-full rotate-45 translate-y-[2px]" />
          <div className="w-8 h-1 bg-white rounded-full -rotate-45 -translate-y-[2px]" />
        </div>
        <h1 className="text-2xl font-bold font-fredoka tracking-tight text-primary">Notes</h1>
        <div className="mt-8 flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0.3 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
                repeatType: 'reverse',
              }}
              className="w-1.5 h-1.5 rounded-full bg-muted"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};
