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
        <div className="flex space-x-1">
          {regions.map((region) => (
            <button
              key={region.id}
              onClick={() => onRegionChange(region.id)}
              className={`px-6 py-3 text-sm font-medium rounded-t-lg transition-colors cursor-pointer flex items-center space-x-2 ${
                selectedRegion === region.id
                  ? "bg-background text-foreground border-b-2 border-primary"
                  : "text-gray-400 hover:text-gray-300 hover:bg-accent"
              }`}
            >
              <Image
                src={region.icon}
                alt={`${region.name} region icon`}
                width={20}
                height={20}
                className="w-5 h-5"
              />
              <span>{region.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
