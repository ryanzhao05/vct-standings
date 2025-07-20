import { RotateCcw, Share2 } from "lucide-react";
import Image from "next/image";

interface HeaderProps {
  selectedRegion: string;
  onResetAll: () => void;
  onShareLink: () => void;
}

export default function Header({
  selectedRegion,
  onResetAll,
  onShareLink,
}: HeaderProps) {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                <Image
                  src="/vct_logo.png"
                  alt="VCT Logo"
                  width={40}
                  height={40}
                />
              </div>
              <h1 className="text-4xl font-bold text-white">
                VCT Standings Simulator
              </h1>
            </div>
            <p className="text-gray-300 mt-2">
              Predict match outcomes and see playoff scenarios
            </p>
            <p className="text-gray-200 font-semibold mt-1">
              2025 {selectedRegion} Stage 2
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onResetAll}
              className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-accent transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset All
            </button>
            <button
              onClick={onShareLink}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share Link
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
