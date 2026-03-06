import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";

export default function MapLegend() {
  return (
    <Card className="bg-muted/50">
      <CardContent className="py-3 px-4">
        <div className="flex items-start gap-2 text-sm">
          <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <p className="text-muted-foreground">
            <strong className="text-foreground">Tap a pin</strong> to see who
            placed it and view their full entry
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
