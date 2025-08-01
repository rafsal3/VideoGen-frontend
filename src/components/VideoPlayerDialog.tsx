import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface VideoPlayerDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  videoUrl: string | null;
  title: string;
}

export const VideoPlayerDialog = ({
  isOpen,
  onOpenChange,
  videoUrl,
  title,
}: VideoPlayerDialogProps) => {
  // Don't render anything if there's no video URL
  if (!videoUrl) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white">{title}</DialogTitle>
        </DialogHeader>
        <div className="aspect-video mt-4">
          <video
            key={videoUrl} // Add key to force re-render when URL changes
            src={videoUrl}
            controls
            autoPlay
            className="w-full h-full rounded-lg bg-black"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </DialogContent>
    </Dialog>
  );
};
