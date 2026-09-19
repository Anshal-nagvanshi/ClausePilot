import React, { useEffect, useRef } from 'react';

export default function Dashboard({ setAppView }) {
    const chartContractsRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        const ctx = chartContractsRef.current;
        if (ctx && window.Chart) {
            if (chartInstance.current) chartInstance.current.destroy();
            chartInstance.current = new window.Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Service Agreement', 'NDA', 'Supply Contract', 'SaaS Agreement', 'Other'],
                    datasets: [{
                        data: [8, 4, 4, 4, 4],
                        backgroundColor: ['#2563eb', '#a855f7', '#10b981', '#f59e0b', '#cbd5e1'],
                        borderWidth: 2,
                        borderColor: '#ffffff'
                    }]
                },
                options: {
                    cutout: '72%',
                    plugins: { legend: { display: false } },
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }
        return () => { if (chartInstance.current) chartInstance.current.destroy(); };
    }, []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight flex items-center gap-2">
                        Good Morning, John! 👋
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">Here's what's happening with your contracts today.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setAppView('upload')}
                        className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-md shadow-brand-500/20 transition flex items-center gap-1.5"
                    >
                        <i className="fa-solid fa-cloud-arrow-up"></i> Upload Contract
                    </button>
                    <div className="text-xs text-slate-500 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm flex items-center gap-2">
                        <i className="fa-regular fa-calendar text-slate-400"></i>
                        <span>Mon, Sep 15, 2026</span>
                    </div>
                    <select className="text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm text-slate-700 focus:outline-none">
                        <option>Last 30 Days</option>
                        <option>Last 90 Days</option>
                        <option>Year to Date</option>
                    </select>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-brand-600 flex items-center justify-center text-xl font-bold">
                        <i className="fa-regular fa-file-lines"></i>
                    </div>
                    <div>
                        <div className="text-xs font-semibold text-slate-500">Total Contracts</div>
                        <div className="text-2xl font-extrabold text-slate-900 font-heading">24</div>
                        <div className="text-[11px] font-bold text-emerald-600 mt-0.5">↑ +3 this month</div>
                    </div>
                </div>
                <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xl font-bold">
                        <i className="fa-regular fa-calendar-check"></i>
                    </div>
                    <div>
                        <div className="text-xs font-semibold text-slate-500">Upcoming Renewals</div>
                        <div className="text-2xl font-extrabold text-slate-900 font-heading">5</div>
                        <div className="text-[11px] font-bold text-emerald-600 mt-0.5">Next 30 days</div>
                    </div>
                </div>
                <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center text-xl font-bold">
                        <i className="fa-regular fa-clipboard"></i>
                    </div>
                    <div>
                        <div className="text-xs font-semibold text-slate-500">Open Obligations</div>
                        <div className="text-2xl font-extrabold text-slate-900 font-heading">12</div>
                        <div className="text-[11px] font-bold text-amber-600 mt-0.5">Across all contracts</div>
                    </div>
                </div>
                <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center text-xl font-bold">
                        <i className="fa-solid fa-triangle-exclamation"></i>
                    </div>
                    <div>
                        <div className="text-xs font-semibold text-slate-500">Needs Review</div>
                        <div className="text-2xl font-extrabold text-slate-900 font-heading">3</div>
                        <div className="text-[11px] font-bold text-rose-600 mt-0.5">Flagged by AI</div>
                    </div>
                </div>
            </div>

            {/* Row 2: Upcoming Deadlines + Contracts by Type */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Upcoming Deadlines */}
                <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold font-heading text-slate-900">Upcoming Deadlines</h3>
                        <button onClick={() => setAppView('timeline')} className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1">
                            View All <i className="fa-solid fa-arrow-right text-[10px]"></i>
                        </button>
                    </div>
                    <div className="space-y-2.5">
                        <div className="p-3 bg-slate-50 hover:bg-blue-50/40 rounded-xl border border-slate-100 flex items-center justify-between transition cursor-pointer" onClick={() => setAppView('contract-details')}>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold">
                                    <i className="fa-regular fa-calendar-days"></i>
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-900">Acme SaaS Agreement</div>
                                    <div className="text-[10px] text-slate-500">Renewal notice due</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full">10 days</span>
                                <span className="text-xs font-medium text-slate-400">Oct 25, 2026</span>
                            </div>
                        </div>

                        <div className="p-3 bg-slate-50 hover:bg-blue-50/40 rounded-xl border border-slate-100 flex items-center justify-between transition cursor-pointer" onClick={() => setAppView('contract-details')}>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-100 text-brand-600 flex items-center justify-center text-xs font-bold">
                                    <i className="fa-solid fa-dollar-sign"></i>
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-900">Global Supply Contract</div>
                                    <div className="text-[10px] text-slate-500">Payment milestone</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">15 days</span>
                                <span className="text-xs font-medium text-slate-400">Oct 30, 2026</span>
                            </div>
                        </div>

                        <div className="p-3 bg-slate-50 hover:bg-blue-50/40 rounded-xl border border-slate-100 flex items-center justify-between transition cursor-pointer" onClick={() => setAppView('contract-details')}>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">
                                    <i className="fa-regular fa-file-lines"></i>
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-900">Marketing Services Agreement</div>
                                    <div className="text-[10px] text-slate-500">Contract term ends</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">47 days</span>
                                <span className="text-xs font-medium text-slate-400">Nov 1, 2026</span>
                            </div>
                        </div>

                        <div className="p-3 bg-slate-50 hover:bg-blue-50/40 rounded-xl border border-slate-100 flex items-center justify-between transition cursor-pointer" onClick={() => setAppView('contract-details')}>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center text-xs font-bold">
                                    <i className="fa-solid fa-triangle-exclamation"></i>
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-900">Cloud Services Contract</div>
                                    <div className="text-[10px] text-slate-500">Renewal notice due</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full">51 days</span>
                                <span className="text-xs font-medium text-slate-400">Nov 5, 2026</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contracts by Type */}
                <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-4 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold font-heading text-slate-900">Contracts by Type</h3>
                        <button onClick={() => setAppView('contracts')} className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1">
                            View All <i className="fa-solid fa-arrow-right text-[10px]"></i>
                        </button>
                    </div>
                    <div className="flex items-center justify-center relative py-2">
                        <div className="w-44 h-44">
                            <canvas ref={chartContractsRef}></canvas>
                        </div>
                        <div className="absolute text-center">
                            <div className="text-2xl font-extrabold text-slate-900 font-heading">24</div>
                            <div className="text-[10px] font-semibold text-slate-400">Contracts</div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-medium text-slate-600 pt-2 border-t border-slate-100">
                        <div className="flex items-center justify-between"><span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-brand-600"></span> Service Agreement</span> <span className="font-bold text-slate-900">8</span></div>
                        <div className="flex items-center justify-between"><span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> NDA</span> <span className="font-bold text-slate-900">4</span></div>
                        <div className="flex items-center justify-between"><span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Supply Contract</span> <span className="font-bold text-slate-900">4</span></div>
                        <div className="flex items-center justify-between"><span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> SaaS Agreement</span> <span className="font-bold text-slate-900">4</span></div>
                    </div>
                </div>
            </div>

            {/* Row 3: Recent Contracts + Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold font-heading text-slate-900">Recent Contracts</h3>
                        <button onClick={() => setAppView('contracts')} className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1">
                            View All <i className="fa-solid fa-arrow-right text-[10px]"></i>
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-100">
                                <tr>
                                    <th className="pb-2">Name</th>
                                    <th className="pb-2">Party</th>
                                    <th className="pb-2">Status</th>
                                    <th className="pb-2 text-right">Uploaded</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                                <tr className="hover:bg-slate-50 transition cursor-pointer" onClick={() => setAppView('contract-details')}>
                                    <td className="py-2.5 font-bold text-slate-900 flex items-center gap-2">
                                        <i className="fa-regular fa-file-pdf text-rose-500"></i> Acme SaaS Agreement
                                    </td>
                                    <td className="py-2.5">Acme Corp</td>
                                    <td className="py-2.5"><span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Active</span></td>
                                    <td className="py-2.5 text-right text-slate-400">2 hours ago</td>
                                </tr>
                                <tr className="hover:bg-slate-50 transition cursor-pointer" onClick={() => setAppView('contract-details')}>
                                    <td className="py-2.5 font-bold text-slate-900 flex items-center gap-2">
                                        <i className="fa-regular fa-file-pdf text-rose-500"></i> NDA - TechSoft
                                    </td>
                                    <td className="py-2.5">TechSoft Inc.</td>
                                    <td className="py-2.5"><span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Active</span></td>
                                    <td className="py-2.5 text-right text-slate-400">1 day ago</td>
                                </tr>
                                <tr className="hover:bg-slate-50 transition cursor-pointer" onClick={() => setAppView('contract-details')}>
                                    <td className="py-2.5 font-bold text-slate-900 flex items-center gap-2">
                                        <i className="fa-regular fa-file-pdf text-amber-500"></i> Supply Contract
                                    </td>
                                    <td className="py-2.5">Global Supply Ltd.</td>
                                    <td className="py-2.5"><span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Pending</span></td>
                                    <td className="py-2.5 text-right text-slate-400">2 days ago</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold font-heading text-slate-900">Recent Activity</h3>
                        <button onClick={() => setAppView('alerts')} className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1">
                            View All <i className="fa-solid fa-arrow-right text-[10px]"></i>
                        </button>
                    </div>
                    <div className="space-y-3 text-xs">
                        <div className="flex items-start gap-3">
                            <div className="w-7 h-7 rounded-lg bg-blue-50 text-brand-600 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                                <i className="fa-solid fa-cloud-arrow-up"></i>
                            </div>
                            <div className="flex-1">
                                <div className="font-bold text-slate-900">New contract uploaded</div>
                                <div className="text-[11px] text-slate-500">Acme_Services_Agreement.pdf</div>
                            </div>
                            <span className="text-[10px] text-slate-400 font-medium">2 hours ago</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                                <i className="fa-solid fa-circle-check"></i>
                            </div>
                            <div className="flex-1">
                                <div className="font-bold text-slate-900">AI analysis completed</div>
                                <div className="text-[11px] text-slate-500">Extracted 12 obligations</div>
                            </div>
                            <span className="text-[10px] text-slate-400 font-medium">3 hours ago</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
