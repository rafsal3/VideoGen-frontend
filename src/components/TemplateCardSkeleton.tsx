import { Skeleton } from "./ui/skeleton";

const TemplateCardSkeleton = () => (
  <div className="rounded-2xl p-0 shadow-md flex flex-col relative overflow-hidden">
    <Skeleton className="h-40 w-full" />
    <div className="p-4 flex-1 flex flex-col">
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-5/6 mb-1" />
      
      <Skeleton className="h-3 w-2/3 mt-auto" />
    </div>
  </div>
);

export default TemplateCardSkeleton;