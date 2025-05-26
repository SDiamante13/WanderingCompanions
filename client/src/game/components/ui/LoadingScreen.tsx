import React from "react";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-blue-100 flex flex-col items-center justify-center">
      <div className="w-64 h-64 relative">
        {/* Pet silhouette */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-40 h-40 bg-blue-300 rounded-full opacity-60 animate-pulse"></div>
        </div>
        
        {/* Game title */}
        <div className="absolute top-4 left-0 right-0 text-center">
          <h1 className="text-3xl font-bold text-blue-800">Adventure Pets</h1>
          <p className="text-blue-600 mt-1">Loading your adventure...</p>
        </div>
        
        {/* Loading animation */}
        <div className="absolute bottom-8 left-0 right-0">
          <div className="w-48 h-2 mx-auto bg-blue-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 animate-loading-bar"></div>
          </div>
          <p className="text-center text-blue-600 mt-2 text-sm">Preparing your pet companion...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;