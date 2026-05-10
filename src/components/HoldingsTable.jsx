import { ArrowRight, BriefcaseBusiness } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { selectSymbol } from '../features/trading/tradingSlice.js';
import { formatINR, formatPercent } from '../utils/formatters.js';

export default function HoldingsTable({ holdings }) {
  const dispatch = useDispatch();

  if (!holdings.length) {
    return (
      <div className="rounded-2xl border border-dashed border-white/14 bg-white/[0.03] p-8 text-center">
        <BriefcaseBusiness className="mx-auto text-zinc-500" size={32} />
        <p className="mt-3 font-black text-white">No holdings yet</p>
        <p className="mt-1 text-sm text-zinc-500">Buy an instrument from the trade ticket to build a paper portfolio.</p>
        <Link
          to="/trade"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-black text-zinc-950 transition hover:bg-cyan-100"
        >
          Open ticket
          <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d1017]/82">
      <div className="hidden grid-cols-[1.15fr_0.55fr_0.8fr_0.8fr_0.8fr_0.55fr] gap-4 border-b border-white/10 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-zinc-500 lg:grid">
        <span>Holding</span>
        <span>Qty</span>
        <span>Average</span>
        <span>Value</span>
        <span>P&L</span>
        <span className="text-right">Trade</span>
      </div>
      <div className="divide-y divide-white/10">
        {holdings.map((holding) => (
          <div
            key={holding.symbol}
            className="grid gap-3 px-4 py-4 lg:grid-cols-[1.15fr_0.55fr_0.8fr_0.8fr_0.8fr_0.55fr] lg:items-center lg:px-5"
          >
            <div className="min-w-0">
              <p className="truncate font-black text-white">{holding.symbol}</p>
              <p className="truncate text-sm text-zinc-500">{holding.asset?.name}</p>
            </div>
            <p className="font-bold text-zinc-300">{holding.quantity}</p>
            <p className="font-bold text-zinc-300">{formatINR(holding.averagePrice)}</p>
            <p className="font-black text-white">{formatINR(holding.marketValue)}</p>
            <div className={holding.pnl >= 0 ? 'font-black text-emerald-300' : 'font-black text-rose-300'}>
              <p>{formatINR(holding.pnl)}</p>
              <p className="text-xs">{formatPercent(holding.pnlPercent)}</p>
            </div>
            <div className="flex justify-start lg:justify-end">
              <Link
                to="/trade"
                onClick={() => dispatch(selectSymbol(holding.symbol))}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-black text-zinc-200 transition hover:bg-white hover:text-zinc-950"
              >
                Trade
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
