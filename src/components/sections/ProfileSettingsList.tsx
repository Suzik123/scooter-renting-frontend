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
import SettingsRow from '../ui/SettingsRow';

interface SettingsGroup {
  title: string;
  items: ReadonlyArray<{ icon: ComponentType<{ size?: number; className?: string }>; label: string }>;
}

const GROUPS: readonly SettingsGroup[] = [
  {
    title: 'Account Settings',
    items: [
      { icon: User, label: 'Personal Information' },
      { icon: Shield, label: 'Security & Privacy' },
      { icon: CreditCard, label: 'Payment Methods' },
      { icon: Bell, label: 'Notifications' },
    ],
  },
  {
    title: 'App Preferences',
    items: [
      { icon: Moon, label: 'Appearance' },
      { icon: Globe, label: 'Language & Region' },
      { icon: MapPin, label: 'Location Settings' },
    ],
  },
  {
    title: 'Support',
    items: [
      { icon: HelpCircle, label: 'Help Center' },
      { icon: MessageCircle, label: 'Contact Support' },
      { icon: FileText, label: 'Terms & Conditions' },
    ],
  },
];

export default function ProfileSettingsList() {
  return (
    <>
      {GROUPS.map((group) => (
        <div key={group.title} className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <h3 className="font-semibold text-slate-900 mb-3 px-1">{group.title}</h3>
          <div className="space-y-1">
            {group.items.map((item) => (
              <SettingsRow key={item.label} icon={item.icon} label={item.label} />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
