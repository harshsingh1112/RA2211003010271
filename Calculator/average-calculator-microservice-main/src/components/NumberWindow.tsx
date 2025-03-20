
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NumberWindowProps {
  title: string;
  numbers: number[];
  isAnimated?: boolean;
  className?: string;
}

const NumberWindow: React.FC<NumberWindowProps> = ({ 
  title, 
  numbers, 
  isAnimated = false,
  className
}) => {
  return (
    <div className={cn("rounded-lg border bg-card p-4 shadow-sm", className)}>
      <h3 className="text-sm font-medium text-muted-foreground mb-2">{title}</h3>
      
      <div className="h-32 overflow-y-auto grid grid-cols-5 gap-2 p-1">
        {numbers.length === 0 ? (
          <div className="col-span-5 h-full flex items-center justify-center">
            <p className="text-muted-foreground text-sm">No numbers</p>
          </div>
        ) : (
          numbers.map((number, index) => (
            <motion.div
              key={`${number}-${index}`}
              initial={isAnimated ? { scale: 0.8, opacity: 0 } : false}
              animate={isAnimated ? { scale: 1, opacity: 1 } : false}
              transition={{ 
                duration: 0.4, 
                delay: index * 0.05, 
                ease: [0.16, 1, 0.3, 1] 
              }}
              className="flex items-center justify-center rounded-md bg-secondary p-2 text-sm font-medium"
            >
              {number}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default NumberWindow;
