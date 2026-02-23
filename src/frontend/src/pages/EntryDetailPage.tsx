import { useState } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useGetAllEntries, useDeleteEntry } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ArrowLeft, MapPin, Mountain, User, Tag, Edit, Trash2 } from 'lucide-react';
import { getAuthorLabel, formatTimestamp, formatCoordinates, stripPlaceNames } from '../lib/guestbookFormat';
import EditEntryDialog from '../components/EditEntryDialog';

export default function EntryDetailPage() {
  const navigate = useNavigate();
  const { entryId } = useParams({ from: '/entry/$entryId' });
  const { data: entries, isLoading } = useGetAllEntries();
  const deleteEntry = useDeleteEntry();
  const { identity } = useInternetIdentity();
  
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto pb-20">
        <Button variant="ghost" onClick={() => navigate({ to: '/' })} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Feed
        </Button>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const sortedEntries = [...(entries || [])].sort((a, b) => 
    Number(b.timestamp - a.timestamp)
  );
  const entry = sortedEntries[parseInt(entryId)];

  if (!entry) {
    return (
      <div className="max-w-2xl mx-auto pb-20">
        <Button variant="ghost" onClick={() => navigate({ to: '/' })} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Feed
        </Button>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Entry not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isEntryCreator = identity && entry.creator.toString() === identity.getPrincipal().toString();

  const handleDelete = async () => {
    try {
      await deleteEntry.mutateAsync(entry.timestamp);
      navigate({ to: '/' });
    } catch (err: any) {
      console.error('Failed to delete entry:', err);
      alert('Failed to delete entry. You may not have permission to delete this entry.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-20">
      <Button variant="ghost" onClick={() => navigate({ to: '/' })} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Feed
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">
                {getAuthorLabel(entry)}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {formatTimestamp(entry.timestamp)}
              </p>
            </div>
            <div className="flex gap-2 flex-wrap justify-end">
              {entry.currentLocation && (
                <Badge variant="secondary">
                  <MapPin className="h-3 w-3 mr-1" />
                  World Map
                </Badge>
              )}
              {entry.favoritePlace && (
                <Badge variant="secondary">
                  <Mountain className="h-3 w-3 mr-1" />
                  AT Map
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6 space-y-6">
          {/* Comment */}
          <div>
            <h3 className="text-sm font-semibold mb-2 text-muted-foreground">Comment</h3>
            <p className="text-base whitespace-pre-wrap">{stripPlaceNames(entry.comment)}</p>
          </div>

          {/* Details */}
          {(entry.name || entry.trailName) && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground">Details</h3>
                {entry.name && (
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">{entry.name}</span>
                  </div>
                )}
                {entry.trailName && (
                  <div className="flex items-center gap-2 text-sm">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Trail Name:</span>
                    <span className="font-medium">{entry.trailName}</span>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Locations */}
          {(entry.currentLocation || entry.favoritePlace) && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground">Locations</h3>
                {entry.currentLocation && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="font-medium">Current Location</span>
                    </div>
                    <p className="text-sm text-muted-foreground ml-6">
                      {formatCoordinates(
                        entry.currentLocation.latitude,
                        entry.currentLocation.longitude
                      )}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate({ to: '/world-map' })}
                      className="ml-6 mt-2"
                    >
                      View on World Map
                    </Button>
                  </div>
                )}
                {entry.favoritePlace && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <Mountain className="h-4 w-4 text-primary" />
                      <span className="font-medium">Favorite AT Place</span>
                    </div>
                    <p className="text-sm text-muted-foreground ml-6">
                      {formatCoordinates(
                        entry.favoritePlace.latitude,
                        entry.favoritePlace.longitude
                      )}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate({ to: '/at-map' })}
                      className="ml-6 mt-2"
                    >
                      View on AT Map
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Action Buttons - Only show if user is the creator */}
          {isEntryCreator && (
            <>
              <Separator />
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowEditDialog(true)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Entry
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteDialog(true)}
                  className="flex-1"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Entry
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {isEntryCreator && (
        <>
          <EditEntryDialog
            entry={entry}
            open={showEditDialog}
            onOpenChange={setShowEditDialog}
          />

          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Entry?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your guest book entry.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={deleteEntry.isPending}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {deleteEntry.isPending ? 'Deleting...' : 'Delete'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
}
