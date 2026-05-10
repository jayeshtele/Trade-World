import { CheckCircle2, Info, RotateCcw, ShieldCheck, Zap } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearTradeNotice,
  placeOrder,
  selectAssets,
  selectSelectedAsset,
  selectSelectedSymbol,
  selectSymbol,
} from '../features/trading/tradingSlice.js';
import { formatINR } from '../utils/formatters.js';

const quickQuantities = [1, 5, 10, 25];

export default function TradeTicket() {
  const dispatch = useDispatch();
  const assets = useSelector(selectAssets);
  const selectedSymbol = useSelector(selectSelectedSymbol);
  const selectedAsset = useSelector(selectSelectedAsset);
  const notice = useSelector((state) => state.trading.tradeNotice);
  const cash = useSelector((state) => state.trading.account.cash);
  const holding = useSelector((state) => state.trading.holdings[selectedSymbol]);
  const [side, setSide] = useState('BUY');
  const [type, setType] = useState('MARKET');
  const [quantity, setQuantity] = useState(5);
  const [limitPrice, setLimitPrice] = useState(selectedAsset.price);

  useEffect(() => {
    setLimitPrice(selectedAsset.price);
  }, [selectedAsset.price, selectedAsset.symbol]);

  const estimate = useMemo(() => {
    const qty = Number(quantity) || 0;
    const price = type === 'LIMIT' ? Number(limitPrice) || 0 : selectedAsset.price;
    const value = qty * price;
    const charges = Math.max(20, value * 0.00032);

    return {
      value,
      charges,
      total: side === 'BUY' ? value + charges : Math.max(0, value - charges),
    };
  }, [limitPrice, quantity, selectedAsset.price, side, type]);

  const submitOrder = (event) => {
    event.preventDefault();
    dispatch(
      placeOrder({
        symbol: selectedSymbol,
        side,
        type,
        quantity: Number(quantity),
        limitPrice: Number(limitPrice),
      }),
    );
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-[#0d1017]/82 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.25)]">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">Order ticket</p>
          <h2 className="mt-1 text-2xl font-black text-white">{selectedSymbol}</h2>
          <p className="text-sm text-zinc-400">{selectedAsset.name}</p>
        </div>
        <div className="rounded-xl border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-right text-emerald-200">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-300/70">Cash</p>
          <p className="font-black">{formatINR(cash, 0)}</p>
        </div>
      </div>

      <form className="space-y-5" onSubmit={submitOrder}>
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">Instrument</span>
          <select
            data-testid="trade-symbol"
            value={selectedSymbol}
            onChange={(event) => dispatch(selectSymbol(event.target.value))}
            className="mt-2 w-full rounded-xl border border-white/10 bg-[#070910] px-4 py-3 font-bold text-white outline-none ring-cyan-300/30 transition focus:ring-4"
          >
            {assets.map((asset) => (
              <option key={asset.symbol} value={asset.symbol}>
                {asset.symbol} - {asset.name}
              </option>
            ))}
          </select>
        </label>

        <div className="grid grid-cols-2 gap-2 rounded-xl border border-white/10 bg-black/20 p-1">
          {['BUY', 'SELL'].map((option) => (
            <button
              key={option}
              data-testid={`${option.toLowerCase()}-side`}
              type="button"
              onClick={() => setSide(option)}
              className={`rounded-lg px-4 py-3 text-sm font-black transition ${
                side === option
                  ? option === 'BUY'
                    ? 'bg-emerald-400 text-emerald-950'
                    : 'bg-rose-400 text-rose-950'
                  : 'text-zinc-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {['MARKET', 'LIMIT'].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setType(option)}
              className={`rounded-xl border px-4 py-3 text-sm font-black transition ${
                type === option
                  ? 'border-cyan-300/40 bg-cyan-300/10 text-cyan-200'
                  : 'border-white/10 bg-white/5 text-zinc-400 hover:text-white'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">Quantity</span>
            <input
              data-testid="trade-quantity"
              type="number"
              min="1"
              step="1"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#070910] px-4 py-3 font-bold text-white outline-none ring-cyan-300/30 transition focus:ring-4"
            />
          </label>

          <label className="block">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">Limit price</span>
            <input
              type="number"
              min="1"
              step="0.05"
              value={limitPrice}
              disabled={type === 'MARKET'}
              onChange={(event) => setLimitPrice(event.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#070910] px-4 py-3 font-bold text-white outline-none ring-cyan-300/30 transition focus:ring-4 disabled:cursor-not-allowed disabled:opacity-45"
            />
          </label>
        </div>

        <div className="flex flex-wrap gap-2">
          {quickQuantities.map((qty) => (
            <button
              key={qty}
              type="button"
              onClick={() => setQuantity(qty)}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-black text-zinc-300 transition hover:border-white/20 hover:text-white"
            >
              {qty}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setQuantity(1);
              setType('MARKET');
              setSide('BUY');
            }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-black text-zinc-300 transition hover:border-white/20 hover:text-white"
          >
            <RotateCcw size={13} />
            Reset
          </button>
        </div>

        <div className="grid gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-zinc-500">Reference price</span>
            <span className="font-black text-white">{formatINR(selectedAsset.price)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-zinc-500">Estimated value</span>
            <span className="font-black text-white">{formatINR(estimate.value)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-zinc-500">Charges</span>
            <span className="font-black text-white">{formatINR(estimate.charges)}</span>
          </div>
          <div className="flex justify-between gap-4 border-t border-white/10 pt-3">
            <span className="font-black text-zinc-300">{side === 'BUY' ? 'Debit' : 'Credit'}</span>
            <span className="font-black text-white">{formatINR(estimate.total)}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <ShieldCheck size={16} className="text-cyan-300" />
            <span>Holding: {holding?.quantity || 0} shares</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Zap size={16} className="text-amber-300" />
            <span>Paper execution</span>
          </div>
        </div>

        {notice && (
          <div
            className={`flex items-start gap-3 rounded-xl border p-4 ${
              notice.tone === 'danger'
                ? 'border-rose-300/25 bg-rose-300/10 text-rose-100'
                : notice.tone === 'warning'
                  ? 'border-amber-300/25 bg-amber-300/10 text-amber-100'
                  : notice.tone === 'success'
                    ? 'border-emerald-300/25 bg-emerald-300/10 text-emerald-100'
                    : 'border-cyan-300/25 bg-cyan-300/10 text-cyan-100'
            }`}
          >
            {notice.tone === 'success' ? <CheckCircle2 size={18} /> : <Info size={18} />}
            <div className="min-w-0 flex-1">
              <p className="font-black">{notice.title}</p>
              <p className="text-sm opacity-80">{notice.message}</p>
            </div>
            <button
              type="button"
              onClick={() => dispatch(clearTradeNotice())}
              className="text-xs font-black uppercase tracking-[0.16em] opacity-70 hover:opacity-100"
            >
              Clear
            </button>
          </div>
        )}

        <button
          data-testid="submit-order"
          type="submit"
          className={`flex w-full items-center justify-center gap-2 rounded-xl px-5 py-4 text-sm font-black uppercase tracking-[0.18em] transition ${
            side === 'BUY'
              ? 'bg-emerald-400 text-emerald-950 hover:bg-emerald-300'
              : 'bg-rose-400 text-rose-950 hover:bg-rose-300'
          }`}
        >
          {side === 'BUY' ? 'Buy' : 'Sell'} {selectedSymbol}
        </button>
      </form>
    </section>
  );
}
