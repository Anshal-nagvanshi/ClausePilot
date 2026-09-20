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

export default function Sidebar({ appView, setAppView, alertCount = 0, isOpen = false, setIsOpen }) {
    return (
        <aside className={`
            fixed inset-y-0 left-0 z-40 w-72 max-w-[85vw] bg-white border-r border-slate-200 flex flex-col justify-between flex-shrink-0
            transform transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none
            lg:static lg:w-64 lg:translate-x-0
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
            <div className="p-4 overflow-y-auto custom-scrollbar flex-1">
                <div className="flex items-center justify-between px-2 py-3 mb-4">
                    <div
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => { setAppView('dashboard'); if (setIsOpen) setIsOpen(false); }}
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

                    {/* Mobile close button */}
                    {setIsOpen && (
                        <button
                            onClick={() => setIsOpen(false)}
                            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                            aria-label="Close sidebar"
                        >
                            <i className="fa-solid fa-xmark text-base"></i>
                        </button>
                    )}
                </div>

                <nav className="space-y-1">
                    {NAV_ITEMS.map(item => {
                        const isActive = appView === item.id;
                        const badgeCount = item.id === 'alerts' ? alertCount : (item.badge || 0);
                        return (
                            <a
                                key={item.id}
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setAppView(item.id);
                                    if (setIsOpen) setIsOpen(false);
                                }}
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
