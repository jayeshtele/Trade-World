export default function MetricCard({ label, value, helper, icon: Icon, tone = 'cyan' }) {
  const tones = {
    cyan: 'border-cyan-300/20 bg-cyan-300/10 text-cyan-200',
    emerald: 'border-emerald-300/20 bg-emerald-300/10 text-emerald-200',
    amber: 'border-amber-300/20 bg-amber-300/10 text-amber-200',
    rose: 'border-rose-300/20 bg-rose-300/10 text-rose-200',
    violet: 'border-violet-300/20 bg-violet-300/10 text-violet-200',
  };

  return (
    <article className="rounded-2xl border border-white/10 bg-[#0d1017]/82 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.25)]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">{label}</p>
          <p className="mt-3 text-2xl font-black leading-tight text-white">{value}</p>
          {helper && <p className="mt-2 text-sm font-semibold text-zinc-400">{helper}</p>}
        </div>
        {Icon && (
          <div className={`grid size-12 shrink-0 place-items-center rounded-xl border ${tones[tone]}`}>
            <Icon size={21} />
          </div>
        )}
      </div>
    </article>
  );
}
