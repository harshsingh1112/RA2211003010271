
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-6 md:px-12 flex items-center justify-between bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center animate-fade-in">
          <span className="text-white font-semibold text-sm">μS</span>
        </div>
        <div className="flex flex-col animate-slide-in">
          <span className="text-sm font-medium text-muted-foreground">Elegant Design</span>
          <h1 className="text-xl font-medium">Average Calculator</h1>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="px-3 py-1 rounded-full bg-secondary text-xs font-medium text-secondary-foreground">
          Microservice
        </div>
      </div>
    </header>
  );
};

export default Header;
