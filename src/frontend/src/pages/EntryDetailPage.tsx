import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Loader2, MapPin, Pencil, Trash2 } from "lucide-react";
import React, { useState } from "react";
import type { GuestbookEntry } from "../backend";
import EditEntryDialog from "../components/EditEntryDialog";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useDeleteEntry,
  useGetAllEntries,
  useIsCallerAdmin,
} from "../hooks/useQueries";
import {
  decodeComment,
  decodePlaceNames,
  formatAuthorLabel,
  formatTimestamp,
} from "../lib/guestbookFormat";

export default function EntryDetailPage() {
  const { timestamp } = useParams({ from: "/entry/$timestamp" });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: entries, isLoading } = useGetAllEntries();
  const { data: isAdmin } = useIsCallerAdmin();
  const deleteEntry = useDeleteEntry();
  const [editOpen, setEditOpen] = useState(false);

  const entry = entries?.find(
    (e: GuestbookEntry) => e.timestamp.toString() === timestamp,
  );

  const isOwner =
    identity && entry
      ? entry.creator.toString() === identity.getPrincipal().toString()
      : false;

  const canModify = isOwner || isAdmin;

  const handleDelete = async () => {
    if (!entry) return;
    try {
      await deleteEntry.mutateAsync(entry.timestamp);
      navigate({ to: "/" });
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground">Entry not found.</p>
        <Button
          variant="ghost"
          onClick={() => navigate({ to: "/" })}
          className="mt-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Feed
        </Button>
      </div>
    );
  }

  const { cleanComment } = decodeComment(entry.comment);
  const { currentLocationName, favoritePlaceName } = decodePlaceNames(
    entry.comment,
  );

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: "/" })}
        className="mb-6 -ml-2"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Feed
      </Button>

      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {entry.name || formatAuthorLabel(entry.creator)}
            </h1>
            {entry.trailName && (
              <p className="text-sm text-primary font-medium">
                🥾 {entry.trailName}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {formatTimestamp(entry.timestamp)}
            </p>
          </div>

          {canModify && (
            <div className="flex gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditOpen(true)}
                className="flex items-center gap-1"
              >
                <Pencil className="w-3 h-3" />
                Edit
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Entry</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this guestbook entry? This
                      action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {deleteEntry.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Delete"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>

        <p className="text-foreground leading-relaxed whitespace-pre-wrap mb-4">
          {cleanComment}
        </p>

        {(currentLocationName || entry.currentLocation) && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground border-t border-border pt-3 mt-3">
            <MapPin className="w-4 h-4 text-primary shrink-0" />
            <span>
              <span className="font-medium text-foreground">
                Current Location:{" "}
              </span>
              {currentLocationName ||
                (entry.currentLocation
                  ? `${entry.currentLocation.latitude.toFixed(4)}, ${entry.currentLocation.longitude.toFixed(4)}`
                  : "")}
            </span>
          </div>
        )}

        {(favoritePlaceName || entry.favoritePlace) && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground border-t border-border pt-3 mt-3">
            <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <span className="font-medium text-foreground">
                Favorite Trail Spot:{" "}
              </span>
              {favoritePlaceName ||
                (entry.favoritePlace
                  ? `${entry.favoritePlace.latitude.toFixed(4)}, ${entry.favoritePlace.longitude.toFixed(4)}`
                  : "")}
            </span>
          </div>
        )}
      </div>

      {editOpen && (
        <EditEntryDialog
          entry={entry}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      )}
    </div>
  );
}
