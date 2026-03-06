import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import { AlertCircle, Loader2, MapPin } from "lucide-react";
import type React from "react";
import { useState } from "react";
import PlaceSearchField from "../components/PlaceSearchField";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useAddEntry } from "../hooks/useQueries";
import type { GeocodingResult } from "../lib/geocoding";

const POPULAR_TRAILS = [
  { value: "", label: "Select a trail (optional)" },
  { value: "Appalachian Trail (USA)", label: "Appalachian Trail (USA)" },
  { value: "Pacific Crest Trail (USA)", label: "Pacific Crest Trail (USA)" },
  {
    value: "Continental Divide Trail (USA)",
    label: "Continental Divide Trail (USA)",
  },
  { value: "Te Araroa (New Zealand)", label: "Te Araroa (New Zealand)" },
  { value: "Camino de Santiago (Spain)", label: "Camino de Santiago (Spain)" },
  {
    value: "Tour du Mont Blanc (Europe)",
    label: "Tour du Mont Blanc (Europe)",
  },
  { value: "GR20 (Corsica, France)", label: "GR20 (Corsica, France)" },
  {
    value: "West Highland Way (Scotland)",
    label: "West Highland Way (Scotland)",
  },
  {
    value: "Milford Track (New Zealand)",
    label: "Milford Track (New Zealand)",
  },
  { value: "Overland Track (Australia)", label: "Overland Track (Australia)" },
  {
    value: "Everest Base Camp Trek (Nepal)",
    label: "Everest Base Camp Trek (Nepal)",
  },
  { value: "Inca Trail (Peru)", label: "Inca Trail (Peru)" },
  { value: "John Muir Trail (USA)", label: "John Muir Trail (USA)" },
  { value: "Long Trail (Vermont, USA)", label: "Long Trail (Vermont, USA)" },
  { value: "Florida Trail (USA)", label: "Florida Trail (USA)" },
  {
    value: "Ice Age Trail (Wisconsin, USA)",
    label: "Ice Age Trail (Wisconsin, USA)",
  },
  { value: "other", label: "Another trail…" },
];

export default function AddEntryPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { isFetching: actorFetching } = useActor();

  const [name, setName] = useState("");
  const [trailName, setTrailName] = useState("");
  const [comment, setComment] = useState("");
  const [currentLocation, setCurrentLocation] =
    useState<GeocodingResult | null>(null);
  const [favoritePlace, setFavoritePlace] = useState<GeocodingResult | null>(
    null,
  );
  const [selectedTrail, setSelectedTrail] = useState("");
  const [customTrail, setCustomTrail] = useState("");
  const [geoError, setGeoError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // identity is available for ownership tracking but sign-in is not required
  void identity;

  const addEntryMutation = useAddEntry();

  const handleUseMyLocation = () => {
    setGeoError(null);
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCurrentLocation({
          displayName: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setGeoError(
            "Location permission denied. Please search for your location manually.",
          );
        } else {
          setGeoError(
            "Unable to retrieve your location. Please search manually.",
          );
        }
      },
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!comment.trim()) {
      setSubmitError("Please enter a comment.");
      return;
    }

    if (actorFetching) {
      setSubmitError(
        "Still connecting to the network. Please wait a moment and try again.",
      );
      return;
    }

    // Build the enriched comment that encodes place names
    let enrichedComment = comment.trim();
    if (currentLocation) {
      enrichedComment += `\n[loc:${currentLocation.displayName}]`;
    }
    if (favoritePlace) {
      enrichedComment += `\n[fav:${favoritePlace.displayName}]`;
    }
    const trailLabel =
      selectedTrail === "other" ? customTrail.trim() : selectedTrail;
    if (trailLabel) {
      enrichedComment += `\n[trail:${trailLabel}]`;
    }

    try {
      await addEntryMutation.mutateAsync({
        name: name.trim() || null,
        trailName: trailName.trim() || null,
        comment: enrichedComment,
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
      setSubmitSuccess(true);
      setTimeout(() => navigate({ to: "/" }), 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setSubmitError(msg || "Failed to submit entry. Please try again.");
    }
  };

  if (submitSuccess) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center">
        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
          <div className="text-4xl mb-4">🥾</div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Entry Saved!
          </h2>
          <p className="text-muted-foreground">
            Your guestbook entry has been saved. Redirecting…
          </p>
        </div>
      </div>
    );
  }

  const isSubmitDisabled = addEntryMutation.isPending || actorFetching;

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-1">
        Sign the Guestbook
      </h1>
      <p className="text-muted-foreground mb-6 text-sm">
        Share your trail story with the VTH community.
      </p>

      {actorFetching && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 bg-muted rounded-lg px-3 py-2">
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
          <span>Connecting to the network…</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label htmlFor="name">
            Your Name <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Trail name or real name"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="trailName">
            Trail Name / Alias{" "}
            <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="trailName"
            value={trailName}
            onChange={(e) => setTrailName(e.target.value)}
            placeholder="e.g. Ridgerunner, Blaze"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="comment">
            Your Message <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your trail story, thoughts, or greetings…"
            rows={4}
            className="mt-1"
            required
          />
        </div>

        <div>
          <Label>
            Current Location{" "}
            <span className="text-muted-foreground">(optional)</span>
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
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleUseMyLocation}
              className="flex items-center gap-1"
            >
              <MapPin className="w-3 h-3" />
              Use My GPS Location
            </Button>
            {geoError && <p className="text-destructive text-xs">{geoError}</p>}
          </div>
        </div>

        <div>
          <Label>
            Favorite Location on the Trail{" "}
            <span className="text-muted-foreground">(optional)</span>
          </Label>
          <div className="mt-1 space-y-2">
            {/* Trail selector dropdown */}
            <select
              data-ocid="favorite.trail_select"
              value={selectedTrail}
              onChange={(e) => setSelectedTrail(e.target.value)}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {POPULAR_TRAILS.map((trail) => (
                <option key={trail.value} value={trail.value}>
                  {trail.label}
                </option>
              ))}
            </select>

            {/* Custom trail input when "Another trail…" is selected */}
            {selectedTrail === "other" && (
              <Input
                data-ocid="favorite.custom_trail.input"
                value={customTrail}
                onChange={(e) => setCustomTrail(e.target.value)}
                placeholder="Enter trail name…"
                className="mt-1"
              />
            )}

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

        {submitError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitDisabled}>
          {addEntryMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving…
            </>
          ) : actorFetching ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Connecting…
            </>
          ) : (
            "Sign the Guestbook"
          )}
        </Button>
      </form>
    </div>
  );
}
