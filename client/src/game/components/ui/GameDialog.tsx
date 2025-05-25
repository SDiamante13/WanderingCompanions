import React from "react";
import GameButton from "./GameButton";
import GameText from "./GameText";

interface GameDialogProps {
  title: string;
  message: string;
  onClose?: () => void;
  actions?: {
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary" | "accent" | "outline";
  }[];
}

const GameDialog: React.FC<GameDialogProps> = ({
  title,
  message,
  onClose,
  actions = [],
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-lg border-4 border-primary max-w-md w-full animate-float">
        {/* Header */}
        <div className="p-4 bg-primary text-white">
          <GameText variant="heading" color="foreground" className="text-white">
            {title}
          </GameText>
        </div>
        
        {/* Message */}
        <div className="p-6">
          <GameText variant="body" comic className="whitespace-pre-line">
            {message}
          </GameText>
        </div>
        
        {/* Actions */}
        <div className="p-4 flex justify-end gap-3 border-t border-gray-100">
          {actions && actions.length > 0 ? (
            actions.map((action, index) => (
              <GameButton
                key={index}
                variant={action.variant || "primary"}
                onClick={action.onClick}
              >
                {action.label}
              </GameButton>
            ))
          ) : (
            <GameButton variant="primary" onClick={onClose}>
              Close
            </GameButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameDialog;
