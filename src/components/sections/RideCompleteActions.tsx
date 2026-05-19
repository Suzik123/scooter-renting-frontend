import { Link } from 'react-router-dom';
import { Share2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';

export default function RideCompleteActions() {
  const { t } = useTranslation('ride');
  return (
    <div className="space-y-3">
      <Link to="/map">
        <Button fullWidth size="lg">
          {t('complete.done')}
        </Button>
      </Link>
      <Button fullWidth size="lg" variant="outline" className="flex items-center justify-center gap-2">
        <Share2 size={18} /> {t('complete.shareRide')}
      </Button>
    </div>
  );
}
