import { useTranslation } from 'react-i18next';

interface HistoryEmptyStateProps {
  variant?: 'row' | 'block';
}

export default function HistoryEmptyState({ variant = 'block' }: HistoryEmptyStateProps) {
  const { t } = useTranslation('history');
  const msg = t('empty.noMatch');
  if (variant === 'row') {
    return (
      <tr>
        <td colSpan={8} className="px-4 py-8 text-center text-sm text-slate-500">
          {msg}
        </td>
      </tr>
    );
  }
  return <p className="text-sm text-slate-500 text-center py-8">{msg}</p>;
}
