import { ExternalLink, Loader2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { formatINR, getChange } from '../utils/formatters.js';

const tradingViewSymbolFallbacks = {
  NIFTYBEES: 'BSE:NIFTYBEES',
  RELIANCE: 'BSE:RELIANCE',
  HDFCBANK: 'BSE:HDFCBANK',
  INFY: 'BSE:INFY',
  TCS: 'BSE:TCS',
  ICICIBANK: 'BSE:ICICIBANK',
  SBIN: 'BSE:SBIN',
  TATAMOTORS: 'BSE:TATAMOTORS',
  BAJFINANCE: 'BSE:BAJFINANCE',
  GOLDIETF: 'BSE:GOLDBEES',
  LT: 'BSE:LT',
  SUNPHARMA: 'BSE:SUNPHARMA',
};

const getTradingViewSymbol = (asset) =>
  asset?.tradingViewSymbol || tradingViewSymbolFallbacks[asset?.symbol] || `${asset?.exchange}:${asset?.symbol}`;

export default function PriceChart({ asset, compact = false }) {
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const tradingViewSymbol = asset ? getTradingViewSymbol(asset) : '';

  const watchlist = useMemo(
    () => [
      'BSE:RELIANCE',
      'BSE:HDFCBANK',
      'BSE:INFY',
      'BSE:TCS',
      'BSE:ICICIBANK',
      'BSE:SBIN',
      'BSE:TATAMOTORS',
      'BSE:BAJFINANCE',
      'BSE:LT',
      'BSE:SUNPHARMA',
      'BSE:NIFTYBEES',
      'BSE:GOLDBEES',
    ],
    [],
  );

  useEffect(() => {
    if (!asset || !containerRef.current) {
      return undefined;
    }

    const container = containerRef.current;
    container.innerHTML = '';
    setIsLoading(true);

    const widget = document.createElement('div');
    widget.className = 'tradingview-widget-container__widget';
    widget.style.height = 'calc(100% - 32px)';
    widget.style.width = '100%';

    const copyright = document.createElement('div');
    copyright.className = 'tradingview-widget-copyright';
    copyright.style.height = '32px';
    copyright.style.display = 'flex';
    copyright.style.alignItems = 'center';
    copyright.style.justifyContent = 'flex-end';
    copyright.style.paddingRight = '12px';
    copyright.style.fontSize = '11px';
    copyright.style.color = '#71717a';
    copyright.innerHTML =
      '<a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank" style="color:#67e8f9;font-weight:800;text-decoration:none;">Track all markets on TradingView</a>';

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.async = true;
    script.text = JSON.stringify({
      autosize: true,
      symbol: tradingViewSymbol,
      interval: 'D',
      timezone: 'Asia/Kolkata',
      theme: 'dark',
      style: '1',
      locale: 'en',
      backgroundColor: '#0d1017',
      gridColor: 'rgba(255,255,255,0.06)',
      hide_top_toolbar: false,
      hide_side_toolbar: false,
      hide_legend: false,
      save_image: true,
      calendar: true,
      withdateranges: true,
      allow_symbol_change: true,
      show_popup_button: true,
      popup_width: '1200',
      popup_height: '800',
      studies: ['Volume@tv-basicstudies'],
      watchlist,
      details: true,
      hotlist: true,
      support_host: 'https://www.tradingview.com',
    });

    script.addEventListener('load', () => setIsLoading(false));
    script.addEventListener('error', () => setIsLoading(false));

    container.append(widget, copyright, script);

    const fallbackTimer = window.setTimeout(() => setIsLoading(false), 2500);

    return () => {
      window.clearTimeout(fallbackTimer);
      container.innerHTML = '';
    };
  }, [tradingViewSymbol, watchlist]);

  if (!asset) {
    return null;
  }

  const change = getChange(asset);
  return (
    <section className="rounded-2xl border border-white/10 bg-[#0d1017]/82 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.25)]">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">
            TradingView advanced chart
          </p>
          <h2 className="mt-1 text-2xl font-black text-white">{asset.symbol}</h2>
          <p className="text-sm text-zinc-400">
            {asset.name} - {tradingViewSymbol}
          </p>
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

      <div
        className={`relative overflow-hidden rounded-xl border border-white/10 bg-[#0a0c12] ${
          compact ? 'h-[28rem]' : 'h-[35rem]'
        }`}
      >
        {isLoading && (
          <div className="absolute inset-0 z-10 grid place-items-center bg-[#0a0c12]">
            <div className="flex items-center gap-3 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-sm font-black text-cyan-200">
              <Loader2 size={18} className="animate-spin" />
              Loading TradingView
            </div>
          </div>
        )}
        <div
          ref={containerRef}
          key={tradingViewSymbol}
          className="tradingview-widget-container h-full w-full"
          aria-label={`${asset.symbol} TradingView chart`}
        />
      </div>

      <a
        href={`https://www.tradingview.com/chart/?symbol=${encodeURIComponent(tradingViewSymbol)}`}
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-200 transition hover:text-white"
      >
        Open full TradingView
        <ExternalLink size={14} />
      </a>
    </section>
  );
}
