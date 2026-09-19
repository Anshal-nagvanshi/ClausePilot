import React from 'react';
import { supabase } from '../lib/supabaseClient';

export default function TopHeader({ setAppView, switchMainPage, isUserMenuOpen, setIsUserMenuOpen, user }) {
    const displayName = user?.user_metadata?.full_name || (user?.email ? user.email.split('@')[0] : 'John Doe');
    const displayEmail = user?.email || 'john@company.com';
    const initials = displayName
        .split(' ')
        .filter(Boolean)
        .map(n => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase() || 'JD';

    return (
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between gap-4 z-10">
            <div className="relative flex-1 max-w-md">
                <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-slate-400 text-xs"></i>
                <input type="text" placeholder="Search contracts, clauses, obligations, or ask a question..." className="w-full pl-9 pr-16 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50" />
                <span className="absolute right-3 top-2.5 text-[10px] bg-slate-200 text-slate-600 font-mono px-1.5 py-0.5 rounded">Ctrl + K</span>
            </div>

            <div className="flex items-center gap-4">
                <button onClick={() => setAppView('alerts')} className="relative text-slate-500 hover:text-slate-800 p-2 rounded-lg hover:bg-slate-100">
                    <i className="fa-regular fa-bell text-base"></i>
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
                </button>

                <div className="relative pl-3 border-l border-slate-200">
                    <button
                        id="user-menu-btn"
                        onClick={(e) => { e.stopPropagation(); setIsUserMenuOpen(!isUserMenuOpen); }}
                        className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 transition focus:outline-none"
                    >
                        <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                            {initials}
                        </div>
                        <div className="hidden sm:block text-left">
                            <div className="text-xs font-bold text-slate-900 leading-tight">{displayName}</div>
                            <div className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">Active Account</div>
                        </div>
                        <i className={`fa-solid fa-chevron-down text-slate-400 text-[10px] transition-transform duration-200 ml-0.5 ${isUserMenuOpen ? 'rotate-180' : ''}`}></i>
                    </button>

                    {isUserMenuOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)}></div>
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 z-50">
                                <div className="px-4 py-2.5 border-b border-slate-100">
                                    <p className="text-xs font-bold text-slate-900">{displayName}</p>
                                    <p className="text-[11px] text-slate-500 font-medium truncate">{displayEmail}</p>
                                    <span className="inline-block mt-1 bg-brand-50 text-brand-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Pro Account</span>
                                </div>

                                <div className="py-1">
                                    <button onClick={() => { setAppView('settings'); setIsUserMenuOpen(false); }} className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 hover:text-brand-600 font-medium flex items-center gap-2.5 transition">
                                        <i className="fa-solid fa-gear text-slate-400 w-4 text-center"></i> Settings &amp; Preferences
                                    </button>
                                    <button onClick={() => { setAppView('settings'); setIsUserMenuOpen(false); }} className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 hover:text-brand-600 font-medium flex items-center gap-2.5 transition">
                                        <i className="fa-regular fa-user text-slate-400 w-4 text-center"></i> Edit Profile
                                    </button>
                                    <button onClick={() => { setAppView('reports'); setIsUserMenuOpen(false); }} className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 hover:text-brand-600 font-medium flex items-center gap-2.5 transition">
                                        <i className="fa-solid fa-chart-pie text-slate-400 w-4 text-center"></i> Analytics &amp; Reports
                                    </button>
                                    <button onClick={() => { switchMainPage && switchMainPage('landing'); setIsUserMenuOpen(false); }} className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 hover:text-brand-600 font-medium flex items-center gap-2.5 transition">
                                        <i className="fa-solid fa-globe text-slate-400 w-4 text-center"></i> Website Home
                                    </button>
                                </div>

                                <div className="border-t border-slate-100 py-1">
                                    <button
                                        onClick={async () => { 
                                            try {
                                                await supabase.auth.signOut();
                                            } catch (e) {
                                                console.error('Sign out error:', e);
                                            }
                                            switchMainPage && switchMainPage('login'); 
                                            setIsUserMenuOpen(false); 
                                        }}
                                        className="w-full px-4 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 font-semibold flex items-center gap-2.5 transition"
                                    >
                                        <i className="fa-solid fa-right-from-bracket text-rose-500 w-4 text-center"></i> Log Out
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
