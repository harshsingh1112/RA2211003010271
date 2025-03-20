
import React from 'react';
import Header from '@/components/Header';
import Calculator from '@/components/Calculator';
import { motion } from 'framer-motion';

const Index = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col bg-gray-50"
    >
      <Header />
      <main className="flex-1 overflow-auto">
        <Calculator />
      </main>
      <footer className="w-full py-4 px-6 md:px-12 bg-white/80 backdrop-blur-lg border-t border-gray-100">
        <div className="container flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Average Calculator Microservice
          </p>
          <div className="text-sm text-muted-foreground">
            Window Size: 10
          </div>
        </div>
      </footer>
    </motion.div>
  );
};

export default Index;
