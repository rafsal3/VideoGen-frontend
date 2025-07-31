import { Skeleton } from "./ui/skeleton";

const ProjectCardSkeleton = () => (
  <div className="relative rounded-2xl overflow-hidden aspect-video border-2 p-1">
    <Skeleton className="w-full h-full rounded-xl" />
    <Skeleton className="absolute top-2 right-2 h-6 w-16 rounded-full" />
  </div>
);

export default ProjectCardSkeleton;