import React, { useEffect, useRef, useState } from 'react';
import { getDashboardStats, getRecentActivity } from '../lib/contractService';

export default function Dashboard({ setAppView, user, navigateToContract, contractsRefreshKey }) {
    const chartContractsRef = useRef(null);
    const chartInstance = useRef(null);
    const [stats, setStats] = useState(null);
    const [activity, setActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there';
    const today = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

    useEffect(() => {
        loadDashboard();
    }, [contractsRefreshKey]);

    const loadDashboard = async () => {
        try {
            const [dashStats, recentAct] = await Promise.all([
                getDashboardStats(),
                getRecentActivity(5)
            ]);
            setStats(dashStats);
            setActivity(recentAct);
        } catch (err) {
            console.error('Dashboard load error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!stats || !chartContractsRef.current || !window.Chart) return;
        if (chartInstance.current) chartInstance.current.destroy();

        const types = stats.contractsByType;
        const labels = Object.keys(types);
        const data = Object.values(types);
        const colors = ['#2563eb', '#a855f7', '#10b981', '#f59e0b', '#cbd5e1', '#f43f5e', '#06b6d4'];

        if (labels.length > 0) {
            chartInstance.current = new window.Chart(chartContractsRef.current, {
                type: 'doughnut',
                data: {
                    labels,
                    datasets: [{ data, backgroundColor: colors.slice(0, labels.length), borderWidth: 2, borderColor: '#ffffff' }]
                },
                options: { cutout: '72%', plugins: { legend: { display: false } }, responsive: true, maintainAspectRatio: false }
            });
        }
        return () => { if (chartInstance.current) chartInstance.current.destroy(); };
    }, [stats]);

    const getActivityIcon = (action) => {
        if (action?.includes('upload')) return { icon: 'fa-solid fa-cloud-arrow-up', bg: 'bg-blue-50 text-brand-600' };
        if (action?.includes('analysis') || action?.includes('ai')) return { icon: 'fa-solid fa-wand-magic-sparkles', bg: 'bg-purple-50 text-purple-600' };
        if (action?.includes('delete')) return { icon: 'fa-solid fa-trash', bg: 'bg-rose-50 text-rose-600' };
        return { icon: 'fa-solid fa-circle-check', bg: 'bg-emerald-50 text-emerald-600' };
    };

    const timeAgo = (dateStr) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        return `${Math.floor(hrs / 24)}d ago`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center space-y-2">
                    <i className="fa-solid fa-spinner fa-spin text-brand-600 text-2xl"></i>
                    <p className="text-xs text-slate-500">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    const s = stats || { totalContracts: 0, upcomingRenewals: 0, openObligations: 0, needsReview: 0, contractsByType: {}, recentContracts: [] };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight flex items-center gap-2">
                        Good Morning, {userName}! 👋
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">Here's what's happening with your contracts today.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setAppView('upload')} className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-md shadow-brand-500/20 transition flex items-center gap-1.5">
                        <i className="fa-solid fa-cloud-arrow-up"></i> Upload Contract
                    </button>
                    <div className="text-xs text-slate-500 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm flex items-center gap-2">
                        <i className="fa-regular fa-calendar text-slate-400"></i>
                        <span>{today}</span>
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-brand-600 flex items-center justify-center text-xl font-bold"><i className="fa-regular fa-file-lines"></i></div>
                    <div>
                        <div className="text-xs font-semibold text-slate-500">Total Contracts</div>
                        <div className="text-2xl font-extrabold text-slate-900 font-heading">{s.totalContracts}</div>
                    </div>
                </div>
                <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xl font-bold"><i className="fa-regular fa-calendar-check"></i></div>
                    <div>
                        <div className="text-xs font-semibold text-slate-500">Upcoming Renewals</div>
                        <div className="text-2xl font-extrabold text-slate-900 font-heading">{s.upcomingRenewals}</div>
                    </div>
                </div>
                <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center text-xl font-bold"><i className="fa-regular fa-clipboard"></i></div>
                    <div>
                        <div className="text-xs font-semibold text-slate-500">Open Obligations</div>
                        <div className="text-2xl font-extrabold text-slate-900 font-heading">{s.openObligations}</div>
                    </div>
                </div>
                <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center text-xl font-bold"><i className="fa-solid fa-triangle-exclamation"></i></div>
                    <div>
                        <div className="text-xs font-semibold text-slate-500">High Risks</div>
                        <div className="text-2xl font-extrabold text-slate-900 font-heading">{s.needsReview}</div>
                    </div>
                </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold font-heading text-slate-900">Recent Contracts</h3>
                        <button onClick={() => setAppView('contracts')} className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1">View All <i className="fa-solid fa-arrow-right text-[10px]"></i></button>
                    </div>
                    {s.recentContracts.length === 0 ? (
                        <div className="text-center py-8 text-xs text-slate-400">
                            <i className="fa-regular fa-folder-open text-2xl mb-2 block"></i>
                            No contracts yet. Upload your first contract to get started!
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-100">
                                    <tr><th className="pb-2">Name</th><th className="pb-2">Type</th><th className="pb-2">Status</th><th className="pb-2 text-right">Uploaded</th></tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                                    {s.recentContracts.slice(0, 5).map(c => (
                                        <tr key={c.id} className="hover:bg-slate-50 transition cursor-pointer" onClick={() => navigateToContract(c.id)}>
                                            <td className="py-2.5 font-bold text-slate-900 flex items-center gap-2">
                                                <i className="fa-regular fa-file-pdf text-rose-500"></i> {c.title}
                                            </td>
                                            <td className="py-2.5">{c.contract_type || c.category || '—'}</td>
                                            <td className="py-2.5"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{c.status}</span></td>
                                            <td className="py-2.5 text-right text-slate-400">{timeAgo(c.created_at)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-4 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold font-heading text-slate-900">Contracts by Type</h3>
                    </div>
                    {Object.keys(s.contractsByType).length === 0 ? (
                        <div className="text-center py-8 text-xs text-slate-400">No data yet</div>
                    ) : (
                        <>
                            <div className="flex items-center justify-center relative py-2">
                                <div className="w-44 h-44"><canvas ref={chartContractsRef}></canvas></div>
                                <div className="absolute text-center">
                                    <div className="text-2xl font-extrabold text-slate-900 font-heading">{s.totalContracts}</div>
                                    <div className="text-[10px] font-semibold text-slate-400">Contracts</div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-[11px] font-medium text-slate-600 pt-2 border-t border-slate-100">
                                {Object.entries(s.contractsByType).map(([type, count], i) => {
                                    const colors = ['bg-brand-600', 'bg-purple-500', 'bg-emerald-500', 'bg-amber-500', 'bg-slate-400', 'bg-rose-500'];
                                    return (
                                        <div key={type} className="flex items-center justify-between">
                                            <span className="flex items-center gap-1.5"><span className={`w-2.5 h-2.5 rounded-full ${colors[i % colors.length]}`}></span> {type}</span>
                                            <span className="font-bold text-slate-900">{count}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
                <h3 className="text-sm font-bold font-heading text-slate-900">Recent Activity</h3>
                {activity.length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-400">No activity yet.</div>
                ) : (
                    <div className="space-y-3 text-xs">
                        {activity.map(a => {
                            const icon = getActivityIcon(a.action);
                            return (
                                <div key={a.id} className="flex items-start gap-3">
                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5 ${icon.bg}`}>
                                        <i className={icon.icon}></i>
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-bold text-slate-900">{a.details || a.action}</div>
                                        {a.contracts?.title && <div className="text-[11px] text-slate-500">{a.contracts.title}</div>}
                                    </div>
                                    <span className="text-[10px] text-slate-400 font-medium">{timeAgo(a.created_at)}</span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
