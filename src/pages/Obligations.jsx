import React, { useEffect, useRef } from 'react';

export default function Obligations({ setAppView }) {
    const chartRef = useRef(null);

    useEffect(() => {
        let chartInstance = null;
        if (chartRef.current && window.Chart) {
            chartInstance = new window.Chart(chartRef.current, {
                type: 'doughnut',
                data: {
                    labels: ['Upcoming', 'Overdue', 'Active', 'Not Started', 'Completed'],
                    datasets: [{
                        data: [5, 2, 1, 0, 0],
                        backgroundColor: ['#10b981', '#f43f5e', '#3b82f6', '#cbd5e1', '#a855f7'],
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
        return () => {
            if (chartInstance) chartInstance.destroy();
        };
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <button onClick={() => setAppView('contract-details')} className="text-xs font-semibold text-brand-600 hover:underline flex items-center gap-1 mb-1">
                        <i className="fa-solid fa-arrow-left"></i> Back to Contract
                    </button>
                    <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">Obligations</h1>
                    <p className="text-xs text-slate-500 mt-0.5">All identified obligations from Acme SaaS Agreement</p>
                </div>
                <button className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition flex items-center gap-1.5">
                    <i className="fa-solid fa-plus"></i> Add Obligation
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-brand-600 flex items-center justify-center text-xl font-bold">
                        <i className="fa-regular fa-square-check"></i>
                    </div>
                    <div>
                        <div className="text-2xl font-extrabold text-slate-900 font-heading">8</div>
                        <div className="text-xs font-semibold text-slate-700">Total Obligations</div>
                        <div className="text-[10px] text-slate-400">Across all parties</div>
                    </div>
                </div>

                <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xl font-bold">
                        <i className="fa-regular fa-circle-check"></i>
                    </div>
                    <div>
                        <div className="text-2xl font-extrabold text-slate-900 font-heading">5</div>
                        <div className="text-xs font-semibold text-slate-700">Upcoming</div>
                        <div className="text-[10px] text-slate-400">Due in next 30 days</div>
                    </div>
                </div>

                <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center text-xl font-bold">
                        <i className="fa-regular fa-clock"></i>
                    </div>
                    <div>
                        <div className="text-2xl font-extrabold text-slate-900 font-heading">2</div>
                        <div className="text-xs font-semibold text-slate-700">Overdue</div>
                        <div className="text-[10px] text-slate-400">Past due date</div>
                    </div>
                </div>

                <div className="bg-purple-50/60 p-4 rounded-2xl border border-purple-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center text-xl font-bold">
                        <i className="fa-solid fa-users-gear"></i>
                    </div>
                    <div>
                        <div className="text-2xl font-extrabold text-slate-900 font-heading">2</div>
                        <div className="text-xs font-semibold text-slate-700">Completed</div>
                        <div className="text-[10px] text-slate-400">Marked as done</div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="relative flex-1 min-w-[240px]">
                        <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-slate-400 text-xs"></i>
                        <input type="text" placeholder="Search obligations..." className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50" />
                    </div>
                    <div className="flex items-center gap-2">
                        <select className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-700"><option>All Status</option></select>
                        <select className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-700"><option>All Parties</option></select>
                        <select className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-700"><option>All Categories</option></select>
                        <select className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-700"><option>Sort by</option></select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50/80 text-slate-500 font-semibold uppercase text-[10px] border-b border-slate-200">
                            <tr>
                                <th className="py-3 px-4 w-10"><input type="checkbox" className="rounded" /></th>
                                <th className="py-3 px-4 w-10">#</th>
                                <th className="py-3 px-4">Obligation</th>
                                <th className="py-3 px-4">Responsible Party</th>
                                <th className="py-3 px-4">Due Date</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4">Category</th>
                                <th className="py-3 px-4">Source</th>
                                <th className="py-3 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                            <tr>
                                <td className="py-3 px-4"><input type="checkbox" className="rounded" /></td>
                                <td className="py-3 px-4 text-slate-400">1</td>
                                <td className="py-3 px-4 font-bold text-slate-900">Provide monthly service reports</td>
                                <td className="py-3 px-4"><span className="inline-flex items-center gap-1.5"><span className="w-5 h-5 rounded-full bg-brand-600 text-white font-bold text-[9px] flex items-center justify-center">TI</span> TechSoft Inc.</span></td>
                                <td className="py-3 px-4">Oct 1, 2026</td>
                                <td className="py-3 px-4"><span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Upcoming</span></td>
                                <td className="py-3 px-4"><span className="bg-blue-50 text-brand-700 text-[10px] font-semibold px-2 py-0.5 rounded-md">Service Delivery</span></td>
                                <td className="py-3 px-4 text-slate-400">Page 4</td>
                                <td className="py-3 px-4 text-right"><i className="fa-solid fa-ellipsis-vertical text-slate-400 hover:text-slate-700 cursor-pointer"></i></td>
                            </tr>
                            <tr>
                                <td className="py-3 px-4"><input type="checkbox" className="rounded" /></td>
                                <td className="py-3 px-4 text-slate-400">2</td>
                                <td className="py-3 px-4 font-bold text-slate-900">Make monthly payment of $10,000</td>
                                <td className="py-3 px-4"><span className="inline-flex items-center gap-1.5"><span className="w-5 h-5 rounded-full bg-purple-600 text-white font-bold text-[9px] flex items-center justify-center">AC</span> Acme Corp</span></td>
                                <td className="py-3 px-4">Sep 30, 2026</td>
                                <td className="py-3 px-4"><span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Overdue</span></td>
                                <td className="py-3 px-4"><span className="bg-purple-50 text-purple-700 text-[10px] font-semibold px-2 py-0.5 rounded-md">Payment</span></td>
                                <td className="py-3 px-4 text-slate-400">Page 5</td>
                                <td className="py-3 px-4 text-right"><i className="fa-solid fa-ellipsis-vertical text-slate-400 hover:text-slate-700 cursor-pointer"></i></td>
                            </tr>
                            <tr>
                                <td className="py-3 px-4"><input type="checkbox" className="rounded" /></td>
                                <td className="py-3 px-4 text-slate-400">3</td>
                                <td className="py-3 px-4 font-bold text-slate-900">Give 30 days notice for non-renewal</td>
                                <td className="py-3 px-4"><span className="inline-flex items-center gap-1.5"><span className="w-5 h-5 rounded-full bg-purple-600 text-white font-bold text-[9px] flex items-center justify-center">AC</span> Acme Corp</span></td>
                                <td className="py-3 px-4">Dec 1, 2026</td>
                                <td className="py-3 px-4"><span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Upcoming</span></td>
                                <td className="py-3 px-4"><span className="bg-amber-50 text-amber-700 text-[10px] font-semibold px-2 py-0.5 rounded-md">Renewal</span></td>
                                <td className="py-3 px-4 text-slate-400">Page 6</td>
                                <td className="py-3 px-4 text-right"><i className="fa-solid fa-ellipsis-vertical text-slate-400 hover:text-slate-700 cursor-pointer"></i></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                    <h3 className="text-sm font-bold font-heading text-slate-900">Obligations by Status</h3>
                    <div className="flex items-center justify-center relative py-2">
                        <div className="w-40 h-40">
                            <canvas ref={chartRef}></canvas>
                        </div>
                        <div className="absolute text-center">
                            <div className="text-2xl font-extrabold text-slate-900 font-heading">8</div>
                            <div className="text-[10px] font-semibold text-slate-400">Total</div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold font-heading text-slate-900 flex items-center gap-2">
                            <i className="fa-regular fa-calendar text-brand-600"></i> Upcoming Deadlines
                        </h3>
                        <button className="text-xs font-bold text-brand-600 hover:underline">View Calendar &rarr;</button>
                    </div>

                    <div className="space-y-3 text-xs">
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                            <span className="font-bold text-slate-900 w-24">Oct 1, 2026</span>
                            <span className="text-slate-700 flex-1">Provide monthly service reports</span>
                            <span className="text-slate-500">TechSoft Inc.</span>
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full ml-4">Upcoming</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                            <span className="font-bold text-slate-900 w-24">Dec 1, 2026</span>
                            <span className="text-slate-700 flex-1">Give 30 days notice for non-renewal</span>
                            <span className="text-slate-500">Acme Corp</span>
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full ml-4">Upcoming</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
