import Image from "next/image";

type Region = "americas" | "emea" | "pacific" | "china";

interface RegionTabsProps {
  selectedRegion: Region;
  onRegionChange: (region: Region) => void;
}

const regions = [
  { id: "americas", name: "Americas", icon: "/vct_icons/americas.png" },
  { id: "emea", name: "EMEA", icon: "/vct_icons/emea.png" },
  { id: "pacific", name: "Pacific", icon: "/vct_icons/pacific.png" },
  { id: "china", name: "China", icon: "/vct_icons/china.png" },
] as const;

export default function RegionTabs({
  selectedRegion,
  onRegionChange,
}: RegionTabsProps) {
  return (
    <div className="border-b border-border bg-card">
      <div className="container mx-auto px-4">
        <div className="flex space-x-1 overflow-x-auto">
          {regions.map((region) => (
            <button
              key={region.id}
              onClick={() => onRegionChange(region.id)}
              className={`px-3 lg:px-6 py-2 lg:py-3 text-xs lg:text-sm font-medium rounded-t-lg transition-colors cursor-pointer flex items-center space-x-1 lg:space-x-2 flex-shrink-0 ${
                selectedRegion === region.id
                  ? "bg-background text-foreground border-b-2 selected-region-border"
                  : "text-gray-400 hover:text-gray-300 hover:bg-accent"
              }`}
            >
              <Image
                src={region.icon}
                alt={`${region.name} region icon`}
                width={20}
                height={20}
                className="w-4 h-4 lg:w-5 lg:h-5"
              />
              <span>{region.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
