import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MapPinProps {
  isSelected?: boolean;
  onClick?: () => void;
}

export default function MapPin({ isSelected = false, onClick }: MapPinProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={cn(
        "h-8 w-8 p-0 rounded-full transition-all hover:scale-110",
        isSelected && "scale-125",
      )}
      aria-label="Map pin"
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-md"
        aria-hidden="true"
      >
        <title>Map pin</title>
        <path
          d="M16 4C11.5817 4 8 7.58172 8 12C8 17.5 16 28 16 28C16 28 24 17.5 24 12C24 7.58172 20.4183 4 16 4Z"
          fill={isSelected ? "oklch(var(--primary))" : "oklch(var(--chart-1))"}
          stroke="white"
          strokeWidth="2"
        />
        <circle cx="16" cy="12" r="3" fill="white" />
      </svg>
    </Button>
  );
}
