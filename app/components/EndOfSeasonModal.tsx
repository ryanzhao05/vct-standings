"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface EndOfSeasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewCompleted: () => void;
  onResimulate: () => void;
}

export default function EndOfSeasonModal({
  isOpen,
  onClose,
  onViewCompleted,
  onResimulate,
}: EndOfSeasonModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div
        className={`relative bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-md mx-4 transform transition-all duration-200 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="text-2xl font-bold text-white mb-4">
            🏆 VCT Stage 2 Complete 🏆
          </div>

          <div className="text-gray-300 mb-6 space-y-3">
            <p>
              Thank you to the 20,000+ fans who have used VCT Standings
              throughout this season, the group standings are now complete!
            </p>
            <p>
              While the split is over, you can still jump back to week 1 and
              explore "what if" scenarios.
            </p>

            <p>
              I have various improvements that I will be making to VCT Standings
              in the near future, so stay tuned for the next split!
            </p>
            <p>
              In the mean time, feel free to contact me with the "Contact"
              button in the header :)
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onViewCompleted}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg transition-colors cursor-pointer flex-1"
            >
              View Completed Results
            </button>
            <button
              onClick={onResimulate}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors cursor-pointer flex-1"
            >
              Resimulate from Week 1
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
