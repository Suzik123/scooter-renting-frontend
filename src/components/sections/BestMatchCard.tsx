import { useNavigate } from 'react-router-dom';
import { Zap, Battery, MapPin, Navigation } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import ProgressBar from '../ui/ProgressBar';
import { useBestMatch, useScootersStore, distanceFromUser } from '../../stores/scootersStore';
import { useActiveRideStore } from '../../stores/activeRideStore';
import { useUIStore } from '../../stores/uiStore';
import { usePriceModelsStore, pickDefaultPriceModel } from '../../stores/priceModelsStore';
import { usePaymentMethodsStore } from '../../stores/paymentMethodsStore';
import { toNum } from '../../lib/decimal';

export default function BestMatchCard() {
  const { t } = useTranslation('map');
  const bestMatch = useBestMatch();
  const userLocation = useScootersStore((s) => s.userLocation);
  const scooters = useScootersStore((s) => s.scooters);
  const selectedScooterId = useScootersStore((s) => s.selectedScooterId);
  const startRide = useActiveRideStore((s) => s.startRide);
  const loading = useActiveRideStore((s) => s.loading);
  const showToast = useUIStore((s) => s.showToast);
  const openAddCard = useUIStore((s) => s.openAddCard);
  const navigate = useNavigate();
  const priceModels = usePriceModelsStore((s) => s.models);
  const methods = usePaymentMethodsStore((s) => s.methods);
  const methodsLoaded = usePaymentMethodsStore((s) => s.loaded);

  if (!bestMatch) return null;

  // The card always shows the action target: selected (if available) else best match.
  const selectedAvailable = scooters.find(
    (s) => s.scooter_id === selectedScooterId && s.status === 'available',
  );
  const target = selectedAvailable ?? bestMatch;
  const isBestMatch = target.scooter_id === bestMatch.scooter_id;

  const priceModel = pickDefaultPriceModel(priceModels);
  const priceLabel = priceModel
    ? `$${toNum(priceModel.price_per_minute).toFixed(2)}/min`
    : '—';
  const hasCard = methods.length > 0;
  const canRide = !!priceModel && hasCard;

  const handleUnlock = async () => {
    if (!methodsLoaded) return;
    if (!hasCard) {
      showToast(t('addCardToRide'), 'info');
      navigate('/wallet');
      openAddCard();
      return;
    }
    if (!priceModel) {
      showToast('Pricing unavailable, please retry', 'error');
      return;
    }
    const rental = await startRide(target, {
      price_model_id: priceModel.price_model_id,
      price_per_minute: toNum(priceModel.price_per_minute),
      unlock_fee: toNum(priceModel.unlock_fee),
      currency: priceModel.currency,
    });
    if (rental) {
      showToast(`Unlocked ${target.model || target.scooter_id}`, 'success');
      navigate('/ride/active');
    }
  };

  const label = target.model || `Scooter ${target.scooter_id}`;
  const distanceLabel = distanceFromUser(target, userLocation);

  return (
    <div className="p-4 border-b border-[var(--color-border-muted)]">
      <div className="flex items-center gap-1.5 mb-2">
        <Zap size={14} className="text-primary" />
        <span className="text-xs font-semibold text-primary uppercase tracking-wide">
          {isBestMatch ? t('bestMatch') : t('selectScooter')}
        </span>
      </div>
      <div className="bg-primary-light rounded-xl p-4 border border-green-200">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-slate-900">{label}</h4>
          <Badge variant="success">{t('available')}</Badge>
        </div>
        <p className="text-xs text-slate-500 mb-3">ID: {target.scooter_id}</p>
        <div className="flex items-center gap-4 mb-3 text-xs text-slate-600">
          <span className="flex items-center gap-1"><Battery size={14} /> {target.battery_level}%</span>
          <span className="flex items-center gap-1"><MapPin size={14} /> {distanceLabel}</span>
          <span className="flex items-center gap-1"><Navigation size={14} /> {priceLabel}</span>
        </div>
        <ProgressBar value={target.battery_level} track="green" className="mb-3" />
        <Button fullWidth size="sm" onClick={handleUnlock} disabled={loading || !canRide}>
          {loading ? t('unlocking') : !hasCard && methodsLoaded ? t('addCardToRide') : t('unlock')}
        </Button>
      </div>
    </div>
  );
}
