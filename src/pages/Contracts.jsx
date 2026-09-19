import React from 'react';

export default function Contracts({ setAppView }) {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">Contracts Directory</h1>
                    <p className="text-xs text-slate-500 mt-0.5">Browse, filter, and manage all organization agreements.</p>
                </div>
                <button onClick={() => setAppView('upload')} className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-brand-500/20 transition flex items-center gap-2">
                    <i className="fa-solid fa-cloud-arrow-up"></i> Upload Contract
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="relative flex-1 min-w-[240px]">
                        <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-slate-400 text-xs"></i>
                        <input type="text" placeholder="Search contracts..." className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50" />
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                        <select className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-700">
                            <option>All Statuses</option>
                            <option>Active</option>
                            <option>Pending</option>
                            <option>Expired</option>
                        </select>
                        <select className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-700">
                            <option>All Types</option>
                            <option>SaaS Agreement</option>
                            <option>NDA</option>
                            <option>Supply Contract</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50/80 text-slate-500 font-semibold uppercase text-[10px] border-b border-slate-200">
                            <tr>
                                <th className="py-3 px-4">Contract Name</th>
                                <th className="py-3 px-4">Parties</th>
                                <th className="py-3 px-4">Type</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4">Expiry Date</th>
                                <th className="py-3 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                            <tr className="hover:bg-slate-50 transition cursor-pointer" onClick={() => setAppView('contract-details')}>
                                <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                                    <i className="fa-regular fa-file-pdf text-rose-500 text-sm"></i> Acme SaaS Agreement
                                </td>
                                <td className="py-3 px-4">Acme Corp &bull; TechSoft</td>
                                <td className="py-3 px-4">SaaS Agreement</td>
                                <td className="py-3 px-4"><span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Active</span></td>
                                <td className="py-3 px-4 text-slate-500">Dec 31, 2026</td>
                                <td className="py-3 px-4 text-right">
                                    <button className="text-brand-600 hover:text-brand-800 font-bold px-2 py-1">View</button>
                                </td>
                            </tr>
                            <tr className="hover:bg-slate-50 transition cursor-pointer" onClick={() => setAppView('contract-details')}>
                                <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                                    <i className="fa-regular fa-file-pdf text-rose-500 text-sm"></i> NDA - TechSoft
                                </td>
                                <td className="py-3 px-4">TechSoft Inc.</td>
                                <td className="py-3 px-4">NDA</td>
                                <td className="py-3 px-4"><span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Active</span></td>
                                <td className="py-3 px-4 text-slate-500">Jan 15, 2028</td>
                                <td className="py-3 px-4 text-right">
                                    <button className="text-brand-600 hover:text-brand-800 font-bold px-2 py-1">View</button>
                                </td>
                            </tr>
                            <tr className="hover:bg-slate-50 transition cursor-pointer" onClick={() => setAppView('contract-details')}>
                                <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                                    <i className="fa-regular fa-file-pdf text-amber-500 text-sm"></i> Global Supply Contract
                                </td>
                                <td className="py-3 px-4">Global Supply Ltd.</td>
                                <td className="py-3 px-4">Supply Contract</td>
                                <td className="py-3 px-4"><span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Pending</span></td>
                                <td className="py-3 px-4 text-slate-500">Nov 30, 2027</td>
                                <td className="py-3 px-4 text-right">
                                    <button className="text-brand-600 hover:text-brand-800 font-bold px-2 py-1">View</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
