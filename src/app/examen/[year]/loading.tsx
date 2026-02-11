export default function Loading() {
  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-50 bg-gradient-to-r from-primary-dark to-primary h-16" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="animate-pulse space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <div className="h-6 w-32 bg-border rounded" />
              <div className="h-5 w-40 bg-border rounded" />
            </div>
            <div className="h-2 w-full bg-border rounded-full" />
          </div>
          <div className="rounded-2xl border border-border p-6 space-y-4">
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-border" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-full bg-border rounded" />
                <div className="h-4 w-3/4 bg-border rounded" />
              </div>
            </div>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="ml-11 h-12 bg-border rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
