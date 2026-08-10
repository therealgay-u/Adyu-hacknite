import React from 'react';

/**
 * SidebarNav component per COMPONENTS.md:
 * - Items: Dashboard, Shipments, Warehouses
 * - Icon + label per item, not icon-only
 * - Active item: slate navy background tint + navy text / active highlight
 * - Inactive: muted gray text
 *
 * @param {Object} props
 * @param {string} props.activeTab - Currently active item ID ('dashboard' | 'shipments' | 'warehouses')
 * @param {function(string): void} props.onSelectTab - Callback when item is clicked
 */
export default function SidebarNav({ activeTab = 'dashboard', onSelectTab }) {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
        </svg>
      ),
    },
    {
      id: 'shipments',
      label: 'Shipments',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20"></path>
        </svg>
      ),
    },

    {
      id: 'warehouses',
      label: 'Warehouses',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h6m-6 0V11m0 0h6m-6 0H7m6 0v10m-6-10v10"></path>
        </svg>
      ),
    },
  ];

  return (
    <aside className="w-64 bg-slate-navy text-white min-h-screen flex flex-col shrink-0">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-muted/30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-white/10 flex items-center justify-center text-emerald-400 font-bold text-lg">
            ⚡
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white leading-tight">FreshTrack AI</h1>
            <p className="text-xs text-slate-400 font-medium">Smart Cold-Chain Dispatch</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Main Navigation
        </div>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab && onSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-btn text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-slate-deep text-white shadow-sm ring-1 ring-white/10'
                  : 'text-slate-300 hover:text-white hover:bg-slate-muted/20'
              }`}
            >
              <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-muted/30 text-xs text-slate-400">
        <p className="font-medium text-slate-300">Wholesale Manager Hub</p>
        <p className="text-slate-400 mt-0.5">Vegetable & Flower Dispatch</p>
      </div>
    </aside>
  );
}
