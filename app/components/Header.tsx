import { RotateCcw, Share2, Mail } from "lucide-react";
import Image from "next/image";

interface HeaderProps {
  selectedRegion: string;
  onResetAll: () => void;
  onShareLink: () => void;
  onContactClick: () => void;
}

export default function Header({
  selectedRegion,
  onResetAll,
  onShareLink,
  onContactClick,
}: HeaderProps) {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4 lg:py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg flex items-center justify-center">
                <Image
                  src="/vct_logo.png"
                  alt="VCT Logo"
                  width={40}
                  height={40}
                  className="w-6 h-6 lg:w-8 lg:h-8"
                />
              </div>
              <h1 className="text-2xl lg:text-4xl font-bold text-white">
                VCT Standings Simulator
              </h1>
            </div>
            <p className="text-gray-300 mt-1 lg:mt-2 text-sm lg:text-base">
              Predict match outcomes and see how your favorite teams can qualify
              for playoffs!
            </p>
            <p className="text-gray-400 mt-1 lg:mt-1 text-xs lg:text-sm">
              Note: Each map prediction is assumed to be 13-9, custom round
              predictions coming soon!
            </p>
            <p className="text-gray-200 font-semibold mt-1 text-sm lg:text-base">
              2025 {selectedRegion} Stage 2
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
            <button
              onClick={onResetAll}
              className="flex items-center justify-center gap-2 px-3 py-2 lg:px-4 lg:py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-accent transition-colors cursor-pointer text-sm lg:text-base"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">
                Reset Current Region Predictions
              </span>
              <span className="sm:hidden">Reset Predictions</span>
            </button>
            <button
              onClick={onContactClick}
              className="flex items-center justify-center gap-2 px-3 py-2 lg:px-4 lg:py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/80 transition-colors cursor-pointer text-sm lg:text-base"
            >
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline">Contact</span>
              <span className="sm:hidden">Contact</span>
            </button>
            <button
              onClick={onShareLink}
              className="flex items-center justify-center gap-2 px-3 py-2 lg:px-4 lg:py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors cursor-pointer text-sm lg:text-base"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
