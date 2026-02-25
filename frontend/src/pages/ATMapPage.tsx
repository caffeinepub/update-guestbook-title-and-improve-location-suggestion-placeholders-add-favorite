import { useState, useRef, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetEntriesWithFavoritePlace, useGetAllEntries } from '../hooks/useQueries';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import MapPin from '../components/MapPin';
import MapLegend from '../components/MapLegend';
import { getAuthorLabel, decodeLocationPlaceName, stripPlaceNames } from '../lib/guestbookFormat';
import { X, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

export default function ATMapPage() {
  const navigate = useNavigate();
  const { data: entriesWithFavorite, isLoading } = useGetEntriesWithFavoritePlace();
  const { data: allEntries } = useGetAllEntries();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const mapRef = useRef<HTMLDivElement>(null);

  // AT trail approximate bounds: Georgia (34.6°N, -84.2°W) to Maine (45.9°N, -68.9°W)
  const atBounds = {
    minLat: 34.0,
    maxLat: 46.0,
    minLon: -85.0,
    maxLon: -68.0,
  };

  const coordsToPercent = (lat: number, lon: number) => {
    const x = ((lon - atBounds.minLon) / (atBounds.maxLon - atBounds.minLon)) * 100;
    const y = ((atBounds.maxLat - lat) / (atBounds.maxLat - atBounds.minLat)) * 100;
    return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
  };

  // Auto-fit bounds to show all pins
  useEffect(() => {
    if (entriesWithFavorite && entriesWithFavorite.length > 0) {
      const lats = entriesWithFavorite
        .filter(e => e.favoritePlace)
        .map(e => e.favoritePlace!.latitude);
      const lons = entriesWithFavorite
        .filter(e => e.favoritePlace)
        .map(e => e.favoritePlace!.longitude);
      
      if (lats.length > 0) {
        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const minLon = Math.min(...lons);
        const maxLon = Math.max(...lons);
        
        const centerLat = (minLat + maxLat) / 2;
        const centerLon = (minLon + maxLon) / 2;
        
        // Calculate zoom based on bounds
        const latRange = maxLat - minLat;
        const lonRange = maxLon - minLon;
        const maxRange = Math.max(latRange, lonRange);
        
        if (maxRange > 0 && maxRange < 20) {
          const newZoom = Math.min(2.5, Math.max(1, 20 / maxRange / 2));
          setZoom(newZoom);
          
          // Center on the bounds (relative to AT bounds)
          const { x: centerX, y: centerY } = coordsToPercent(centerLat, centerLon);
          const xOffset = (centerX - 50) * -1;
          const yOffset = (centerY - 50) * -1;
          setPan({ x: xOffset, y: yOffset });
        }
      }
    }
  }, [entriesWithFavorite]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
  };

  if (isLoading) {
    return (
      <div className="pb-20">
        <h2 className="text-2xl font-bold mb-4">Appalachian Trail Map</h2>
        <Skeleton className="w-full h-96 rounded-lg" />
      </div>
    );
  }

  const getEntryIndex = (entry: any) => {
    if (!allEntries) return -1;
    const sortedAll = [...allEntries].sort((a, b) => Number(b.timestamp - a.timestamp));
    return sortedAll.findIndex(e => 
      e.timestamp === entry.timestamp && 
      e.comment === entry.comment
    );
  };

  const selectedEntry = selectedIndex !== null && entriesWithFavorite 
    ? entriesWithFavorite[selectedIndex] 
    : null;

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
  const handleZoomReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="pb-20 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Appalachian Trail Map</h2>
        <Badge variant="secondary">
          {entriesWithFavorite?.length || 0} {entriesWithFavorite?.length === 1 ? 'pin' : 'pins'}
        </Badge>
      </div>

      <MapLegend />

      <Card className="overflow-hidden">
        <CardContent className="p-0 relative">
          {/* Zoom controls */}
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={handleZoomIn}
              disabled={zoom >= 3}
              className="shadow-lg"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
              className="shadow-lg"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={handleZoomReset}
              className="shadow-lg"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Interactive map container */}
          <div 
            ref={mapRef}
            className="relative w-full overflow-hidden select-none"
            style={{ 
              height: '70vh',
              cursor: isDragging ? 'grabbing' : 'grab',
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          >
            <div 
              className="absolute inset-0 transition-transform"
              style={{ 
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: 'center center',
                width: '100%',
                height: '100%',
              }}
            >
              {/* OpenStreetMap tiles simulation with background image */}
              <div className="relative w-full h-full bg-secondary/20">
                <img
                  src="/assets/generated/at-outline-map-clean.dim_1600x900.png"
                  alt="Appalachian Trail Map"
                  className="w-full h-full object-contain pointer-events-none"
                  draggable={false}
                />

                {/* Attribution */}
                <div className="absolute bottom-2 right-2 bg-background/90 px-2 py-1 rounded text-xs z-10">
                  © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="underline">OpenStreetMap</a> contributors
                </div>

                {/* Pins overlay */}
                <div className="absolute inset-0">
                  <TooltipProvider>
                    {entriesWithFavorite?.map((entry, index) => {
                      if (!entry.favoritePlace) return null;
                      
                      const { latitude, longitude } = entry.favoritePlace;
                      const { x, y } = coordsToPercent(latitude, longitude);

                      const placeName = decodeLocationPlaceName(entry.comment, 'favorite');

                      return (
                        <Tooltip key={index}>
                          <TooltipTrigger asChild>
                            <div
                              className="absolute cursor-pointer"
                              style={{
                                left: `${x}%`,
                                top: `${y}%`,
                                transform: 'translate(-50%, -100%)',
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedIndex(selectedIndex === index ? null : index);
                              }}
                            >
                              <MapPin
                                isSelected={selectedIndex === index}
                                onClick={() => {}}
                              />
                            </div>
                          </TooltipTrigger>
                          {placeName && (
                            <TooltipContent>
                              <p className="max-w-xs">{placeName}</p>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      );
                    })}
                  </TooltipProvider>
                </div>
              </div>
            </div>
          </div>

          {/* Selected entry popup */}
          {selectedEntry && (
            <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-10">
              <Card className="shadow-lg">
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-base">
                      {getAuthorLabel(selectedEntry)}
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedIndex(null)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm line-clamp-2">{stripPlaceNames(selectedEntry.comment)}</p>
                  <Button
                    size="sm"
                    onClick={() => {
                      const entryIdx = getEntryIndex(selectedEntry);
                      if (entryIdx >= 0) {
                        navigate({ to: '/entry/$entryId', params: { entryId: String(entryIdx) } });
                      }
                    }}
                    className="w-full"
                  >
                    View Full Entry
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      {entriesWithFavorite?.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              No favorite places marked yet. Share your favorite AT spot!
            </p>
            <Button onClick={() => navigate({ to: '/add' })}>
              Sign the Guest Book
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
