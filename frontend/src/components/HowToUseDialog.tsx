import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { PenLine, Map, BookOpen, MapPin } from 'lucide-react';

interface HowToUseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function HowToUseDialog({ open, onOpenChange }: HowToUseDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">How to Use VTH Guest Book: Vicarious Thru-Hiker</DialogTitle>
          <DialogDescription className="sr-only">
            Instructions for using the VTH Guest Book: Vicarious Thru-Hiker app
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <p className="text-sm text-muted-foreground">
            Welcome to the <strong>VTH Guest Book: Vicarious Thru-Hiker</strong>! Here's how to get the most out of it:
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 rounded-lg p-2 shrink-0">
                <PenLine className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Sign the Guestbook</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Tap <strong>"+ Sign"</strong> or the pen icon in the bottom nav. Log in with
                  Internet Identity, then fill in your name, trail name, and a message. You can
                  also add your current location and favorite AT spot.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-primary/10 rounded-lg p-2 shrink-0">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Pin Your Location</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  When adding an entry, use <strong>"Use My GPS Location"</strong> for automatic
                  detection, or search for a place by name. Your pin will appear on the World Map
                  for all to see.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-primary/10 rounded-lg p-2 shrink-0">
                <Map className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Explore the Maps</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  The <strong>World Map</strong> shows where all hikers are located. The{' '}
                  <strong>AT Map</strong> shows favorite spots along the Appalachian Trail. Click
                  any pin to jump to that hiker's guestbook entry.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-primary/10 rounded-lg p-2 shrink-0">
                <BookOpen className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Browse the Feed</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  The <strong>Feed</strong> tab shows all entries in reverse chronological order.
                  Tap any entry to read the full message. If you're logged in, you can edit or
                  delete your own entries.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
