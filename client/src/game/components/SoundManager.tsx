import { useEffect } from "react";
import { useAudio } from "../../lib/stores/useAudio";
import { useGameStore } from "../stores/useGameStore";
import { GamePhase } from "../types";

const SoundManager = () => {
  const { backgroundMusic, toggleMute, isMuted } = useAudio();
  const gamePhase = useGameStore((state) => state.gamePhase);

  // Start or stop background music based on game phase
  useEffect(() => {
    if (!backgroundMusic) return;

    // Play music in all phases except the welcome screen
    if (gamePhase !== GamePhase.welcome) {
      if (!isMuted) {
        backgroundMusic.play().catch((error) => {
          console.log("Background music play prevented:", error);
        });
      }
    } else {
      backgroundMusic.pause();
      backgroundMusic.currentTime = 0;
    }

    return () => {
      backgroundMusic.pause();
    };
  }, [gamePhase, backgroundMusic, isMuted]);

  // Handle keyboard shortcut for mute/unmute (M key)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "KeyM") {
        toggleMute();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [toggleMute]);

  // Mute button in the corner
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={toggleMute}
        className="bg-white p-3 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
        aria-label={isMuted ? "Unmute" : "Mute"}
        title={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="1" y1="1" x2="23" y2="23"></line>
            <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
            <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
            <line x1="12" y1="19" x2="12" y2="23"></line>
            <line x1="8" y1="23" x2="16" y2="23"></line>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
            <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
          </svg>
        )}
      </button>
    </div>
  );
};

export default SoundManager;
