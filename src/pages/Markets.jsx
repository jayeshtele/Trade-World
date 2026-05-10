import { Search, SlidersHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import AssetList from '../components/AssetList.jsx';
import PriceChart from '../components/PriceChart.jsx';
import {
  selectAssets,
  selectSelectedAsset,
  selectSelectedSymbol,
} from '../features/trading/tradingSlice.js';
import { getChange } from '../utils/formatters.js';

const sectors = ['All', 'Banking', 'Technology', 'Auto', 'Energy', 'Index ETF', 'Financials', 'Healthcare'];

export default function Markets() {
  const assets = useSelector(selectAssets);
  const selectedAsset = useSelector(selectSelectedAsset);
  const selectedSymbol = useSelector(selectSelectedSymbol);
  const watchlist = useSelector((state) => state.trading.watchlist);
  const [query, setQuery] = useState('');
  const [sector, setSector] = useState('All');

  const filteredAssets = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return assets.filter((asset) => {
      const matchesQuery =
        !normalizedQuery ||
        asset.symbol.toLowerCase().includes(normalizedQuery) ||
        asset.name.toLowerCase().includes(normalizedQuery) ||
        asset.sector.toLowerCase().includes(normalizedQuery);
      const matchesSector = sector === 'All' || asset.sector === sector;

      return matchesQuery && matchesSector;
    });
  }, [assets, query, sector]);

  const gainers = assets.filter((asset) => getChange(asset).isPositive).length;
  const losers = assets.length - gainers;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1fr_auto_auto] lg:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">Markets</p>
          <h2 className="mt-1 text-3xl font-black text-white">Live simulated NSE board</h2>
        </div>
        <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-5 py-3 text-emerald-200">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300/70">Advancers</p>
          <p className="text-xl font-black">{gainers}</p>
        </div>
        <div className="rounded-2xl border border-rose-300/20 bg-rose-300/10 px-5 py-3 text-rose-200">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-rose-300/70">Decliners</p>
          <p className="text-xl font-black">{losers}</p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <PriceChart asset={selectedAsset} compact />
        <div className="rounded-2xl border border-white/10 bg-[#0d1017]/82 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">Market note</p>
          <h3 className="mt-2 text-2xl font-black text-white">{selectedAsset.sentiment}</h3>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.035] p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">High</p>
              <p className="mt-1 font-black text-white">₹{selectedAsset.dayHigh.toLocaleString('en-IN')}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.035] p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">Low</p>
              <p className="mt-1 font-black text-white">₹{selectedAsset.dayLow.toLocaleString('en-IN')}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.035] p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">Volatility</p>
              <p className="mt-1 font-black text-white">{selectedAsset.volatility.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search symbol, company, sector"
              className="w-full rounded-2xl border border-white/10 bg-[#0d1017]/82 py-4 pl-12 pr-4 font-bold text-white outline-none ring-cyan-300/30 transition placeholder:text-zinc-600 focus:ring-4"
            />
          </label>
          <div className="flex items-center gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-[#0d1017]/82 p-2">
            <SlidersHorizontal className="ml-2 shrink-0 text-zinc-500" size={18} />
            {sectors.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setSector(item)}
                className={`shrink-0 rounded-xl px-3 py-2 text-xs font-black transition ${
                  sector === item ? 'bg-white text-zinc-950' : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <AssetList assets={filteredAssets} watchlist={watchlist} selectedSymbol={selectedSymbol} />
      </section>
    </div>
  );
}
