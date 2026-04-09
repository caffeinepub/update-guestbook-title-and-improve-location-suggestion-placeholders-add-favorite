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
import { useNavigate } from "@tanstack/react-router";
import { BookOpen, Loader2, MapPin, Pencil, Trash2 } from "lucide-react";
import React, { useState } from "react";
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
import type { GuestbookEntry } from "../types/guestbook";

export default function GuestbookFeedPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: entries, isLoading } = useGetAllEntries();
  const { data: isAdmin } = useIsCallerAdmin();
  const deleteEntry = useDeleteEntry();
  const [editEntry, setEditEntry] = useState<GuestbookEntry | null>(null);
  const [deletingTimestamp, setDeletingTimestamp] = useState<bigint | null>(
    null,
  );

  const isOwner = (entry: GuestbookEntry) =>
    identity
      ? entry.creator.toString() === identity.getPrincipal().toString()
      : false;

  const canModify = (entry: GuestbookEntry) => isOwner(entry) || !!isAdmin;

  const handleDelete = async (entry: GuestbookEntry) => {
    setDeletingTimestamp(entry.timestamp);
    try {
      await deleteEntry.mutateAsync(entry.timestamp);
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeletingTimestamp(null);
    }
  };

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center py-20"
        data-ocid="feed.loading_state"
      >
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const sortedEntries = [...(entries || [])].reverse();

  if (sortedEntries.length === 0) {
    return (
      <div
        className="max-w-lg mx-auto px-4 py-16 text-center"
        data-ocid="feed.empty_state"
      >
        <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-semibold text-foreground mb-2">
          No entries yet
        </h2>
        <p className="text-muted-foreground mb-6">
          Be the first to sign the VTH Guest Book!
        </p>
        <Button
          onClick={() => navigate({ to: "/add" })}
          data-ocid="feed.primary_button"
        >
          Sign the Guestbook
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-bold text-foreground">Recent Entries</h1>
        <Button
          size="sm"
          onClick={() => navigate({ to: "/add" })}
          data-ocid="feed.primary_button"
        >
          + Sign
        </Button>
      </div>

      {sortedEntries.map((entry, index) => {
        const { cleanComment } = decodeComment(entry.comment);
        const { currentLocationName, favoritePlaceName } = decodePlaceNames(
          entry.comment,
        );
        const preview =
          cleanComment.length > 160
            ? `${cleanComment.slice(0, 160)}\u2026`
            : cleanComment;
        const isDeleting = deletingTimestamp === entry.timestamp;
        const itemIndex = index + 1;

        return (
          <div
            key={entry.timestamp.toString()}
            className="bg-card border border-border rounded-2xl p-4 shadow-sm"
            data-ocid={`feed.item.${itemIndex}`}
          >
            <div className="flex items-start justify-between gap-2">
              <button
                type="button"
                className="flex-1 cursor-pointer text-left bg-transparent border-0 p-0 min-h-0 min-w-0"
                onClick={() =>
                  navigate({
                    to: "/entry/$timestamp",
                    params: { timestamp: entry.timestamp.toString() },
                  })
                }
                data-ocid={`feed.item.${itemIndex}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-foreground text-sm">
                    {entry.name || formatAuthorLabel(entry.creator)}
                  </span>
                  {entry.trailName && (
                    <span className="text-xs text-primary font-medium">
                      &#x1F97E; {entry.trailName}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                  {preview}
                </p>
                {(currentLocationName || favoritePlaceName) && (
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    {currentLocationName && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-primary" />
                        {currentLocationName}
                      </span>
                    )}
                    {favoritePlaceName && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-600" />
                        {favoritePlaceName}
                      </span>
                    )}
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  {formatTimestamp(entry.timestamp)}
                </p>
              </button>

              {canModify(entry) && (
                <div className="flex flex-col gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditEntry(entry);
                    }}
                    title="Edit entry"
                    data-ocid={`feed.item.${itemIndex}`}
                  >
                    <Pencil className="w-3 h-3" />
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={(e) => e.stopPropagation()}
                        title="Delete entry"
                        data-ocid={`feed.delete_button.${itemIndex}`}
                      >
                        {isDeleting ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Trash2 className="w-3 h-3" />
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent style={{ zIndex: 99999 }}>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Entry</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this guestbook entry?
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel data-ocid="feed.cancel_button">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(entry)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          data-ocid="feed.confirm_button"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {editEntry && (
        <EditEntryDialog
          entry={editEntry}
          open={!!editEntry}
          onOpenChange={(open) => {
            if (!open) setEditEntry(null);
          }}
        />
      )}

      {/* Footer */}
      <footer className="text-center text-xs text-muted-foreground pt-4 pb-2">
        &#169; {new Date().getFullYear()}. Built with &#x2764; using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:opacity-80"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
