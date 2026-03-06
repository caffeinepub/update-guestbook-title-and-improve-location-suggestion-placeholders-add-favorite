import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Loader2, MapPin } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import type { GuestbookEntry } from "../backend";
import { useUpdateEntry } from "../hooks/useQueries";
import type { GeocodingResult } from "../lib/geocoding";
import { decodeComment, decodePlaceNames } from "../lib/guestbookFormat";
import PlaceSearchField from "./PlaceSearchField";

interface EditEntryDialogProps {
  entry: GuestbookEntry;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditEntryDialog({
  entry,
  open,
  onOpenChange,
}: EditEntryDialogProps) {
  const updateEntry = useUpdateEntry();

  const [name, setName] = useState("");
  const [trailName, setTrailName] = useState("");
  const [comment, setComment] = useState("");
  const [currentLocation, setCurrentLocation] =
    useState<GeocodingResult | null>(null);
  const [favoritePlace, setFavoritePlace] = useState<GeocodingResult | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  // Re-initialize form fields whenever the dialog opens or entry changes
  useEffect(() => {
    if (open) {
      const { cleanComment } = decodeComment(entry.comment);
      const { currentLocationName, favoritePlaceName } = decodePlaceNames(
        entry.comment,
      );

      setName(entry.name || "");
      setTrailName(entry.trailName || "");
      setComment(cleanComment);

      setCurrentLocation(
        entry.currentLocation
          ? {
              displayName:
                currentLocationName ||
                `${entry.currentLocation.latitude.toFixed(4)}, ${entry.currentLocation.longitude.toFixed(4)}`,
              latitude: entry.currentLocation.latitude,
              longitude: entry.currentLocation.longitude,
            }
          : null,
      );

      setFavoritePlace(
        entry.favoritePlace
          ? {
              displayName:
                favoritePlaceName ||
                `${entry.favoritePlace.latitude.toFixed(4)}, ${entry.favoritePlace.longitude.toFixed(4)}`,
              latitude: entry.favoritePlace.latitude,
              longitude: entry.favoritePlace.longitude,
            }
          : null,
      );

      setError(null);
    }
  }, [open, entry]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!comment.trim()) {
      setError("Comment cannot be empty.");
      return;
    }

    let enrichedComment = comment.trim();
    if (currentLocation) {
      enrichedComment += `\n[loc:${currentLocation.displayName}]`;
    }
    if (favoritePlace) {
      enrichedComment += `\n[fav:${favoritePlace.displayName}]`;
    }

    try {
      await updateEntry.mutateAsync({
        timestamp: entry.timestamp,
        name: name.trim() || null,
        trailName: trailName.trim() || null,
        newComment: enrichedComment,
        currentLocation: currentLocation
          ? {
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }
          : null,
        favoritePlace: favoritePlace
          ? {
              latitude: favoritePlace.latitude,
              longitude: favoritePlace.longitude,
            }
          : null,
      });
      onOpenChange(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || "Failed to update entry. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Entry</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="edit-name">
              Name{" "}
              <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name or trail name"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="edit-trailName">
              Trail Name{" "}
              <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <Input
              id="edit-trailName"
              value={trailName}
              onChange={(e) => setTrailName(e.target.value)}
              placeholder="e.g. Ridgerunner, Blaze"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="edit-comment">
              Message <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="edit-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label>
              Current Location{" "}
              <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <div className="mt-1 space-y-2">
              {currentLocation && (
                <div className="flex items-center gap-2 text-sm bg-muted rounded-lg px-3 py-2">
                  <MapPin className="w-3 h-3 text-primary shrink-0" />
                  <span className="flex-1 truncate text-foreground">
                    {currentLocation.displayName}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentLocation(null)}
                    className="text-muted-foreground hover:text-destructive text-xs ml-1"
                  >
                    ✕
                  </button>
                </div>
              )}
              <PlaceSearchField
                label=""
                placeholder="Search for your current location…"
                onSelect={(result) => setCurrentLocation(result)}
              />
            </div>
          </div>

          <div>
            <Label>
              Favorite Location on the Trail{" "}
              <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <div className="mt-1 space-y-2">
              {favoritePlace && (
                <div className="flex items-center gap-2 text-sm bg-muted rounded-lg px-3 py-2">
                  <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                  <span className="flex-1 truncate text-foreground">
                    {favoritePlace.displayName}
                  </span>
                  <button
                    type="button"
                    onClick={() => setFavoritePlace(null)}
                    className="text-muted-foreground hover:text-destructive text-xs ml-1"
                  >
                    ✕
                  </button>
                </div>
              )}
              <PlaceSearchField
                label=""
                placeholder="Search for your favorite trail spot…"
                onSelect={(result) => setFavoritePlace(result)}
              />
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateEntry.isPending}>
              {updateEntry.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving…
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
