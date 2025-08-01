import { Skeleton } from "./ui/skeleton";

const CategorySkeleton = () => (
  <div className="flex flex-wrap gap-2 justify-center">
    {Array.from({ length: 5 }).map((_, i) => (
      <Skeleton
        key={i}
        className="h-8 w-20 rounded-full"
      />
    ))}
  </div>
);
export default CategorySkeleton;