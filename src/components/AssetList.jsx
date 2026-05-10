import { Star, TrendingDown, TrendingUp } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  selectSymbol,
  toggleWatchlist,
} from '../features/trading/tradingSlice.js';
import { formatINR, formatNumber, getChange } from '../utils/formatters.js';

export default function AssetList({ assets, watchlist, selectedSymbol, showTrade = true }) {
  const dispatch = useDispatch();
  const compactRows = useSelector((state) => state.trading.preferences.compactRows);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d1017]/82">
      <div className="hidden min-w-[760px] grid-cols-[1.5fr_0.8fr_0.8fr_0.8fr_0.7fr] gap-4 border-b border-white/10 px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-zinc-500 md:grid">
        <span>Instrument</span>
        <span>Price</span>
        <span>Day</span>
        <span>Volume</span>
        <span className="text-right">Action</span>
      </div>

      <div className="divide-y divide-white/10">
        {assets.map((asset) => {
          const change = getChange(asset);
          const isSelected = selectedSymbol === asset.symbol;
          const isWatched = watchlist.includes(asset.symbol);
          const TrendIcon = change.isPositive ? TrendingUp : TrendingDown;

          return (
            <div
              key={asset.symbol}
              className={`grid gap-3 px-4 py-4 transition md:grid-cols-[1.5fr_0.8fr_0.8fr_0.8fr_0.7fr] md:items-center md:px-5 ${
                compactRows ? 'md:py-3' : 'md:py-5'
              } ${isSelected ? 'bg-cyan-300/[0.055]' : 'hover:bg-white/[0.035]'}`}
            >
              <button
                type="button"
                onClick={() => dispatch(selectSymbol(asset.symbol))}
                className="flex min-w-0 items-center gap-3 text-left"
              >
                <span
                  className={`grid size-11 shrink-0 place-items-center rounded-xl border text-sm font-black ${
                    isSelected
                      ? 'border-cyan-300/40 bg-cyan-300/10 text-cyan-200'
                      : 'border-white/10 bg-white/5 text-zinc-300'
                  }`}
                >
                  {asset.symbol.slice(0, 2)}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-black text-white">{asset.symbol}</span>
                  <span className="block truncate text-sm text-zinc-500">{asset.name}</span>
                </span>
              </button>

              <div>
                <p className="text-sm font-black text-white md:text-base">{formatINR(asset.price)}</p>
                <p className="text-xs font-semibold text-zinc-500">{asset.sector}</p>
              </div>

              <div className={`flex items-center gap-2 font-black ${change.isPositive ? 'text-emerald-300' : 'text-rose-300'}`}>
                <TrendIcon size={16} />
                <span>
                  {change.isPositive ? '+' : ''}
                  {change.changePercent.toFixed(2)}%
                </span>
              </div>

              <p className="text-sm font-bold text-zinc-400">{formatNumber(asset.volume)}</p>

              <div className="flex justify-start gap-2 md:justify-end">
                <button
                  type="button"
                  onClick={() => dispatch(toggleWatchlist(asset.symbol))}
                  className={`grid size-10 place-items-center rounded-xl border transition ${
                    isWatched
                      ? 'border-amber-300/40 bg-amber-300/10 text-amber-200'
                      : 'border-white/10 bg-white/5 text-zinc-400 hover:text-white'
                  }`}
                  aria-label={isWatched ? `Remove ${asset.symbol} from watchlist` : `Add ${asset.symbol} to watchlist`}
                  title={isWatched ? 'Remove from watchlist' : 'Add to watchlist'}
                >
                  <Star size={17} fill={isWatched ? 'currentColor' : 'none'} />
                </button>
                {showTrade && (
                  <Link
                    to="/trade"
                    onClick={() => dispatch(selectSymbol(asset.symbol))}
                    className="rounded-xl bg-white px-4 py-2 text-sm font-black text-zinc-950 transition hover:bg-cyan-100"
                  >
                    Trade
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
