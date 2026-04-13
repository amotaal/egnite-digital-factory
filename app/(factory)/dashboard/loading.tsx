export default function DashboardLoading() {
  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 animate-fade-in">
      {/* Welcome skeleton */}
      <div className="mb-8">
        <div className="skeleton h-8 w-64 rounded-lg" />
        <div className="skeleton h-4 w-96 rounded mt-3" />
      </div>

      {/* Template grid skeleton */}
      <section className="mb-10">
        <div className="skeleton h-5 w-48 rounded mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gold-light/50 overflow-hidden"
            >
              <div className="skeleton h-36" />
              <div className="p-4 flex flex-col gap-3">
                <div className="skeleton h-5 w-2/3 rounded" />
                <div className="skeleton h-3 w-full rounded" />
                <div className="skeleton h-3 w-4/5 rounded" />
                <div className="skeleton h-9 w-full rounded-lg mt-1" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Documents skeleton */}
      <section>
        <div className="skeleton h-5 w-40 rounded mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gold-light/50 overflow-hidden"
            >
              <div className="skeleton h-28" />
              <div className="p-3 flex flex-col gap-2">
                <div className="skeleton h-4 w-2/3 rounded" />
                <div className="skeleton h-3 w-1/3 rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
