import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useAddEntry } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import PlaceSearchField from '../components/PlaceSearchField';
import type { GeocodingResult } from '../lib/geocoding';
import { MapPin, Loader2, AlertCircle, LogIn } from 'lucide-react';

export default function AddEntryPage() {
  const navigate = useNavigate();
  const { identity, login, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const [name, setName] = useState('');
  const [trailName, setTrailName] = useState('');
  const [comment, setComment] = useState('');
  const [currentLocation, setCurrentLocation] = useState<GeocodingResult | null>(null);
  const [favoritePlace, setFavoritePlace] = useState<GeocodingResult | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const addEntryMutation = useAddEntry();

  const handleUseMyLocation = () => {
    setGeoError(null);
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
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
          setGeoError('Location permission denied. Please search for your location manually.');
        } else {
          setGeoError('Unable to retrieve your location. Please search manually.');
        }
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!comment.trim()) {
      setSubmitError('Please enter a comment.');
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

    try {
      await addEntryMutation.mutateAsync({
        name: name.trim() || null,
        trailName: trailName.trim() || null,
        comment: enrichedComment,
        currentLocation: currentLocation
          ? { latitude: currentLocation.latitude, longitude: currentLocation.longitude }
          : null,
        favoritePlace: favoritePlace
          ? { latitude: favoritePlace.latitude, longitude: favoritePlace.longitude }
          : null,
      });
      setSubmitSuccess(true);
      setTimeout(() => navigate({ to: '/' }), 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setSubmitError(msg || 'Failed to submit entry. Please try again.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center">
        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
          <LogIn className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Sign In to Sign the Guestbook</h2>
          <p className="text-muted-foreground mb-6">
            You need to be logged in to add an entry to the VTH Guest Book. Your identity is secured
            by the Internet Computer — no passwords required.
          </p>
          <Button
            onClick={login}
            disabled={isLoggingIn}
            className="w-full"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Logging in...
              </>
            ) : (
              'Login / Create Account'
            )}
          </Button>
        </div>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center">
        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
          <div className="text-4xl mb-4">🥾</div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Entry Saved!</h2>
          <p className="text-muted-foreground">Your guestbook entry has been saved. Redirecting…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-1">Sign the Guestbook</h1>
      <p className="text-muted-foreground mb-6 text-sm">
        Share your trail story with the VTH community.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label htmlFor="name">Your Name <span className="text-muted-foreground">(optional)</span></Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Trail name or real name"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="trailName">Trail Name / Alias <span className="text-muted-foreground">(optional)</span></Label>
          <Input
            id="trailName"
            value={trailName}
            onChange={(e) => setTrailName(e.target.value)}
            placeholder="e.g. Ridgerunner, Blaze"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="comment">Your Message <span className="text-destructive">*</span></Label>
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
          <Label>Current Location <span className="text-muted-foreground">(optional)</span></Label>
          <div className="mt-1 space-y-2">
            {currentLocation && (
              <div className="flex items-center gap-2 text-sm bg-muted rounded-lg px-3 py-2">
                <MapPin className="w-3 h-3 text-primary shrink-0" />
                <span className="flex-1 truncate text-foreground">{currentLocation.displayName}</span>
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
            {geoError && (
              <p className="text-destructive text-xs">{geoError}</p>
            )}
          </div>
        </div>

        <div>
          <Label>Favorite AT Location <span className="text-muted-foreground">(optional)</span></Label>
          <div className="mt-1 space-y-2">
            {favoritePlace && (
              <div className="flex items-center gap-2 text-sm bg-muted rounded-lg px-3 py-2">
                <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                <span className="flex-1 truncate text-foreground">{favoritePlace.displayName}</span>
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
              placeholder="Search for your favorite AT spot…"
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

        <Button
          type="submit"
          className="w-full"
          disabled={addEntryMutation.isPending}
        >
          {addEntryMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving…
            </>
          ) : (
            'Sign the Guestbook'
          )}
        </Button>
      </form>
    </div>
  );
}
