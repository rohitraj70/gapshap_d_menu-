export const FoodCardSkeleton = () => (
  <div className="bg-white rounded-xl2 shadow-card overflow-hidden border border-brown/5">
    <div className="aspect-[4/3] skeleton animate-shimmer" />
    <div className="p-3 space-y-2">
      <div className="h-4 w-3/4 rounded skeleton animate-shimmer" />
      <div className="h-3 w-full rounded skeleton animate-shimmer" />
      <div className="flex justify-between items-center pt-1">
        <div className="h-4 w-10 rounded skeleton animate-shimmer" />
        <div className="h-7 w-16 rounded-full skeleton animate-shimmer" />
      </div>
    </div>
  </div>
);

export const FoodGridSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
    {Array.from({ length: count }).map((_, i) => (
      <FoodCardSkeleton key={i} />
    ))}
  </div>
);

export const ChipsSkeleton = () => (
  <div className="flex gap-2">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="h-9 w-20 rounded-full skeleton animate-shimmer shrink-0" />
    ))}
  </div>
);
