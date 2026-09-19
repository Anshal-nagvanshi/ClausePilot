import React from 'react';

export default function Reports({ setAppView }) {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">Contract Analysis Report</h1>
                <p className="text-xs text-slate-500 mt-0.5">A comprehensive analysis of your contract with AI-powered insights.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs lg:col-span-2 space-y-3">
                    <h3 className="text-sm font-bold font-heading text-slate-900">Executive Summary</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                        This contract is a Service Agreement between Acme Corp and TechSoft Inc. for software services. The agreement outlines monthly payment terms of $10,000, 30-day renewal notice requirements, and standard confidentiality rules.
                    </p>
                </div>
            </div>
        </div>
    );
}
