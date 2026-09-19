import React from 'react';

export default function ContractDetails({ setAppView }) {
    return (
        <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
                <div>
                    <button onClick={() => setAppView('contracts')} className="text-xs font-semibold text-brand-600 hover:underline flex items-center gap-1 mb-1">
                        <i className="fa-solid fa-arrow-left"></i> Back to Contracts
                    </button>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold font-heading text-slate-900">Acme SaaS Agreement</h1>
                        <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">Active</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Acme Corp ↔ TechSoft Inc. &bull; Uploaded Sep 15, 2026 &bull; 12 pages &bull; 2.4 MB</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-1.5 transition">
                        <i className="fa-solid fa-download"></i> Download
                    </button>
                    <button className="bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-1.5 transition">
                        <i className="fa-solid fa-share-nodes"></i> Share
                    </button>
                </div>
            </div>

            <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold text-slate-500">
                <button className="pb-2.5 border-b-2 border-brand-600 text-brand-600 font-bold flex items-center gap-2">
                    <i className="fa-regular fa-file-lines"></i> Overview
                </button>
                <button onClick={() => setAppView('obligations')} className="pb-2.5 hover:text-slate-900 flex items-center gap-2">
                    <i className="fa-solid fa-list-check"></i> Obligations
                </button>
                <button onClick={() => setAppView('timeline')} className="pb-2.5 hover:text-slate-900 flex items-center gap-2">
                    <i className="fa-regular fa-calendar-days"></i> Timeline
                </button>
                <button onClick={() => setAppView('ask-ai')} className="pb-2.5 hover:text-slate-900 flex items-center gap-2">
                    <i className="fa-solid fa-wand-magic-sparkles text-brand-600"></i> AI Insights
                </button>
                <button onClick={() => setAppView('compare')} className="pb-2.5 hover:text-slate-900 flex items-center gap-2">
                    <i className="fa-solid fa-code-compare"></i> Versions
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col h-[650px]">
                    <div className="bg-slate-50 p-3 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
                        <div className="flex items-center gap-3">
                            <button className="p-1 hover:text-slate-900"><i className="fa-solid fa-bars"></i></button>
                            <span className="font-semibold">1 / 12</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="p-1 hover:text-slate-900"><i className="fa-solid fa-minus"></i></button>
                            <span>100%</span>
                            <button className="p-1 hover:text-slate-900"><i className="fa-solid fa-plus"></i></button>
                            <button className="p-1 hover:text-slate-900 ml-2"><i className="fa-solid fa-magnifying-glass"></i></button>
                            <button className="p-1 hover:text-slate-900"><i className="fa-solid fa-expand"></i></button>
                        </div>
                    </div>
                    <div className="p-6 overflow-y-auto custom-scrollbar font-serif text-sm leading-relaxed text-slate-800 space-y-4">
                        <h2 className="text-center font-bold text-lg font-sans tracking-wide">SERVICE AGREEMENT</h2>
                        <p>This Service Agreement ("Agreement") is made effective as of January 1, 2026, by and between:</p>
                        <p><strong>Acme Corp</strong>, a company incorporated under the laws of Delaware ("Customer"), and <strong>TechSoft Inc.</strong>, a company incorporated under the laws of California ("Service Provider").</p>
                        
                        <h3 className="font-bold font-sans text-xs uppercase tracking-wider text-slate-900 pt-2">1. SERVICES</h3>
                        <p>The Service Provider agrees to provide cloud software services to the Customer as described in this Agreement.</p>

                        <h3 className="font-bold font-sans text-xs uppercase tracking-wider text-slate-900 pt-2">2. TERM</h3>
                        <p>This Agreement shall commence on January 1, 2026 and shall continue for an initial term of one (1) year, unless earlier terminated in accordance with Section 10.</p>

                        <h3 className="font-bold font-sans text-xs uppercase tracking-wider text-slate-900 pt-2">3. PAYMENT TERMS</h3>
                        <p>Customer shall pay the Service Provider a monthly fee of <span className="bg-amber-100 text-amber-900 px-1 rounded font-sans font-medium">$10,000 within thirty (30) days</span> of invoice date.</p>
                    </div>
                </div>

                <div className="lg:col-span-6 space-y-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold font-heading text-slate-900 flex items-center gap-2">
                                <i className="fa-regular fa-file-lines text-brand-600"></i> Contract Summary
                            </h3>
                            <button className="text-xs font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 px-3 py-1 rounded-lg transition">Generate Full Summary</button>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            This is a one-year service agreement between Acme Corp and TechSoft Inc. for cloud software services. The agreement includes monthly payments, auto-renewal terms, service obligations, and standard termination conditions.
                        </p>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                            <div className="bg-blue-50/60 p-2.5 rounded-xl border border-blue-100">
                                <div className="text-[10px] text-slate-400 font-semibold">Parties</div>
                                <div className="text-xs font-bold text-slate-900 truncate">Acme Corp &bull; TechSoft</div>
                            </div>
                            <div className="bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
                                <div className="text-[10px] text-slate-400 font-semibold">Effective Date</div>
                                <div className="text-xs font-bold text-slate-900">Jan 1, 2026</div>
                            </div>
                            <div className="bg-purple-50/60 p-2.5 rounded-xl border border-purple-100">
                                <div className="text-[10px] text-slate-400 font-semibold">Expiration Date</div>
                                <div className="text-xs font-bold text-slate-900">Dec 31, 2026</div>
                            </div>
                            <div className="bg-amber-50/60 p-2.5 rounded-xl border border-amber-100">
                                <div className="text-[10px] text-slate-400 font-semibold">Renewal</div>
                                <div className="text-xs font-bold text-slate-900 truncate">Auto (30 days)</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <h3 className="text-sm font-bold font-heading text-slate-900 flex items-center gap-2">
                                <i className="fa-regular fa-id-card text-brand-600"></i> Key Information
                            </h3>
                            <button className="text-xs text-brand-600 hover:underline font-bold">Edit</button>
                        </div>
                        <div className="text-xs space-y-2 font-medium">
                            <div className="flex justify-between py-1 border-b border-slate-50"><span className="text-slate-500">Contract Type</span><span className="font-bold text-slate-900">Service Agreement</span></div>
                            <div className="flex justify-between py-1 border-b border-slate-50"><span className="text-slate-500">Parties</span><span className="font-bold text-slate-900 text-right">Acme Corp (Customer), TechSoft Inc. (Provider)</span></div>
                            <div className="flex justify-between py-1 border-b border-slate-50"><span className="text-slate-500">Effective Date</span><span className="font-bold text-slate-900">January 1, 2026</span></div>
                            <div className="flex justify-between py-1 border-b border-slate-50"><span className="text-slate-500">Expiration Date</span><span className="font-bold text-slate-900">December 31, 2026</span></div>
                            <div className="flex justify-between py-1 border-b border-slate-50"><span className="text-slate-500">Renewal Terms</span><span className="font-bold text-slate-900 text-right">Automatically renews for 1 year unless 30 days notice is given</span></div>
                            <div className="flex justify-between py-1 border-b border-slate-50"><span className="text-slate-500">Payment Terms</span><span className="font-bold text-slate-900">$10,000 per month, within 30 days of invoice date</span></div>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold font-heading text-slate-900 flex items-center gap-2">
                                <i className="fa-solid fa-triangle-exclamation text-rose-500"></i> Risk &amp; Review
                            </h3>
                            <span className="text-xs text-brand-600 font-bold hover:underline cursor-pointer">View All &rarr;</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                            <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-100">
                                <div className="font-bold text-rose-900">Ambiguous Clause</div>
                                <div className="text-[11px] text-slate-600 mt-0.5">Liability limitation needs review</div>
                                <div className="text-[10px] text-slate-400 font-bold mt-2">Page 8</div>
                            </div>
                            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100">
                                <div className="font-bold text-amber-900">Missing Information</div>
                                <div className="text-[11px] text-slate-600 mt-0.5">No data retention period specified</div>
                                <div className="text-[10px] text-slate-400 font-bold mt-2">Page 6</div>
                            </div>
                            <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-100">
                                <div className="font-bold text-rose-900">High Risk</div>
                                <div className="text-[11px] text-slate-600 mt-0.5">Auto-renewal terms may be unfavorable</div>
                                <div className="text-[10px] text-slate-400 font-bold mt-2">Page 4</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
