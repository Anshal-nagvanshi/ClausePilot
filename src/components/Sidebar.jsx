import React from 'react';

const NAV_ITEMS = [
    { id: 'dashboard', icon: 'fa-house', label: 'Dashboard' },
    { id: 'contracts', icon: 'fa-folder-closed', label: 'Contracts' },
    { id: 'upload', icon: 'fa-cloud-arrow-up', label: 'Upload' },
    { id: 'obligations', icon: 'fa-list-check', label: 'Obligations' },
    { id: 'timeline', icon: 'fa-regular fa-calendar-days', label: 'Timeline' },
    { id: 'alerts', icon: 'fa-regular fa-bell', label: 'Alerts' },
    { id: 'compare', icon: 'fa-code-compare', label: 'Compare' },
    { id: 'ask-ai', icon: 'fa-wand-magic-sparkles', label: 'Ask AI', iconColor: 'text-brand-600' },
    { id: 'reports', icon: 'fa-chart-pie', label: 'Reports' },
    { id: 'settings', icon: 'fa-gear', label: 'Settings' },
];

export default function Sidebar({ appView, setAppView, alertCount = 0 }) {
    return (
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between flex-shrink-0 z-20">
            <div className="p-4">
                <div
                    className="flex items-center gap-3 px-2 py-3 mb-4 cursor-pointer"
                    onClick={() => setAppView('dashboard')}
                >
                    <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-brand-500/20 font-bold">
                        <i className="fa-solid fa-file-contract"></i>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold font-heading text-slate-900 tracking-tight leading-none">
                            Clause<span className="text-brand-600">Pilot</span>
                        </span>
                        <span className="text-[8px] uppercase font-bold text-slate-400 mt-0.5 tracking-wider">
                            SMARTER CONTRACTS &bull; SAFER BUSINESS
                        </span>
                    </div>
                </div>

                <nav className="space-y-1">
                    {NAV_ITEMS.map(item => {
                        const isActive = appView === item.id;
                        const badgeCount = item.id === 'alerts' ? alertCount : (item.badge || 0);
                        return (
                            <a
                                key={item.id}
                                href="#"
                                onClick={(e) => { e.preventDefault(); setAppView(item.id); }}
                                className={`flex items-center px-3 py-2.5 rounded-xl text-sm transition ${isActive
                                    ? 'bg-brand-50 text-brand-700 font-bold border-r-4 border-brand-600'
                                    : 'font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                }`}
                            >
                                <span className="flex items-center gap-3 flex-1">
                                    <i className={`fa-solid ${item.icon} w-5 text-center ${isActive ? '' : (item.iconColor || '')}`}></i>
                                    {item.label}
                                </span>
                                {badgeCount > 0 && (
                                    <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                        {badgeCount}
                                    </span>
                                )}
                            </a>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
}
