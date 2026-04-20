import { useWalletStore } from '../../stores/walletStore';
import PaymentMethodRow from './PaymentMethodRow';

export default function PaymentMethodList() {
  const methods = useWalletStore((s) => s.paymentMethods);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-900">Payment Methods</h3>
        <button className="text-sm text-primary font-medium cursor-pointer hover:underline">Add</button>
      </div>
      <div className="space-y-3">
        {methods.map((method) => (
          <PaymentMethodRow key={method.id} method={method} />
        ))}
      </div>
    </div>
  );
}
