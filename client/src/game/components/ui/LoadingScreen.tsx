import React from "react";

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-primary flex flex-col items-center justify-center">
      <div className="text-white text-4xl font-fredoka mb-8">Pet Adventure</div>
      
      <div className="relative w-64 h-8 bg-white/20 rounded-full overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-full bg-white rounded-full animate-pulse-slow"
          style={{ width: '100%', animationDuration: '1.5s' }}
        />
      </div>
      
      <div className="mt-4 text-white font-fredoka">Loading your adventure...</div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-8 left-8 w-16 h-16 bg-secondary rounded-full animate-bounce-slow" />
      <div className="absolute top-8 right-8 w-12 h-12 bg-accent rounded-full animate-float" />
      <div className="absolute bottom-16 right-16 w-20 h-20 bg-white/10 rounded-full animate-pulse-slow" />
    </div>
  );
};

export default LoadingScreen;
