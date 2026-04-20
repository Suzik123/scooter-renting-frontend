import { Search, Filter } from 'lucide-react';

export default function MapSearchBar() {
  return (
    <div className="relative">
      <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        type="text"
        placeholder="Search location..."
        aria-label="Search location"
        className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      />
      <button
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
        aria-label="Filter"
      >
        <Filter size={16} />
      </button>
    </div>
  );
}
