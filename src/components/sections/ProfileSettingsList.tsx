import {
  User,
  Bell,
  Shield,
  CreditCard,
  Moon,
  Globe,
  MapPin,
  HelpCircle,
  MessageCircle,
  FileText,
} from 'lucide-react';
import type { ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import SettingsRow from '../ui/SettingsRow';

interface SettingsGroup {
  titleKey: string;
  items: ReadonlyArray<{ icon: ComponentType<{ size?: number; className?: string }>; labelKey: string }>;
}

const GROUPS: readonly SettingsGroup[] = [
  {
    titleKey: 'settings.account',
    items: [
      { icon: User, labelKey: 'settings.personal' },
      { icon: Shield, labelKey: 'settings.security' },
      { icon: CreditCard, labelKey: 'settings.payments' },
      { icon: Bell, labelKey: 'settings.notifications' },
    ],
  },
  {
    titleKey: 'settings.preferences',
    items: [
      { icon: Moon, labelKey: 'settings.appearance' },
      { icon: Globe, labelKey: 'settings.language' },
      { icon: MapPin, labelKey: 'settings.location' },
    ],
  },
  {
    titleKey: 'settings.support',
    items: [
      { icon: HelpCircle, labelKey: 'settings.helpCenter' },
      { icon: MessageCircle, labelKey: 'settings.contact' },
      { icon: FileText, labelKey: 'settings.terms' },
    ],
  },
];

export default function ProfileSettingsList() {
  const { t } = useTranslation('profile');
  return (
    <>
      {GROUPS.map((group) => (
        <div key={group.titleKey} className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <h3 className="font-semibold text-slate-900 mb-3 px-1">{t(group.titleKey)}</h3>
          <div className="space-y-1">
            {group.items.map((item) => (
              <SettingsRow key={item.labelKey} icon={item.icon} label={t(item.labelKey)} />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
