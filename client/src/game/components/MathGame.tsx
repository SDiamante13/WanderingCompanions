import { useState, useEffect } from "react";
import { usePlayerStore } from "../stores/usePlayerStore";
import { useGameStore } from "../stores/useGameStore";

interface MathGameProps {
  onClose?: () => void;
}

interface MathProblem {
  num1: number;
  num2: number;
  operation: "+" | "-";
  answer: number;
}

const MathGame = ({ onClose }: MathGameProps = {}) => {
  const [currentProblem, setCurrentProblem] = useState<MathProblem | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [totalProblems, setTotalProblems] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const { updateCoins } = usePlayerStore();
  const { closeDialog } = useGameStore();

  const generateProblem = (): MathProblem => {
    const operation = Math.random() > 0.5 ? "+" : "-";
    let num1, num2, answer;

    if (operation === "+") {
      num1 = Math.floor(Math.random() * 10) + 1; // 1-10
      num2 = Math.floor(Math.random() * 10) + 1; // 1-10
      answer = num1 + num2;
    } else {
      num1 = Math.floor(Math.random() * 15) + 5; // 5-20 to ensure positive results
      num2 = Math.floor(Math.random() * num1) + 1; // 1 to num1
      answer = num1 - num2;
    }

    return { num1, num2, operation, answer };
  };

  const startNewProblem = () => {
    const problem = generateProblem();
    setCurrentProblem(problem);
    setUserAnswer("");
    setShowFeedback(false);
    setFeedback("");
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setTotalProblems(0);
    startNewProblem();
  };

  const submitAnswer = () => {
    if (!currentProblem || userAnswer === "") return;

    const answer = parseInt(userAnswer);
    const correct = answer === currentProblem.answer;
    
    setIsCorrect(correct);
    setTotalProblems(totalProblems + 1);

    if (correct) {
      setScore(score + 1);
      setFeedback("Great job! 🎉");
      updateCoins(2); // Reward 2 coins for correct answer
    } else {
      setFeedback(`Not quite! The answer is ${currentProblem.answer}. Keep trying! 💪`);
    }

    setShowFeedback(true);

    // Auto-advance after 2 seconds
    setTimeout(() => {
      if (totalProblems + 1 >= 10) {
        endGame();
      } else {
        startNewProblem();
      }
    }, 2000);
  };

  const endGame = () => {
    const finalScore = isCorrect ? score + 1 : score;
    const accuracy = Math.round((finalScore / 10) * 100);
    let bonusCoins = 0;
    
    if (accuracy >= 90) {
      bonusCoins = 10;
    } else if (accuracy >= 70) {
      bonusCoins = 5;
    } else if (accuracy >= 50) {
      bonusCoins = 2;
    }

    if (bonusCoins > 0) {
      updateCoins(bonusCoins);
    }

    setFeedback(
      `Game Complete! 🎓\nScore: ${finalScore}/10 (${accuracy}%)\n${bonusCoins > 0 ? `Bonus: ${bonusCoins} coins!` : "Keep practicing!"}`
    );
    setShowFeedback(true);
    setGameStarted(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !showFeedback) {
      submitAnswer();
    }
  };

  const exitGame = () => {
    if (onClose) {
      onClose();
    } else {
      closeDialog();
    }
  };

  if (!gameStarted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 shadow-2xl w-96 max-w-full text-center">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">🧮 Math Challenge</h2>
          <p className="text-gray-700 mb-6">
            Practice addition and subtraction! Answer 10 problems and earn coins for correct answers.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="font-bold text-blue-800 mb-2">Rewards:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• 2 coins per correct answer</li>
              <li>• Bonus coins for high accuracy</li>
              <li>• 90%+ accuracy: 10 bonus coins</li>
              <li>• 70%+ accuracy: 5 bonus coins</li>
              <li>• 50%+ accuracy: 2 bonus coins</li>
            </ul>
          </div>
          <div className="flex gap-3">
            <button
              onClick={startGame}
              className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-full font-bold text-lg shadow-md hover:bg-blue-600 transition"
            >
              Start Game
            </button>
            <button
              onClick={exitGame}
              className="px-4 py-3 bg-gray-300 text-gray-700 rounded-full font-bold hover:bg-gray-400 transition"
            >
              Exit
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 shadow-2xl w-96 max-w-full text-center">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-left">
            <div className="text-sm text-gray-600">Problem {totalProblems + 1}/10</div>
            <div className="text-sm text-green-600 font-bold">Score: {score}</div>
          </div>
          <button
            onClick={exitGame}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {currentProblem && (
          <>
            {/* Math Problem */}
            <div className="bg-blue-50 rounded-xl p-8 mb-6">
              <div className="text-4xl font-bold text-blue-800 mb-4">
                {currentProblem.num1} {currentProblem.operation} {currentProblem.num2} = ?
              </div>
              
              {!showFeedback ? (
                <div className="flex items-center justify-center gap-4">
                  <input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-24 h-12 text-2xl text-center border-2 border-blue-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    placeholder="?"
                    autoFocus
                  />
                  <button
                    onClick={submitAnswer}
                    disabled={userAnswer === ""}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Submit
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className={`text-2xl font-bold ${isCorrect ? 'text-green-600' : 'text-orange-600'}`}>
                    {currentProblem.num1} {currentProblem.operation} {currentProblem.num2} = {currentProblem.answer}
                  </div>
                  <div className={`text-lg font-medium ${isCorrect ? 'text-green-600' : 'text-orange-600'}`}>
                    {feedback}
                  </div>
                  {isCorrect && (
                    <div className="text-yellow-600 font-bold">+2 coins earned! 🪙</div>
                  )}
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((totalProblems + (showFeedback ? 1 : 0)) / 10) * 100}%` }}
              ></div>
            </div>

            <div className="text-sm text-gray-600">
              Keep going! {10 - totalProblems - (showFeedback ? 1 : 0)} problems left
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MathGame;