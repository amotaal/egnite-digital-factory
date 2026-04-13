export default function EditorLoading() {
  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] animate-fade-in">
      {/* Toolbar skeleton */}
      <div className="h-14 bg-white border-b border-gold-light/60 flex items-center gap-3 px-4">
        <div className="skeleton h-7 w-40 rounded-md" />
        <div className="flex-1" />
        <div className="skeleton h-8 w-20 rounded-md" />
        <div className="skeleton h-8 w-24 rounded-md" />
      </div>
      {/* Three-column body */}
      <div className="flex-1 grid grid-cols-[280px_1fr_280px] gap-3 p-3 overflow-hidden">
        <aside className="bg-white rounded-xl border border-gold-light/50 p-4 space-y-3 overflow-hidden">
          <div className="skeleton h-5 w-24 rounded" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton h-9 w-full rounded-md" />
          ))}
        </aside>
        <div className="flex items-center justify-center">
          <div className="skeleton w-full max-w-[794px] aspect-[794/1123] rounded-xl" />
        </div>
        <aside className="bg-white rounded-xl border border-gold-light/50 p-4 space-y-3 overflow-hidden">
          <div className="skeleton h-5 w-24 rounded" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton h-9 w-full rounded-md" />
          ))}
        </aside>
      </div>
    </div>
  );
}
