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
          <DialogTitle className="text-xl">About VTH Guest Book: Vicarious Thru-Hikers</DialogTitle>
          <DialogDescription className="sr-only">
            About the VTH Guest Book: Vicarious Thru-Hikers project
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-sm text-foreground leading-relaxed">
          {/* VTH Avatar prominently displayed — forced square */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-24 h-24 aspect-square rounded-2xl overflow-hidden border-2 border-logo-border shadow-logo bg-logo-emblem flex-shrink-0">
              <img
                src="/assets/generated/vth-avatar.dim_256x256.png"
                alt="VTH – Vicarious Thru-Hikers avatar"
                className="w-full h-full object-cover block"
              />
            </div>
            <div className="text-center leading-none">
              <p className="font-extrabold tracking-widest uppercase text-logo-title" style={{ fontSize: '1.1rem', letterSpacing: '0.2em' }}>
                VTH
              </p>
              <p className="text-xs text-logo-subtitle font-medium tracking-wide">
                Vicarious Thru-Hikers
              </p>
            </div>
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
            share where you are, your favorite trail spot, and a message for fellow trail lovers. Your
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
