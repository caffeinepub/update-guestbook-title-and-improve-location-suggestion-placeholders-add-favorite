import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";

interface AboutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AboutDialog({ open, onOpenChange }: AboutDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md max-h-[85vh] flex flex-col overflow-hidden"
        style={{ zIndex: 99999 }}
      >
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl">About VTH Guest Book</DialogTitle>
          <DialogDescription className="sr-only">
            About the VTH Guest Book: Vicarious Thru-Hikers project
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 space-y-4 py-2 text-sm text-foreground leading-relaxed pr-1">
          {/* VTH Logo prominently displayed */}
          <div className="flex flex-col items-center gap-2">
            <div
              className="flex flex-col items-center justify-center rounded-2xl border-2 shadow-md flex-shrink-0"
              style={{
                width: "96px",
                height: "96px",
                backgroundColor: "#7B2D1F",
                borderColor: "#c9a96e",
              }}
            >
              <span
                style={{
                  color: "#f5ede0",
                  fontWeight: 900,
                  fontSize: "2rem",
                  letterSpacing: "0.05em",
                  lineHeight: 1,
                  fontFamily: "Georgia, serif",
                }}
              >
                VTH
              </span>
              <span
                style={{
                  color: "#c9a96e",
                  fontSize: "0.5rem",
                  fontWeight: 600,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  lineHeight: 1.2,
                  textAlign: "center",
                }}
              >
                Guest Book
              </span>
              <span
                style={{
                  color: "#f5ede0",
                  fontSize: "0.4rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  lineHeight: 1.2,
                  textAlign: "center",
                  opacity: 0.85,
                }}
              >
                Vicarious Thru-Hikers
              </span>
            </div>
          </div>

          <p>
            The <strong>Vicarious Thru-Hikers (VTH)</strong> is a community for
            those who love trails, hiking and the hikers who hike them.
          </p>

          <p>
            A <em>vicarious thru-hiker</em> is someone who experiences the trail
            through the stories, photos, and journeys of others. We follow
            along, cheer on the hikers, and share in the adventure from wherever
            we are in the world. And in this way, a VTH also experiences the
            trail in their own unique way. <strong>You are a VTH.</strong>
          </p>

          <p>
            The <strong>VTH Guest Book</strong> is a place for the community to
            leave their mark — share where you are, your favorite trail spot,
            and a message or story for fellow trail lovers.
          </p>

          <p>
            This app is built on the <strong>Internet Computer</strong>, a
            decentralized blockchain network. It was built with love by{" "}
            <strong>Railroad McCoy</strong>.
          </p>

          <p
            className="border-t border-border pt-3 font-medium"
            style={{ color: "#5a7a3a" }}
          >
            Keep on hikin'.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
