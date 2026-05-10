import { Bell, Check, RotateCcw, Shield, Volume2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  resetDemo,
  updatePreference,
} from '../features/trading/tradingSlice.js';
import { formatINR } from '../utils/formatters.js';

function Toggle({ label, description, icon: Icon, checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#0d1017]/82 p-4 text-left transition hover:bg-white/[0.055]"
    >
      <span className="flex min-w-0 items-center gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-200">
          <Icon size={18} />
        </span>
        <span className="min-w-0">
          <span className="block font-black text-white">{label}</span>
          <span className="block text-sm text-zinc-500">{description}</span>
        </span>
      </span>
      <span
        className={`grid size-7 shrink-0 place-items-center rounded-full border ${
          checked ? 'border-emerald-300/40 bg-emerald-300 text-emerald-950' : 'border-white/10 bg-white/5 text-transparent'
        }`}
      >
        <Check size={15} />
      </span>
    </button>
  );
}

export default function Settings() {
  const dispatch = useDispatch();
  const account = useSelector((state) => state.trading.account);
  const preferences = useSelector((state) => state.trading.preferences);

  return (
    <div className="space-y-6">
      <section>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">Settings</p>
        <h2 className="mt-1 text-3xl font-black text-white">Demo account controls</h2>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="rounded-2xl border border-white/10 bg-[#0d1017]/82 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">Account</p>
          <h3 className="mt-1 text-2xl font-black text-white">{account.name}</h3>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/[0.035] p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">Starting balance</p>
              <p className="mt-1 text-xl font-black text-white">{formatINR(account.startingCash, 0)}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.035] p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">Current cash</p>
              <p className="mt-1 text-xl font-black text-white">{formatINR(account.cash, 0)}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.035] p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">Mode</p>
              <p className="mt-1 text-xl font-black text-white">{account.mode}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.035] p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">Risk profile</p>
              <p className="mt-1 text-xl font-black text-white">{account.riskProfile}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => dispatch(resetDemo())}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-4 text-sm font-black uppercase tracking-[0.18em] text-zinc-950 transition hover:bg-amber-100"
          >
            <RotateCcw size={17} />
            Reset to ₹10 lakh
          </button>
        </div>

        <div className="space-y-3">
          <Toggle
            label="Order confirmations"
            description="Keep confirmation preference stored locally"
            icon={Shield}
            checked={preferences.confirmOrders}
            onChange={(value) => dispatch(updatePreference({ key: 'confirmOrders', value }))}
          />
          <Toggle
            label="Compact market rows"
            description="Reduce vertical spacing in market tables"
            icon={Bell}
            checked={preferences.compactRows}
            onChange={(value) => dispatch(updatePreference({ key: 'compactRows', value }))}
          />
          <Toggle
            label="Sound alerts"
            description="Preference only for this demo workspace"
            icon={Volume2}
            checked={preferences.sound}
            onChange={(value) => dispatch(updatePreference({ key: 'sound', value }))}
          />
        </div>
      </section>
    </div>
  );
}
