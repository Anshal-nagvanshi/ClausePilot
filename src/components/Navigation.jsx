import React from 'react';

const APP_VIEWS = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'contracts', label: 'Contracts' },
    { id: 'contract-details', label: 'Doc Viewer' },
    { id: 'upload', label: 'Upload' },
    { id: 'obligations', label: 'Obligations' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'alerts', label: 'Alerts' },
    { id: 'compare', label: 'Compare' },
    { id: 'ask-ai', label: 'Ask AI' },
    { id: 'reports', label: 'Reports' },
    { id: 'settings', label: 'Settings' },
];

export default function Navigation({ mainPage, setMainPage, appView, setAppView }) {
    return (
        <header className="bg-slate-900 text-white px-4 py-2 text-xs flex flex-wrap items-center justify-between border-b border-slate-800 z-50 sticky top-0 shadow-md">
            <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 font-bold text-brand-400 bg-brand-900/50 px-2.5 py-1 rounded-lg border border-brand-700/50">
                    <i className="fa-solid fa-layer-group text-xs"></i> ClausePilot Workspace
                </span>
                <span className="text-slate-400 hidden lg:inline">| Switch View:</span>
            </div>
            <div className="flex flex-wrap gap-1 items-center">
                <button
                    onClick={() => setMainPage('landing')}
                    className={`font-medium px-2.5 py-1 rounded transition ${mainPage === 'landing' ? 'bg-brand-600 text-white hover:bg-brand-500' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'}`}
                >
                    <i className="fa-solid fa-globe mr-1"></i> Landing Page
                </button>
                <button
                    onClick={() => setMainPage('login')}
                    className={`font-medium px-2.5 py-1 rounded transition ${mainPage === 'login' ? 'bg-brand-600 text-white hover:bg-brand-500' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'}`}
                >
                    <i className="fa-solid fa-right-to-bracket mr-1"></i> Sign In / Up
                </button>
                <span className="text-slate-600 mx-1">|</span>
                <span className="text-slate-400 text-[11px] uppercase tracking-wider font-semibold">App Views:</span>

                {APP_VIEWS.map(view => (
                    <button
                        key={view.id}
                        onClick={() => setAppView(view.id)}
                        className={`font-medium px-2 py-1 rounded transition ${mainPage === 'app' && appView === view.id ? 'bg-brand-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'}`}
                    >
                        {view.label}
                        {view.badge && <span className="ml-1 bg-rose-500 text-white px-1.5 rounded-full text-[10px]">{view.badge}</span>}
                    </button>
                ))}
            </div>
        </header>
    );
}
