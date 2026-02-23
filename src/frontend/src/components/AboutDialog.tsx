import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Mountain } from 'lucide-react';

interface AboutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AboutDialog({ open, onOpenChange }: AboutDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <Mountain className="h-8 w-8 text-primary" />
            <DialogTitle className="text-2xl">About VTH Guest Book</DialogTitle>
          </div>
          <DialogDescription className="text-base space-y-4 pt-4">
            <p>
              Welcome to the <strong>VTH Guest Book</strong> — a digital gathering place for 
              Vicarious Thru-Hikers of the Appalachian Trail.
            </p>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground text-lg">What is a Vicarious Thru-Hiker?</h3>
              <p>
                A <strong>Vicarious Thru-Hiker (VTH)</strong> is someone who has "experienced" 
                the Appalachian Trail through the lived, shared experiences of another person 
                who has hiked the trail. Rather than walking every mile themselves, a VTH has 
                "hiked thru" the trail vicariously — through stories, photos, videos, journals, 
                and conversations with actual thru-hikers.
              </p>
              <p>
                Whether you're a family member who followed along every step of the way, a friend 
                who lived through the adventure via daily updates, or someone who was deeply moved 
                by a hiker's journey, you are a Vicarious Thru-Hiker.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-foreground text-lg">About This Project</h3>
              <p>
                This guest book celebrates the unique bond between hikers and those who support 
                them from afar. Share your connection to the trail, mark your location on the 
                world map, and pin your favorite AT spots. Together, we honor the trail and the 
                community it creates — both on the path and beyond.
              </p>
            </div>

            <p className="text-sm text-muted-foreground italic pt-2">
              Sign the guest book to share your story and become part of the VTH community.
            </p>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
