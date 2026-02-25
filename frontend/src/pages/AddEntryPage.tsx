import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAddEntry } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, MapPin, Mountain, Locate } from 'lucide-react';
import type { Location } from '../backend';
import type { GeocodingResult } from '../lib/geocoding';
import PlaceSearchField from '../components/PlaceSearchField';
import { encodeLocationPlaceName } from '../lib/guestbookFormat';

export default function AddEntryPage() {
  const navigate = useNavigate();
  const addEntry = useAddEntry();

  const [name, setName] = useState('');
  const [trailName, setTrailName] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  // Current location state
  const [currentLat, setCurrentLat] = useState('');
  const [currentLon, setCurrentLon] = useState('');
  const [currentPlaceName, setCurrentPlaceName] = useState('');
  const [gettingLocation, setGettingLocation] = useState(false);

  // Favorite place state
  const [favLat, setFavLat] = useState('');
  const [favLon, setFavLon] = useState('');
  const [favPlaceName, setFavPlaceName] = useState('');

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setGettingLocation(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLat(position.coords.latitude.toFixed(6));
        setCurrentLon(position.coords.longitude.toFixed(6));
        setCurrentPlaceName('');
        setGettingLocation(false);
      },
      (err) => {
        setError(`Unable to get location: ${err.message}`);
        setGettingLocation(false);
      }
    );
  };

  const handleSelectCurrentPlace = (result: GeocodingResult) => {
    setCurrentLat(result.latitude.toFixed(6));
    setCurrentLon(result.longitude.toFixed(6));
    setCurrentPlaceName(result.displayName);
  };

  const handleSelectFavoritePlace = (result: GeocodingResult) => {
    setFavLat(result.latitude.toFixed(6));
    setFavLon(result.longitude.toFixed(6));
    setFavPlaceName(result.displayName);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!comment.trim()) {
      setError('Please enter a comment');
      return;
    }

    const currentLocation: Location | null =
      currentLat && currentLon
        ? { latitude: parseFloat(currentLat), longitude: parseFloat(currentLon) }
        : null;

    const favoritePlace: Location | null =
      favLat && favLon
        ? { latitude: parseFloat(favLat), longitude: parseFloat(favLon) }
        : null;

    // Encode place names into comment
    let enrichedComment = comment;
    if (currentLocation && currentPlaceName) {
      enrichedComment = encodeLocationPlaceName(enrichedComment, currentPlaceName, 'current');
    }
    if (favoritePlace && favPlaceName) {
      enrichedComment = encodeLocationPlaceName(enrichedComment, favPlaceName, 'favorite');
    }

    try {
      await addEntry.mutateAsync({
        name,
        trailName,
        comment: enrichedComment,
        currentLocation,
        favoritePlace,
      });
      navigate({ to: '/' });
    } catch (err: any) {
      setError(err.message || 'Failed to add entry');
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-20">
      <h2 className="text-2xl font-bold mb-6">Sign the Guest Book</h2>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Your Entry</CardTitle>
            <CardDescription>
              Share your connection to the Appalachian Trail
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name (optional)</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trailName">Trail Name (optional)</Label>
                <Input
                  id="trailName"
                  value={trailName}
                  onChange={(e) => setTrailName(e.target.value)}
                  placeholder="Your trail name"
                />
              </div>
            </div>

            {/* Comment */}
            <div className="space-y-2">
              <Label htmlFor="comment">Comment *</Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your story, memories, or connection to the trail..."
                rows={5}
                required
              />
            </div>

            <Separator />

            {/* Current Location */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <Label className="text-base font-semibold">Current Location (optional)</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Where are you signing from?
              </p>

              <PlaceSearchField
                label="Search for your location"
                placeholder="My home town"
                onSelect={handleSelectCurrentPlace}
              />

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGetCurrentLocation}
                  disabled={gettingLocation}
                >
                  {gettingLocation ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Getting location...
                    </>
                  ) : (
                    <>
                      <Locate className="h-4 w-4 mr-2" />
                      Use my location
                    </>
                  )}
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="currentLat" className="text-sm">
                    Latitude
                  </Label>
                  <Input
                    id="currentLat"
                    type="number"
                    step="any"
                    value={currentLat}
                    onChange={(e) => {
                      setCurrentLat(e.target.value);
                      setCurrentPlaceName('');
                    }}
                    placeholder="e.g., 40.7128"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentLon" className="text-sm">
                    Longitude
                  </Label>
                  <Input
                    id="currentLon"
                    type="number"
                    step="any"
                    value={currentLon}
                    onChange={(e) => {
                      setCurrentLon(e.target.value);
                      setCurrentPlaceName('');
                    }}
                    placeholder="e.g., -74.0060"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Favorite AT Place */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mountain className="h-5 w-5 text-primary" />
                <Label className="text-base font-semibold">Favorite AT Place (optional)</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Mark your favorite spot on the Appalachian Trail
              </p>

              <PlaceSearchField
                label="Search for AT location"
                placeholder="e.g., Springer Mtn, Mt. Katahdin"
                onSelect={handleSelectFavoritePlace}
              />

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="favLat" className="text-sm">
                    Latitude
                  </Label>
                  <Input
                    id="favLat"
                    type="number"
                    step="any"
                    value={favLat}
                    onChange={(e) => {
                      setFavLat(e.target.value);
                      setFavPlaceName('');
                    }}
                    placeholder="e.g., 34.6267"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="favLon" className="text-sm">
                    Longitude
                  </Label>
                  <Input
                    id="favLon"
                    type="number"
                    step="any"
                    value={favLon}
                    onChange={(e) => {
                      setFavLon(e.target.value);
                      setFavPlaceName('');
                    }}
                    placeholder="e.g., -84.1937"
                  />
                </div>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate({ to: '/' })}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={addEntry.isPending}
                className="flex-1"
              >
                {addEntry.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Signing...
                  </>
                ) : (
                  'Sign Guest Book'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
