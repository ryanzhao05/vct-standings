type Region = "americas" | "emea" | "pacific" | "china";

interface RegionTabsProps {
  selectedRegion: Region;
  onRegionChange: (region: Region) => void;
}

const regions = [
  { id: "americas", name: "Americas" },
  { id: "emea", name: "EMEA" },
  { id: "pacific", name: "Pacific" },
  { id: "china", name: "China" },
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
              className={`px-6 py-3 text-sm font-medium rounded-t-lg transition-colors ${
                selectedRegion === region.id
                  ? "bg-background text-foreground border-b-2 border-primary"
                  : "text-gray-400 hover:text-gray-300 hover:bg-accent"
              }`}
            >
              {region.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
