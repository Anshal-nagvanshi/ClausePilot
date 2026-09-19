import React from 'react';

export default function Compare({ setAppView }) {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">Compare Contract Versions</h1>
                    <p className="text-xs text-slate-500 mt-0.5">View the differences between two versions of your contract with AI-powered insights.</p>
                </div>
                <button className="bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs px-4 py-2 rounded-xl border border-slate-200 shadow-2xs transition flex items-center gap-2">
                    <i className="fa-solid fa-cloud-arrow-up text-brand-600"></i> Upload Different Versions
                </button>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex-1 p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                    <i className="fa-regular fa-file-pdf text-rose-500 text-2xl"></i>
                    <div>
                        <div className="text-xs font-bold text-slate-900">Version 1: Contract_v1.pdf</div>
                        <div className="text-[10px] text-slate-400">Uploaded: 01 Mar 2025, 10:30 AM</div>
                    </div>
                </div>
                <span className="font-bold text-slate-400 text-xs bg-slate-100 px-3 py-1 rounded-full">VS</span>
                <div className="flex-1 p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                    <i className="fa-regular fa-file-pdf text-rose-500 text-2xl"></i>
                    <div>
                        <div className="text-xs font-bold text-slate-900">Version 2: Contract_v2.pdf</div>
                        <div className="text-[10px] text-slate-400">Uploaded: 12 Mar 2025, 11:15 AM</div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold">
                    <div className="flex gap-6">
                        <button className="text-brand-600 font-bold border-b-2 border-brand-600 pb-1">Side by Side View</button>
                        <button className="text-slate-500 hover:text-slate-900">Changes Summary</button>
                        <button className="text-slate-500 hover:text-slate-900">Clause Comparison</button>
                        <button className="text-slate-500 hover:text-slate-900">AI Analysis</button>
                    </div>
                    <div className="flex items-center gap-3 text-[11px]">
                        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Added</span>
                        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Removed</span>
                        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Modified</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                    <div className="p-5 space-y-3">
                        <div className="flex justify-between items-center text-xs font-bold text-slate-900">
                            <span>Version 1</span>
                            <span className="text-slate-400 font-normal">Page 4 of 24</span>
                        </div>
                        <div className="font-serif text-xs leading-relaxed space-y-3 text-slate-800">
                            <p><strong>4. Payment Terms</strong></p>
                            <p>Client shall pay the total amount of <span className="highlight-del">$50,000</span> within <span className="highlight-del">60 days</span> of invoice date. All payments shall be made via bank transfer. Late payments may incur a penalty of <span className="highlight-del">5% per month</span>.</p>
                            <p><strong>5. Termination</strong></p>
                            <p>Either party may terminate this agreement with <span className="highlight-del">30 days'</span> written notice.</p>
                        </div>
                    </div>

                    <div className="p-5 space-y-3">
                        <div className="flex justify-between items-center text-xs font-bold text-slate-900">
                            <span>Version 2</span>
                            <span className="text-slate-400 font-normal">Page 4 of 24</span>
                        </div>
                        <div className="font-serif text-xs leading-relaxed space-y-3 text-slate-800">
                            <p><strong>4. Payment Terms</strong></p>
                            <p>Client shall pay the total amount of <span className="highlight-add">$60,000</span> within <span className="highlight-add">45 days</span> of invoice date. All payments shall be made via bank transfer. Late payments may incur a penalty of <span className="highlight-add">2% per month</span>.</p>
                            <p><strong>5. Termination</strong></p>
                            <p>Either party may terminate this agreement with <span className="highlight-add">60 days'</span> written notice.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 text-center">
                    <div className="text-2xl font-extrabold text-emerald-600">12</div>
                    <div className="text-xs font-semibold text-slate-700">Added Clauses</div>
                </div>
                <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-100 text-center">
                    <div className="text-2xl font-extrabold text-rose-600">8</div>
                    <div className="text-xs font-semibold text-slate-700">Removed Clauses</div>
                </div>
                <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-100 text-center">
                    <div className="text-2xl font-extrabold text-amber-600">15</div>
                    <div className="text-xs font-semibold text-slate-700">Modified Clauses</div>
                </div>
                <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-100 text-center">
                    <div className="text-2xl font-extrabold text-brand-600">45</div>
                    <div className="text-xs font-semibold text-slate-700">Total Changes</div>
                </div>
            </div>
        </div>
    );
}
