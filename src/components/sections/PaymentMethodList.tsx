import { useWalletStore } from '../../stores/walletStore';
import PaymentMethodRow from './PaymentMethodRow';
import SectionHeader from '../ui/SectionHeader';

export default function PaymentMethodList() {
  const methods = useWalletStore((s) => s.paymentMethods);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
      <SectionHeader
        title="Payment Methods"
        className="mb-4"
        action={
          <button className="text-sm text-primary font-medium cursor-pointer hover:underline">Add</button>
        }
      />
      <div className="space-y-3">
        {methods.map((method) => (
          <PaymentMethodRow key={method.id} method={method} />
        ))}
      </div>
    </div>
  );
}
