import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatINR, getChange } from '../utils/formatters.js';

export default function PriceChart({ asset, compact = false }) {
  if (!asset) {
    return null;
  }

  const change = getChange(asset);
  const stroke = change.isPositive ? '#34d399' : '#fb7185';
  const gradientId = `price-${asset.symbol}`;

  return (
    <section className="rounded-2xl border border-white/10 bg-[#0d1017]/82 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.25)]">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">
            {asset.exchange} live simulation
          </p>
          <h2 className="mt-1 text-2xl font-black text-white">{asset.symbol}</h2>
          <p className="text-sm text-zinc-400">{asset.name}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-white">{formatINR(asset.price)}</p>
          <p className={`text-sm font-black ${change.isPositive ? 'text-emerald-300' : 'text-rose-300'}`}>
            {change.isPositive ? '+' : ''}
            {formatINR(change.change)} ({change.isPositive ? '+' : ''}
            {change.changePercent.toFixed(2)}%)
          </p>
        </div>
      </div>

      <div className={compact ? 'h-56' : 'h-[19rem]'}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={asset.history} margin={{ left: 0, right: 2, top: 8, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={stroke} stopOpacity={0.45} />
                <stop offset="95%" stopColor={stroke} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis
              dataKey="label"
              minTickGap={26}
              tick={{ fill: '#71717a', fontSize: 11, fontWeight: 700 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={['dataMin - 6', 'dataMax + 6']}
              width={72}
              tickFormatter={(value) => `₹${Math.round(value).toLocaleString('en-IN')}`}
              tick={{ fill: '#71717a', fontSize: 11, fontWeight: 700 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              formatter={(value) => [formatINR(value), 'Price']}
              contentStyle={{
                background: '#10131a',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 14,
                color: '#fff',
              }}
              labelStyle={{ color: '#a1a1aa', fontWeight: 800 }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={stroke}
              strokeWidth={3}
              fill={`url(#${gradientId})`}
              activeDot={{ r: 5, strokeWidth: 2, stroke }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
