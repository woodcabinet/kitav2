const defaultFilters = ['All', 'Threads', 'TikTok', 'Drops', 'Events', 'Fashion'];

export default function FilterPills({ active, onChange, pills }) {
  const filters = pills || defaultFilters;
  return (
    <div className="flex gap-1.5 px-4 py-2 overflow-x-auto no-scrollbar">
      {filters.map(f => (
        <button
          key={f}
          onClick={() => onChange(f)}
          className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
            active === f
              ? 'bg-cream/90 text-offblack'
              : 'text-warm/50 hover:text-warm/70'
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  );
}
