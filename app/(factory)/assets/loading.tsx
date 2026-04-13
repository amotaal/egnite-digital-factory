export default function AssetsLoading() {
  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 animate-fade-in">
      <div className="mb-6">
        <div className="skeleton h-8 w-48 rounded-lg" />
        <div className="skeleton h-4 w-96 rounded mt-2" />
      </div>
      <div className="skeleton h-10 w-full max-w-md rounded-lg mb-6" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gold-light/50 overflow-hidden"
          >
            <div className="skeleton aspect-square" />
            <div className="p-3 flex flex-col gap-2">
              <div className="skeleton h-4 w-3/4 rounded" />
              <div className="skeleton h-3 w-1/2 rounded" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
