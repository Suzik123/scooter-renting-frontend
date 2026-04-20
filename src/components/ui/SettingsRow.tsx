import { ChevronRight } from 'lucide-react';
import type { ComponentType, ReactNode } from 'react';
import IconTile from './IconTile';

interface SettingsRowProps {
  icon: ComponentType<{ size?: number; className?: string }>;
  label: string;
  onClick?: () => void;
  trailing?: ReactNode;
  as?: 'button' | 'div';
}

export default function SettingsRow({ icon: Icon, label, onClick, trailing, as = 'button' }: SettingsRowProps) {
  const content = (
    <>
      <div className="flex items-center gap-3">
        <IconTile tone="slate">
          <Icon size={18} className="text-slate-600" />
        </IconTile>
        <span className="text-sm font-medium text-slate-700">{label}</span>
      </div>
      {trailing ?? <ChevronRight size={16} className="text-slate-300" />}
    </>
  );

  if (as === 'div') {
    return (
      <div className="w-full flex items-center justify-between p-3 rounded-lg">
        {content}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
    >
      {content}
    </button>
  );
}
