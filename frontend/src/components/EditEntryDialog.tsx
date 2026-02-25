import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, MapPin, Mountain } from 'lucide-react';
import type { GuestbookEntry, Location } from '../backend';
import type { GeocodingResult } from '../lib/geocoding';
import PlaceSearchField from './PlaceSearchField';
import { useUpdateEntry } from '../hooks/useQueries';
import { encodeLocationPlaceName, decodeLocationPlaceName, stripPlaceNames } from '../lib/guestbookFormat';

interface EditEntryDialogProps {
  entry: GuestbookEntry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditEntryDialog({ entry, open, onOpenChange }: EditEntryDialogProps) {
  const updateEntry = useUpdateEntry();

  const [name, setName] = useState('');
  const [trailName, setTrailName] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  // Current location state
  const [currentLat, setCurrentLat] = useState('');
  const [currentLon, setCurrentLon] = useState('');
  const [currentPlaceName, setCurrentPlaceName] = useState('');

  // Favorite place state
  const [favLat, setFavLat] = useState('');
  const [favLon, setFavLon] = useState('');
  const [favPlaceName, setFavPlaceName] = useState('');

  // Initialize form when entry changes
  useEffect(() => {
    if (entry) {
      setName(entry.name || '');
      setTrailName(entry.trailName || '');
      setComment(stripPlaceNames(entry.comment));
      
      if (entry.currentLocation) {
        setCurrentLat(entry.currentLocation.latitude.toString());
        setCurrentLon(entry.currentLocation.longitude.toString());
        setCurrentPlaceName(decodeLocationPlaceName(entry.comment, 'current') || '');
      } else {
        setCurrentLat('');
        setCurrentLon('');
        setCurrentPlaceName('');
      }

      if (entry.favoritePlace) {
        setFavLat(entry.favoritePlace.latitude.toString());
        setFavLon(entry.favoritePlace.longitude.toString());
        setFavPlaceName(decodeLocationPlaceName(entry.comment, 'favorite') || '');
      } else {
        setFavLat('');
        setFavLon('');
        setFavPlaceName('');
      }
      
      setError('');
    }
  }, [entry]);

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

    if (!entry) return;

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
      await updateEntry.mutateAsync({
        timestamp: entry.timestamp,
        name,
        trailName,
        comment: enrichedComment,
        currentLocation,
        favoritePlace,
      });
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update entry');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Entry</DialogTitle>
          <DialogDescription>
            Update your guest book entry
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name (optional)</Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-trailName">Trail Name (optional)</Label>
              <Input
                id="edit-trailName"
                value={trailName}
                onChange={(e) => setTrailName(e.target.value)}
                placeholder="Your trail name"
              />
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="edit-comment">Comment *</Label>
            <Textarea
              id="edit-comment"
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

            <PlaceSearchField
              label="Search for your location"
              placeholder="My home town"
              onSelect={handleSelectCurrentPlace}
            />

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="edit-currentLat" className="text-sm">
                  Latitude
                </Label>
                <Input
                  id="edit-currentLat"
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
                <Label htmlFor="edit-currentLon" className="text-sm">
                  Longitude
                </Label>
                <Input
                  id="edit-currentLon"
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

            <PlaceSearchField
              label="Search for AT location"
              placeholder="e.g., Springer Mtn, Mt. Katahdin"
              onSelect={handleSelectFavoritePlace}
            />

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="edit-favLat" className="text-sm">
                  Latitude
                </Label>
                <Input
                  id="edit-favLat"
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
                <Label htmlFor="edit-favLon" className="text-sm">
                  Longitude
                </Label>
                <Input
                  id="edit-favLon"
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
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateEntry.isPending}
              className="flex-1"
            >
              {updateEntry.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
