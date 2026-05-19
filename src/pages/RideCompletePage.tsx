import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Elements, useStripe } from '@stripe/react-stripe-js';
import { useTranslation } from 'react-i18next';
import RideMapCard from '../components/sections/RideMapCard';
import RideCompleteSummary from '../components/sections/RideCompleteSummary';
import RideCompleteActions from '../components/sections/RideCompleteActions';
import Badge from '../components/ui/Badge';
import { useActiveRideStore } from '../stores/activeRideStore';
import { usePaymentsHistoryStore } from '../stores/paymentsHistoryStore';
import { useAuthStore } from '../stores/authStore';
import { usePriceModelsStore } from '../stores/priceModelsStore';
import { stripePromise } from '../lib/stripe';
import { formatCost } from '../lib/decimal';

type ConfirmStatus = 'idle' | 'confirming' | 'succeeded' | 'failed';

export default function RideCompletePage() {
  return (
    <Elements stripe={stripePromise}>
      <RideCompletePageInner />
    </Elements>
  );
}

function RideCompletePageInner() {
  const { t } = useTranslation(['ride', 'common']);
  const rental = useActiveRideStore((s) => s.finishedRental);
  const payment = useActiveRideStore((s) => s.finishedPayment);
  const clearFinished = useActiveRideStore((s) => s.clearFinished);
  const userId = useAuthStore((s) => s.user?.user_id ?? null);
  const reloadPayments = usePaymentsHistoryStore((s) => s.load);
  const priceModels = usePriceModelsStore((s) => s.models);
  const stripe = useStripe();
  const navigate = useNavigate();

  const initialStatus: ConfirmStatus =
    payment?.status === 'pending' && payment.client_secret
      ? 'confirming'
      : payment?.status === 'succeeded'
        ? 'succeeded'
        : payment?.status === 'failed'
          ? 'failed'
          : 'idle';

  const [confirmStatus, setConfirmStatus] = useState<ConfirmStatus>(initialStatus);
  const [confirmError, setConfirmError] = useState<string | null>(payment?.failure_reason ?? null);

  useEffect(() => {
    if (!payment) return;
    if (payment.status !== 'pending' || !payment.client_secret || !stripe) return;
    let cancelled = false;
    setConfirmStatus('confirming');
    setConfirmError(null);
    stripe
      .handleNextAction({ clientSecret: payment.client_secret })
      .then((res) => {
        if (cancelled) return;
        if (res.error) {
          setConfirmStatus('failed');
          setConfirmError(res.error.message ?? t('ride:payment.genericFailed'));
          return;
        }
        if (res.paymentIntent?.status === 'succeeded') {
          setConfirmStatus('succeeded');
        } else {
          setConfirmStatus('failed');
          setConfirmError(t('ride:payment.statusFallback', { status: res.paymentIntent?.status ?? 'unknown' }));
        }
      })
      .catch((e) => {
        if (cancelled) return;
        setConfirmStatus('failed');
        setConfirmError(e instanceof Error ? e.message : t('ride:payment.genericFailed'));
      });
    return () => {
      cancelled = true;
    };
  }, [payment, stripe, t]);

  useEffect(() => {
    if (confirmStatus === 'succeeded' || confirmStatus === 'failed' || confirmStatus === 'idle') {
      if (userId) reloadPayments(userId, { limit: 10 });
    }
  }, [confirmStatus, userId, reloadPayments]);

  useEffect(() => {
    return () => {
      clearFinished();
    };
  }, [clearFinished]);

  if (!rental || !payment) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
        <p className="text-sm text-slate-500">{t('ride:complete.noCompletedRide')}</p>
        <Link to="/map" className="text-sm text-primary hover:underline">{t('ride:complete.backToMap')}</Link>
      </div>
    );
  }

  const currency =
    priceModels.find((m) => m.price_model_id === rental.price_model_id)?.currency ?? 'USD';
  const totalLabel = formatCost(rental.total_cost, currency);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-6">
        <RideMapCard variant="complete" routeLabel={t('ride:complete.ridePrefix', { id: rental.rental_id })} />

        <div className="space-y-6">
          <div className="text-center lg:text-left">
            {confirmStatus === 'succeeded' && (
              <CheckCircle size={48} className="text-primary mx-auto lg:mx-0 mb-3" />
            )}
            {confirmStatus === 'failed' && (
              <AlertCircle size={48} className="text-red-500 mx-auto lg:mx-0 mb-3" />
            )}
            {confirmStatus === 'confirming' && (
              <Loader2 size={48} className="text-primary mx-auto lg:mx-0 mb-3 animate-spin" />
            )}
            <h1 className="text-2xl font-bold text-slate-900 mb-1">
              {confirmStatus === 'failed' ? t('ride:complete.paymentFailed') : t('ride:complete.title')}
            </h1>
            <p className="text-sm text-slate-500">
              {confirmStatus === 'confirming'
                ? t('ride:complete.confirming')
                : confirmStatus === 'failed'
                  ? confirmError ?? t('ride:complete.cardChargeFailed')
                  : t('ride:complete.summary')}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 text-center">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">{t('ride:complete.totalCost')}</p>
            <p className="text-4xl font-bold text-slate-900 mb-2">{totalLabel}</p>
            {confirmStatus === 'succeeded' && <Badge variant="success">{t('common:status.paid')}</Badge>}
            {confirmStatus === 'confirming' && <Badge variant="default">{t('common:status.confirming')}</Badge>}
            {confirmStatus === 'failed' && <Badge variant="error">{t('common:status.failed')}</Badge>}
            {confirmStatus === 'idle' && payment.status === 'failed' && (
              <Badge variant="error">{t('common:status.failed')}</Badge>
            )}
          </div>

          <RideCompleteSummary rental={rental} />

          {confirmStatus === 'failed' && (
            <button
              type="button"
              onClick={() => navigate('/wallet')}
              className="w-full bg-red-50 border border-red-200 text-red-700 rounded-xl py-3 text-sm font-medium hover:bg-red-100 transition-colors"
            >
              {t('ride:complete.updateCard')}
            </button>
          )}

          <RideCompleteActions />
        </div>
      </div>
    </div>
  );
}
