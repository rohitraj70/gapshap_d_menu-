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

export const LoadingMenuMessage = () => (
  <div className="flex items-center justify-center rounded-2xl border border-brown/10 bg-white/80 px-4 py-4 shadow-card dark:border-[#4d3b31] dark:bg-[#2a211d]/90">
    <div className="flex items-center gap-3 text-sm font-semibold text-brown-dark dark:text-[#fff8f0]">
      <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      <span>Please wait while we load your menu...</span>
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
