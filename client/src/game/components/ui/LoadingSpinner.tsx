import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  type?: 'bounce' | 'spin' | 'pulse' | 'pets';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "Loading...", 
  size = 'medium',
  type = 'pets'
}) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-16 h-16', 
    large: 'w-24 h-24'
  };

  const textSizes = {
    small: 'text-sm',
    medium: 'text-lg',
    large: 'text-xl'
  };

  if (type === 'pets') {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="relative">
          {/* Rotating pets */}
          <div className="animate-spin duration-2000">
            <div className="relative w-20 h-20">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-2xl">🐶</div>
              <div className="absolute top-1/2 right-0 transform -translate-y-1/2 text-2xl">🐱</div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-2xl">🐰</div>
              <div className="absolute top-1/2 left-0 transform -translate-y-1/2 text-2xl">🐦</div>
            </div>
          </div>
          {/* Center heart */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl animate-pulse">
            ❤️
          </div>
        </div>
        <div className={`mt-4 font-bold text-blue-600 ${textSizes[size]} animate-pulse`}>
          {message}
        </div>
      </div>
    );
  }

  if (type === 'bounce') {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`${sizeClasses[size]} bg-blue-500 rounded-full animate-bounce`}
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
        <div className={`mt-4 font-bold text-blue-600 ${textSizes[size]}`}>
          {message}
        </div>
      </div>
    );
  }

  if (type === 'pulse') {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className={`${sizeClasses[size]} bg-blue-500 rounded-full animate-pulse`} />
        <div className={`mt-4 font-bold text-blue-600 ${textSizes[size]} animate-pulse`}>
          {message}
        </div>
      </div>
    );
  }

  // Default spin type
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`${sizeClasses[size]} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin`} />
      <div className={`mt-4 font-bold text-blue-600 ${textSizes[size]}`}>
        {message}
      </div>
    </div>
  );
};

export default LoadingSpinner;