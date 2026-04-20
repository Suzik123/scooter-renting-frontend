import { useState } from 'react';
import Button from '../ui/Button';
import { useUIStore } from '../../stores/uiStore';

export default function PromoCodeInput() {
  const [code, setCode] = useState('');
  const showToast = useUIStore((s) => s.showToast);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    showToast(`Promo code "${code}" applied`, 'success');
    setCode('');
  };

  return (
    <form
      onSubmit={handleApply}
      className="lg:hidden bg-white rounded-xl shadow-sm border border-slate-100 p-4"
    >
      <h3 className="font-semibold text-slate-900 mb-3">Promo Code</h3>
      <div className="flex gap-2">
        <label htmlFor="promo" className="sr-only">Promo code</label>
        <input
          id="promo"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter promo code"
          className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <Button type="submit" size="md">Apply</Button>
      </div>
    </form>
  );
}
