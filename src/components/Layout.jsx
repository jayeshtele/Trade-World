import {
  Activity,
  BarChart3,
  BriefcaseBusiness,
  ClipboardList,
  Gauge,
  Menu,
  PanelLeftClose,
  Search,
  Settings,
  Sparkles,
  WalletCards,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectPortfolioSummary, selectSelectedAsset } from '../features/trading/tradingSlice.js';
import { formatINR, getChange } from '../utils/formatters.js';

const navItems = [
  { to: '/', label: 'Dashboard', icon: Gauge, end: true },
  { to: '/markets', label: 'Markets', icon: BarChart3 },
  { to: '/trade', label: 'Trade', icon: Activity },
  { to: '/portfolio', label: 'Portfolio', icon: BriefcaseBusiness },
  { to: '/orders', label: 'Orders', icon: ClipboardList },
  { to: '/settings', label: 'Settings', icon: Settings },
];

function Brand() {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="grid size-11 place-items-center rounded-xl border border-cyan-300/30 bg-cyan-300/10 text-cyan-200 shadow-[0_0_30px_rgba(34,211,238,0.16)]">
        <Sparkles size={20} />
      </div>
      <div className="min-w-0">
        <p className="truncate text-base font-black tracking-[0.22em] text-white">TRADE WORLD</p>
        <p className="truncate text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">Paper Trading</p>
      </div>
    </div>
  );
}

function NavItem({ item, onClick }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onClick}
      className={({ isActive }) =>
        [
          'group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition',
          isActive
            ? 'bg-white text-zinc-950 shadow-[0_16px_40px_rgba(255,255,255,0.08)]'
            : 'text-zinc-400 hover:bg-white/6 hover:text-white',
        ].join(' ')
      }
    >
      <Icon size={18} />
      <span>{item.label}</span>
    </NavLink>
  );
}

function TopStrip() {
  const summary = useSelector(selectPortfolioSummary);
  const selectedAsset = useSelector(selectSelectedAsset);
  const change = getChange(selectedAsset);

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#06070a]/88 backdrop-blur-2xl">
      <div className="flex min-h-20 items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-zinc-500">Live demo account</p>
          <div className="mt-1 flex min-w-0 flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-x-4">
            <h1 className="max-w-full truncate text-xl font-black text-white sm:text-2xl">Indian Markets Workspace</h1>
            <span
              className={`max-w-full shrink-0 rounded-full border px-3 py-1 text-xs font-black ${
                change.isPositive
                  ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300'
                  : 'border-rose-400/30 bg-rose-400/10 text-rose-300'
              }`}
            >
              {selectedAsset.symbol} {change.isPositive ? '+' : ''}
              {change.changePercent.toFixed(2)}%
            </span>
          </div>
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <div className="rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Available</p>
            <p className="text-lg font-black text-white">{formatINR(summary.cash, 0)}</p>
          </div>
          <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-amber-200">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300/70">Equity</p>
            <p className="text-lg font-black">{formatINR(summary.equity, 0)}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileNavItems = navItems.filter((item) => item.label !== 'Settings');

  return (
    <div className="min-h-screen bg-[#06070a] text-zinc-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-72 bg-[linear-gradient(120deg,rgba(45,212,191,0.18),rgba(251,191,36,0.08),rgba(244,63,94,0.14))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08),transparent_36%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:34px_34px]" />
      </div>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-white/10 bg-[#080a0f]/92 px-5 py-6 backdrop-blur-xl lg:block">
        <Brand />
        <nav className="mt-10 space-y-2">
          {navItems.map((item) => (
            <NavItem key={item.to} item={item} />
          ))}
        </nav>
        <div className="absolute bottom-6 left-5 right-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-emerald-400/10 text-emerald-300">
              <WalletCards size={19} />
            </div>
            <div>
              <p className="text-sm font-black text-white">₹10 lakh demo</p>
              <p className="text-xs text-zinc-500">No real money involved</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="relative z-10 lg:pl-72">
        <div className="sticky top-0 z-40 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-white/10 bg-[#06070a]/92 px-4 py-4 backdrop-blur-xl lg:hidden">
          <Brand />
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="grid size-11 place-items-center rounded-xl border border-white/10 bg-white/5 text-white"
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </button>
        </div>

        {mobileOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden">
            <div className="min-h-full w-[min(22rem,88vw)] border-r border-white/10 bg-[#080a0f] p-5">
              <div className="flex items-center justify-between">
                <Brand />
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="grid size-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-white"
                  aria-label="Close navigation"
                >
                  <X size={18} />
                </button>
              </div>
              <nav className="mt-8 space-y-2">
                {navItems.map((item) => (
                  <NavItem key={item.to} item={item} onClick={() => setMobileOpen(false)} />
                ))}
              </nav>
            </div>
          </div>
        )}

        <TopStrip />
        <main className="px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-10">
          <Outlet />
        </main>

        <nav className="fixed bottom-3 left-3 right-3 z-40 grid grid-cols-5 gap-1 overflow-hidden rounded-2xl border border-white/10 bg-[#090b10]/95 p-1 shadow-2xl backdrop-blur-xl lg:hidden">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  [
                    'grid min-h-14 min-w-0 place-items-center rounded-xl text-[10px] font-bold transition',
                    isActive ? 'bg-white text-zinc-950' : 'text-zinc-500',
                  ].join(' ')
                }
                aria-label={item.label}
              >
                <Icon size={18} />
                <span className="mt-1 hidden min-[480px]:block">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
