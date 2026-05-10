import { Activity, BadgeIndianRupee, Landmark, LineChart, WalletCards } from 'lucide-react';
import { useSelector } from 'react-redux';
import MetricCard from '../components/MetricCard.jsx';
import OrdersTable from '../components/OrdersTable.jsx';
import PriceChart from '../components/PriceChart.jsx';
import TradeTicket from '../components/TradeTicket.jsx';
import AssetList from '../components/AssetList.jsx';
import {
  selectOpenOrders,
  selectPortfolioSummary,
  selectSelectedAsset,
  selectSelectedSymbol,
  selectWatchlistAssets,
} from '../features/trading/tradingSlice.js';
import { formatINR, formatPercent } from '../utils/formatters.js';

export default function Dashboard() {
  const summary = useSelector(selectPortfolioSummary);
  const selectedAsset = useSelector(selectSelectedAsset);
  const selectedSymbol = useSelector(selectSelectedSymbol);
  const watchlistAssets = useSelector(selectWatchlistAssets);
  const watchlist = useSelector((state) => state.trading.watchlist);
  const openOrders = useSelector(selectOpenOrders);
  const recentOrders = useSelector((state) => state.trading.orders.slice(0, 4));

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total equity"
          value={formatINR(summary.equity, 0)}
          helper={`${formatPercent(summary.netPnlPercent)} overall`}
          icon={Landmark}
          tone={summary.netPnl >= 0 ? 'emerald' : 'rose'}
        />
        <MetricCard
          label="Available cash"
          value={formatINR(summary.cash, 0)}
          helper="Demo money ready"
          icon={WalletCards}
          tone="cyan"
        />
        <MetricCard
          label="Holdings value"
          value={formatINR(summary.marketValue, 0)}
          helper={`${formatINR(summary.unrealized, 0)} unrealized`}
          icon={LineChart}
          tone={summary.unrealized >= 0 ? 'emerald' : 'rose'}
        />
        <MetricCard
          label="Day P&L"
          value={formatINR(summary.dayPnl, 0)}
          helper="Based on current positions"
          icon={Activity}
          tone={summary.dayPnl >= 0 ? 'amber' : 'rose'}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.75fr)]">
        <PriceChart asset={selectedAsset} />
        <TradeTicket />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">Watchlist</p>
              <h2 className="mt-1 text-2xl font-black text-white">Market radar</h2>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-sm font-black text-cyan-200">
              <BadgeIndianRupee size={16} />
              NSE demo feed
            </div>
          </div>
          <AssetList assets={watchlistAssets} watchlist={watchlist} selectedSymbol={selectedSymbol} />
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">Activity</p>
            <h2 className="mt-1 text-2xl font-black text-white">Recent orders</h2>
          </div>
          <OrdersTable orders={openOrders.length ? openOrders : recentOrders} />
        </div>
      </section>
    </div>
  );
}
