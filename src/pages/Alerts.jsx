import React from 'react';

export default function Alerts({ setAppView }) {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">Alerts &amp; Notifications</h1>
                <p className="text-xs text-slate-500 mt-0.5">Stay updated on contract deadlines, risk items, and review tasks.</p>
            </div>

            <div className="space-y-3">
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold">
                            <i className="fa-solid fa-triangle-exclamation"></i>
                        </div>
                        <div>
                            <div className="text-xs font-bold text-slate-900">Renewal Notice Deadline Approaching</div>
                            <div className="text-[11px] text-slate-600">Acme SaaS Agreement requires 30 days written notice before Oct 25, 2026.</div>
                        </div>
                    </div>
                    <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-1 rounded-full">Urgent</span>
                </div>
            </div>
        </div>
    );
}
