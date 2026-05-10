import { Ban, Clock3 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { cancelOrder } from '../features/trading/tradingSlice.js';
import { formatINR } from '../utils/formatters.js';

export default function OrdersTable({ orders, allowCancel = true }) {
  const dispatch = useDispatch();

  if (!orders.length) {
    return (
      <div className="rounded-2xl border border-dashed border-white/14 bg-white/[0.03] p-8 text-center">
        <Clock3 className="mx-auto text-zinc-500" size={30} />
        <p className="mt-3 font-black text-white">No orders yet</p>
        <p className="mt-1 text-sm text-zinc-500">Executed and pending trades will appear here.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d1017]/82">
      <div className="hidden grid-cols-[0.85fr_0.7fr_0.7fr_0.65fr_0.8fr_0.8fr_0.6fr] gap-4 border-b border-white/10 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-zinc-500 lg:grid">
        <span>Time</span>
        <span>Symbol</span>
        <span>Side</span>
        <span>Qty</span>
        <span>Price</span>
        <span>Status</span>
        <span className="text-right">Manage</span>
      </div>
      <div className="divide-y divide-white/10">
        {orders.map((order) => {
          const statusClass =
            order.status === 'Executed'
              ? 'border-emerald-300/25 bg-emerald-300/10 text-emerald-200'
              : order.status === 'Pending'
                ? 'border-amber-300/25 bg-amber-300/10 text-amber-200'
                : order.status === 'Cancelled'
                  ? 'border-zinc-300/20 bg-zinc-300/10 text-zinc-300'
                  : 'border-rose-300/25 bg-rose-300/10 text-rose-200';

          return (
            <div
              key={order.id}
              className="grid gap-3 px-4 py-4 text-sm lg:grid-cols-[0.85fr_0.7fr_0.7fr_0.65fr_0.8fr_0.8fr_0.6fr] lg:items-center lg:px-5"
            >
              <div>
                <p className="font-black text-white">{order.executedAt || order.createdAt}</p>
                <p className="text-xs text-zinc-500">{order.id}</p>
              </div>
              <p className="font-black text-white">{order.symbol}</p>
              <p className={order.side === 'BUY' ? 'font-black text-emerald-300' : 'font-black text-rose-300'}>
                {order.side}
              </p>
              <p className="font-bold text-zinc-300">{order.quantity}</p>
              <div>
                <p className="font-black text-white">
                  {formatINR(order.executionPrice || order.limitPrice || order.requestedPrice)}
                </p>
                <p className="text-xs text-zinc-500">{order.type}</p>
              </div>
              <div>
                <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-black ${statusClass}`}>
                  {order.status}
                </span>
                {order.reason && <p className="mt-1 text-xs text-zinc-500">{order.reason}</p>}
              </div>
              <div className="flex justify-start lg:justify-end">
                {allowCancel && order.status === 'Pending' ? (
                  <button
                    type="button"
                    onClick={() => dispatch(cancelOrder(order.id))}
                    className="inline-flex items-center gap-2 rounded-xl border border-rose-300/25 bg-rose-300/10 px-3 py-2 text-xs font-black text-rose-200 transition hover:bg-rose-300/20"
                  >
                    <Ban size={14} />
                    Cancel
                  </button>
                ) : (
                  <span className="text-xs font-bold text-zinc-600">Closed</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
