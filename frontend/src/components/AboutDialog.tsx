import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface AboutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AboutDialog({ open, onOpenChange }: AboutDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">About VTH Guest Book</DialogTitle>
          <DialogDescription className="sr-only">
            About the Vicarious Thru-Hikers Guest Book project
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-sm text-foreground leading-relaxed">
          <div className="flex justify-center">
            <img
              src="/assets/generated/vth-logo.dim_512x512.png"
              alt="VTH Logo"
              className="w-20 h-20 object-contain rounded-xl"
            />
          </div>

          <p>
            <strong>Vicarious Thru-Hikers (VTH)</strong> is a community for those who love the
            Appalachian Trail — whether you've hiked every mile or just dream of doing so someday.
          </p>

          <p>
            A <em>vicarious thru-hiker</em> is someone who experiences the trail through the
            stories, photos, and journeys of others. We follow along, cheer on the hikers, and
            share in the adventure from wherever we are in the world.
          </p>

          <p>
            The <strong>VTH Guest Book</strong> is a place for the community to leave their mark —
            share where you are, your favorite AT spot, and a message for fellow trail lovers. Your
            entry is pinned on the world map so the whole community can see where VTH members are
            located.
          </p>

          <p>
            This app is built on the <strong>Internet Computer</strong>, a decentralized blockchain
            network, ensuring your entries are permanent, censorship-resistant, and owned by the
            community — not a corporation.
          </p>

          <p className="text-xs text-muted-foreground border-t border-border pt-3">
            🥾 Happy trails, wherever you are!
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
