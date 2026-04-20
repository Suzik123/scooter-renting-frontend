interface HistoryEmptyStateProps {
  variant?: 'row' | 'block';
}

export default function HistoryEmptyState({ variant = 'block' }: HistoryEmptyStateProps) {
  if (variant === 'row') {
    return (
      <tr>
        <td colSpan={8} className="px-4 py-8 text-center text-sm text-slate-500">
          No rides match this filter.
        </td>
      </tr>
    );
  }
  return <p className="text-sm text-slate-500 text-center py-8">No rides match this filter.</p>;
}
