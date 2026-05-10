import { Donut, IndianRupee, TrendingUp, Wallet } from 'lucide-react';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import HoldingsTable from '../components/HoldingsTable.jsx';
import MetricCard from '../components/MetricCard.jsx';
import {
  selectHoldingsList,
  selectPortfolioSummary,
} from '../features/trading/tradingSlice.js';
import { formatINR, formatPercent } from '../utils/formatters.js';

export default function Portfolio() {
  const holdings = useSelector(selectHoldingsList);
  const summary = useSelector(selectPortfolioSummary);

  const allocation = useMemo(() => {
    if (!summary.marketValue) {
      return [];
    }

    return holdings.map((holding) => ({
      symbol: holding.symbol,
      weight: (holding.marketValue / summary.marketValue) * 100,
      value: holding.marketValue,
    }));
  }, [holdings, summary.marketValue]);

  return (
    <div className="space-y-6">
      <section>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">Portfolio</p>
        <h2 className="mt-1 text-3xl font-black text-white">Paper holdings and P&L</h2>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Cash" value={formatINR(summary.cash, 0)} helper="Available demo balance" icon={Wallet} tone="cyan" />
        <MetricCard label="Invested" value={formatINR(summary.invested, 0)} helper="Cost including charges" icon={IndianRupee} tone="amber" />
        <MetricCard label="Market value" value={formatINR(summary.marketValue, 0)} helper="Live paper value" icon={Donut} tone="violet" />
        <MetricCard
          label="Net P&L"
          value={formatINR(summary.netPnl, 0)}
          helper={formatPercent(summary.netPnlPercent)}
          icon={TrendingUp}
          tone={summary.netPnl >= 0 ? 'emerald' : 'rose'}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <HoldingsTable holdings={holdings} />
        <div className="rounded-2xl border border-white/10 bg-[#0d1017]/82 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">Allocation</p>
          <h3 className="mt-1 text-2xl font-black text-white">Exposure mix</h3>
          <div className="mt-5 space-y-4">
            {allocation.length ? (
              allocation.map((item) => (
                <div key={item.symbol}>
                  <div className="mb-2 flex justify-between gap-3 text-sm">
                    <span className="font-black text-white">{item.symbol}</span>
                    <span className="font-bold text-zinc-400">
                      {item.weight.toFixed(1)}% · {formatINR(item.value, 0)}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,#22d3ee,#34d399,#facc15)]"
                      style={{ width: `${Math.min(100, item.weight)}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-zinc-500">Allocation appears after your first buy order.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
