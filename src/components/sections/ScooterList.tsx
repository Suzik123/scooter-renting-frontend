import { useTranslation } from 'react-i18next';
import { useAvailableScooters, useScootersStore } from '../../stores/scootersStore';
import ScooterListItem from './ScooterListItem';

export default function ScooterList() {
  const { t } = useTranslation('map');
  const available = useAvailableScooters();
  const loading = useScootersStore((s) => s.loading);
  const error = useScootersStore((s) => s.error);
  const selectedId = useScootersStore((s) => s.selectedScooterId);
  const selectScooter = useScootersStore((s) => s.selectScooter);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 space-y-2">
        {error && (
          <p className="text-xs text-red-600" role="alert">{error}</p>
        )}
        <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
          {loading && available.length === 0
            ? t('loading')
            : t('scootersNearby', { count: available.length })}
        </p>
        {available.map((scooter) => (
          <ScooterListItem
            key={scooter.scooter_id}
            scooter={scooter}
            selected={selectedId === scooter.scooter_id}
            onSelect={selectScooter}
          />
        ))}
        {!loading && available.length === 0 && !error && (
          <p className="text-sm text-[var(--color-text-muted)]">{t('noScootersAvailable')}</p>
        )}
      </div>
    </div>
  );
}
