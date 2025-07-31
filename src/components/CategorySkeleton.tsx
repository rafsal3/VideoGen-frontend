const CategorySkeleton = () => (
  <div className="flex flex-wrap gap-2 justify-center">
    {Array.from({ length: 5 }).map((_, i) => (
      <div
        key={i}
        className="h-8 w-20 rounded-full bg-gray-200 animate-pulse"
      />
    ))}
  </div>
);
export default CategorySkeleton;