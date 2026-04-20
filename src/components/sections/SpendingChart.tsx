import SectionHeader from '../ui/SectionHeader';

const SPENDING = [
  { label: 'Mon', value: 3.2, max: 8 },
  { label: 'Tue', value: 5.1, max: 8 },
  { label: 'Wed', value: 2.0, max: 8 },
  { label: 'Thu', value: 7.5, max: 8 },
  { label: 'Fri', value: 4.8, max: 8 },
  { label: 'Sat', value: 6.2, max: 8 },
  { label: 'Sun', value: 1.5, max: 8 },
];

export default function SpendingChart() {
  const total = SPENDING.reduce((s, d) => s + d.value, 0);
  return (
    <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-slate-100 p-5">
      <SectionHeader
        title="This Week"
        className="mb-4"
        action={<span className="text-sm text-slate-500">${total.toFixed(2)} total</span>}
      />
      <div className="flex items-end gap-3 h-32">
        {SPENDING.map((day) => (
          <div key={day.label} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full bg-slate-100 rounded-t-md relative" style={{ height: '100%' }}>
              <div
                className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-md transition-all"
                style={{ height: `${(day.value / day.max) * 100}%` }}
              />
            </div>
            <span className="text-xs text-slate-500">{day.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
