import React from 'react';

export function PnlChart({ data }) {
  const maxVal = Math.max(...data.map((d) => Math.abs(d.pnl)), 1000);

  return (
    <div className="h-48 flex items-end justify-between gap-2 pt-4 px-2">
      {data.map((d, i) => {
        const height = (Math.abs(d.pnl) / maxVal) * 80;
        const isPositive = d.pnl >= 0;
        return (
          <div key={d.id ?? i} className="flex flex-col items-center gap-2 flex-1 group relative">
            <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-brand-dark text-white text-xs p-2 rounded pointer-events-none whitespace-nowrap z-10 border border-brand/40">
              <div className="font-bold text-brand">{d.date}</div>
              <div className={isPositive ? 'text-brand' : 'text-rose-400'}>
                {d.pnl > 0 ? '+' : ''}{d.pnl}$
              </div>
            </div>
            <div
              className={`w-full rounded-t-sm transition-all duration-500 hover:opacity-80 ${isPositive ? 'bg-brand' : 'bg-rose-500'}`}
              style={{ height: `${Math.max(height, 5)}%` }}
            />
            <span className="text-[10px] text-slate-400 dark:text-on-brand-muted hidden md:block">{d.date.split('-')[2]}</span>
          </div>
        );
      })}
    </div>
  );
}
