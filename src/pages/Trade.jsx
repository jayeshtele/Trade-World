import { ShieldCheck, TimerReset } from 'lucide-react';
import { useSelector } from 'react-redux';
import OrdersTable from '../components/OrdersTable.jsx';
import PriceChart from '../components/PriceChart.jsx';
import TradeTicket from '../components/TradeTicket.jsx';
import {
  selectOpenOrders,
  selectSelectedAsset,
} from '../features/trading/tradingSlice.js';

export default function Trade() {
  const selectedAsset = useSelector(selectSelectedAsset);
  const openOrders = useSelector(selectOpenOrders);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1fr_auto_auto] lg:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">Trade</p>
          <h2 className="mt-1 text-3xl font-black text-white">Place demo orders</h2>
        </div>
        <div className="inline-flex items-center gap-3 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-cyan-200">
          <ShieldCheck size={18} />
          <span className="text-sm font-black">Paper account only</span>
        </div>
        <div className="inline-flex items-center gap-3 rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-amber-200">
          <TimerReset size={18} />
          <span className="text-sm font-black">Prices pulse every few seconds</span>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(360px,0.75fr)_minmax(0,1.25fr)]">
        <TradeTicket />
        <PriceChart asset={selectedAsset} />
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">Open orders</p>
          <h2 className="mt-1 text-2xl font-black text-white">Pending limit book</h2>
        </div>
        <OrdersTable orders={openOrders} />
      </section>
    </div>
  );
}
