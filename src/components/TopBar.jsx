import React from 'react';

/**
 * TopBar component for App Shell layout.
 *
 * @param {Object} props
 * @param {string} props.title - Current page title (e.g. "Dashboard", "Shipments", "What-If Simulator")
 * @param {string} [props.subtitle] - Optional subtitle description
 */
export default function TopBar({ title = 'Dashboard', subtitle }) {
  return (
    <header className="bg-surface border-b border-slate-light px-6 py-4 flex items-center justify-between sticky top-0 z-10">
      <div>
        <h1 className="text-xl font-bold text-slate-navy leading-tight">{title}</h1>
        {subtitle && <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* Status indicator */}
        <div className="flex items-center gap-2 text-xs font-medium text-text-muted bg-background px-3 py-1.5 rounded-btn border border-slate-light">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>System Active — Mock Mode</span>
        </div>

        {/* Manager Avatar / Profile info */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-light">
          <div className="w-8 h-8 rounded-full bg-slate-navy text-white text-xs font-bold flex items-center justify-center">
            WM
          </div>
          <div className="hidden sm:block text-left">
            <span className="block text-xs font-semibold text-slate-navy leading-tight">Warehouse Mgr</span>
            <span className="block text-[10px] text-text-muted leading-tight">Bangalore Central Hub</span>
          </div>
        </div>
      </div>
    </header>
  );
}
