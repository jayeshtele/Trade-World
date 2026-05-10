import { ClipboardList, Hourglass, Layers3 } from 'lucide-react';
import { useSelector } from 'react-redux';
import MetricCard from '../components/MetricCard.jsx';
import OrdersTable from '../components/OrdersTable.jsx';
import { selectOpenOrders } from '../features/trading/tradingSlice.js';
import { formatINR } from '../utils/formatters.js';

export default function Orders() {
  const orders = useSelector((state) => state.trading.orders);
  const openOrders = useSelector(selectOpenOrders);
  const executedValue = orders
    .filter((order) => order.status === 'Executed')
    .reduce((sum, order) => sum + (order.value || 0), 0);
  const rejectedOrders = orders.filter((order) => order.status === 'Rejected').length;

  return (
    <div className="space-y-6">
      <section>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">Orders</p>
        <h2 className="mt-1 text-3xl font-black text-white">Execution history</h2>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="All orders" value={orders.length} helper="Latest first" icon={ClipboardList} tone="cyan" />
        <MetricCard label="Pending" value={openOrders.length} helper="Limit orders waiting" icon={Hourglass} tone="amber" />
        <MetricCard label="Executed value" value={formatINR(executedValue, 0)} helper={`${rejectedOrders} rejected`} icon={Layers3} tone="emerald" />
      </section>

      <OrdersTable orders={orders} />
    </div>
  );
}
