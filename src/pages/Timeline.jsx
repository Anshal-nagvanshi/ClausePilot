import React from 'react';

export default function Timeline({ setAppView }) {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <button onClick={() => setAppView('contract-details')} className="text-xs font-semibold text-brand-600 hover:underline flex items-center gap-1 mb-1">
                        <i className="fa-solid fa-arrow-left"></i> Back to Contract
                    </button>
                    <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">Contract Timeline</h1>
                    <p className="text-xs text-slate-500 mt-0.5">Key dates, milestones, and obligations for Acme SaaS Agreement</p>
                </div>
                <div className="flex items-center gap-2">
                    <select className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-700"><option>All Types</option></select>
                    <select className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-700"><option>All Status</option></select>
                    <button className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5">
                        <i className="fa-solid fa-download"></i> Export
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                        <i className="fa-regular fa-calendar-check"></i>
                    </div>
                    <div>
                        <div className="text-base font-extrabold text-slate-900">Jan 1, 2026</div>
                        <div className="text-[10px] text-slate-500 font-semibold">Contract Start Date</div>
                    </div>
                </div>
                <div className="bg-purple-50/60 p-4 rounded-2xl border border-purple-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold">
                        <i className="fa-regular fa-calendar-xmark"></i>
                    </div>
                    <div>
                        <div className="text-base font-extrabold text-slate-900">Dec 31, 2026</div>
                        <div className="text-[10px] text-slate-500 font-semibold">Contract End Date</div>
                    </div>
                </div>
                <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-brand-600 flex items-center justify-center font-bold">
                        <i className="fa-regular fa-clock"></i>
                    </div>
                    <div>
                        <div className="text-base font-extrabold text-slate-900">5</div>
                        <div className="text-[10px] text-slate-500 font-semibold">Upcoming Milestones</div>
                    </div>
                </div>
                <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                        <i className="fa-solid fa-triangle-exclamation"></i>
                    </div>
                    <div>
                        <div className="text-base font-extrabold text-slate-900">2</div>
                        <div className="text-[10px] text-slate-500 font-semibold">Overdue Items</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h3 className="text-sm font-bold font-heading text-slate-900">Timeline View</h3>
                        <div className="flex bg-slate-100 p-0.5 rounded-lg text-[11px] font-bold text-slate-600">
                            <button className="bg-brand-600 text-white px-2.5 py-1 rounded-md shadow-2xs">Timeline</button>
                            <button className="px-2.5 py-1 hover:text-slate-900">List View</button>
                            <button className="px-2.5 py-1 hover:text-slate-900">Calendar</button>
                        </div>
                    </div>

                    <div className="overflow-x-auto text-xs py-2">
                        <div className="min-w-[600px] space-y-3">
                            <div className="gantt-grid text-[10px] text-slate-400 font-bold border-b border-slate-100 pb-2">
                                <span></span>
                                <span>Dec</span><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                            </div>
                            <div className="gantt-grid items-center py-1">
                                <span className="font-bold text-slate-900">Contract Start</span>
                                <div className="col-span-13 relative flex items-center">
                                    <span className="w-3 h-3 rotate-45 bg-emerald-500 inline-block ml-4"></span>
                                    <span className="text-[10px] font-bold text-slate-700 ml-2">Jan 1, 2026</span>
                                </div>
                            </div>
                            <div className="gantt-grid items-center py-1">
                                <span className="font-bold text-slate-900">Service Commencement</span>
                                <div className="col-span-13 relative flex items-center">
                                    <div className="h-3 bg-brand-200/80 rounded-full w-full mx-4 flex items-center justify-center">
                                        <span className="text-[9px] font-bold text-brand-900">Jan 1, 2026 &ndash; Dec 31, 2026</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold font-heading text-slate-900">Upcoming Milestones</h3>
                        <span className="text-xs font-bold text-brand-600 hover:underline cursor-pointer">View All &rarr;</span>
                    </div>

                    <div className="space-y-3 text-xs">
                        <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                            <div>
                                <div className="font-bold text-slate-900">First Payment Due</div>
                                <div className="text-[10px] text-slate-500">Jan 31, 2026</div>
                            </div>
                            <span className="bg-blue-100 text-brand-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Days left: 17</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                            <div>
                                <div className="font-bold text-slate-900">Compliance Audit</div>
                                <div className="text-[10px] text-slate-500">Jun 15, 2026</div>
                            </div>
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Days left: 152</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
