// Reusable loading skeleton components

export function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton h-52 w-full rounded-t-2xl rounded-b-none" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-4 w-1/2 rounded" />
        <div className="flex gap-2">
          <div className="skeleton h-6 w-16 rounded-full" />
          <div className="skeleton h-6 w-20 rounded-full" />
        </div>
        <div className="flex items-center justify-between">
          <div className="skeleton h-7 w-24 rounded" />
          <div className="skeleton h-9 w-28 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div className="space-y-4">
        <div className="skeleton h-80 md:h-96 rounded-2xl w-full" />
        <div className="flex gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-20 w-20 rounded-xl flex-shrink-0" />
          ))}
        </div>
      </div>
      <div className="space-y-4 py-4">
        <div className="skeleton h-8 w-4/5 rounded" />
        <div className="skeleton h-5 w-1/3 rounded" />
        <div className="skeleton h-10 w-1/2 rounded" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => <div key={i} className="skeleton h-4 rounded" />)}
        </div>
        <div className="skeleton h-12 w-full rounded-xl" />
        <div className="skeleton h-12 w-full rounded-xl" />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ cols = 5, rows = 5 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r} className="border-b border-gray-100 dark:border-gray-800">
          {Array.from({ length: cols }).map((_, c) => (
            <td key={c} className="px-4 py-3">
              <div className="skeleton h-4 rounded w-full" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export function HeroSkeleton() {
  return (
    <div className="min-h-[85vh] flex items-center">
      <div className="container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="skeleton h-12 w-3/4 rounded-xl" />
          <div className="skeleton h-12 w-full rounded-xl" />
          <div className="skeleton h-5 w-4/5 rounded" />
          <div className="skeleton h-5 w-2/3 rounded" />
          <div className="flex gap-3">
            <div className="skeleton h-12 w-36 rounded-xl" />
            <div className="skeleton h-12 w-36 rounded-xl" />
          </div>
        </div>
        <div className="skeleton h-80 rounded-3xl hidden lg:block" />
      </div>
    </div>
  );
}
