import React, { useState, useEffect } from 'react';
import { getContractById, getRisksByContract } from '../lib/contractService';

export default function ContractDetails({ setAppView, contractId }) {
    const [contract, setContract] = useState(null);
    const [risks, setRisks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (contractId) loadContract();
        else setLoading(false);
    }, [contractId]);

    const loadContract = async () => {
        try {
            const [c, r] = await Promise.all([
                getContractById(contractId),
                getRisksByContract(contractId)
            ]);
            setContract(c);
            setRisks(r);
        } catch (err) {
            console.error('Failed to load contract:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-64"><i className="fa-solid fa-spinner fa-spin text-brand-600 text-2xl"></i></div>;
    }

    if (!contract) {
        return (
            <div className="text-center py-16 space-y-3">
                <i className="fa-regular fa-folder-open text-slate-300 text-4xl"></i>
                <p className="text-sm text-slate-500">No contract selected. Please select a contract from the list.</p>
                <button onClick={() => setAppView('contracts')} className="text-xs font-bold text-brand-600 hover:underline">Go to Contracts</button>
            </div>
        );
    }

    const parties = contract.parties || [];

    return (
        <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
                <div>
                    <button onClick={() => setAppView('contracts')} className="text-xs font-semibold text-brand-600 hover:underline flex items-center gap-1 mb-1">
                        <i className="fa-solid fa-arrow-left"></i> Back to Contracts
                    </button>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold font-heading text-slate-900">{contract.title}</h1>
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${contract.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{contract.status}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                        {parties.join(' ↔ ') || 'Unknown parties'} &bull; Uploaded {new Date(contract.created_at).toLocaleDateString()} &bull; {contract.file_name || ''}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-1.5 transition">
                        <i className="fa-solid fa-download"></i> Download
                    </button>
                </div>
            </div>

            <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold text-slate-500 overflow-x-auto whitespace-nowrap pb-0.5">
                <button className="pb-2.5 border-b-2 border-brand-600 text-brand-600 font-bold flex items-center gap-2 flex-shrink-0"><i className="fa-regular fa-file-lines"></i> Overview</button>
                <button onClick={() => setAppView('obligations')} className="pb-2.5 hover:text-slate-900 flex items-center gap-2 flex-shrink-0"><i className="fa-solid fa-list-check"></i> Obligations</button>
                <button onClick={() => setAppView('timeline')} className="pb-2.5 hover:text-slate-900 flex items-center gap-2 flex-shrink-0"><i className="fa-regular fa-calendar-days"></i> Timeline</button>
                <button onClick={() => setAppView('ask-ai')} className="pb-2.5 hover:text-slate-900 flex items-center gap-2 flex-shrink-0"><i className="fa-solid fa-wand-magic-sparkles text-brand-600"></i> AI Insights</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Document Viewer */}
                <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col h-[420px] lg:h-[650px]">
                    <div className="bg-slate-50 p-3 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
                        <span className="font-semibold">Document Text</span>
                    </div>
                    <div className="p-6 overflow-y-auto custom-scrollbar font-serif text-sm leading-relaxed text-slate-800 space-y-4">
                        {contract.raw_text ? (
                            contract.raw_text.split('\n').map((line, i) => (
                                line.trim() ? <p key={i}>{line}</p> : null
                            ))
                        ) : (
                            <p className="text-slate-400 italic">No document text available.</p>
                        )}
                    </div>
                </div>

                {/* Right sidebar */}
                <div className="lg:col-span-6 space-y-4">
                    {/* Contract Summary */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
                        <h3 className="text-sm font-bold font-heading text-slate-900 flex items-center gap-2">
                            <i className="fa-regular fa-file-lines text-brand-600"></i> Contract Summary
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            {contract.summary || 'No summary available. Re-analyze the contract to generate one.'}
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                            <div className="bg-blue-50/60 p-2.5 rounded-xl border border-blue-100">
                                <div className="text-[10px] text-slate-400 font-semibold">Parties</div>
                                <div className="text-xs font-bold text-slate-900 truncate">{parties.join(' • ') || '—'}</div>
                            </div>
                            <div className="bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
                                <div className="text-[10px] text-slate-400 font-semibold">Effective Date</div>
                                <div className="text-xs font-bold text-slate-900">{contract.effective_date || '—'}</div>
                            </div>
                            <div className="bg-purple-50/60 p-2.5 rounded-xl border border-purple-100">
                                <div className="text-[10px] text-slate-400 font-semibold">Expiration Date</div>
                                <div className="text-xs font-bold text-slate-900">{contract.expiration_date || '—'}</div>
                            </div>
                            <div className="bg-amber-50/60 p-2.5 rounded-xl border border-amber-100">
                                <div className="text-[10px] text-slate-400 font-semibold">Renewal</div>
                                <div className="text-xs font-bold text-slate-900 truncate">{contract.renewal_terms || '—'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Key Information */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
                        <h3 className="text-sm font-bold font-heading text-slate-900 flex items-center gap-2">
                            <i className="fa-regular fa-id-card text-brand-600"></i> Key Information
                        </h3>
                        <div className="text-xs space-y-2 font-medium">
                            <div className="flex justify-between py-1 border-b border-slate-50"><span className="text-slate-500">Contract Type</span><span className="font-bold text-slate-900">{contract.contract_type || '—'}</span></div>
                            <div className="flex justify-between py-1 border-b border-slate-50"><span className="text-slate-500">Parties</span><span className="font-bold text-slate-900 text-right">{parties.join(', ') || '—'}</span></div>
                            <div className="flex justify-between py-1 border-b border-slate-50"><span className="text-slate-500">Effective Date</span><span className="font-bold text-slate-900">{contract.effective_date || '—'}</span></div>
                            <div className="flex justify-between py-1 border-b border-slate-50"><span className="text-slate-500">Expiration Date</span><span className="font-bold text-slate-900">{contract.expiration_date || '—'}</span></div>
                            <div className="flex justify-between py-1 border-b border-slate-50"><span className="text-slate-500">Renewal Terms</span><span className="font-bold text-slate-900 text-right max-w-[60%]">{contract.renewal_terms || '—'}</span></div>
                            <div className="flex justify-between py-1"><span className="text-slate-500">Payment Terms</span><span className="font-bold text-slate-900 text-right max-w-[60%]">{contract.payment_terms || '—'}</span></div>
                        </div>
                    </div>

                    {/* Risks */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
                        <h3 className="text-sm font-bold font-heading text-slate-900 flex items-center gap-2">
                            <i className="fa-solid fa-triangle-exclamation text-rose-500"></i> Risk & Review
                        </h3>
                        {risks.length === 0 ? (
                            <p className="text-xs text-slate-400">No risks identified.</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                                {risks.map(r => (
                                    <div key={r.id} className={`p-3 rounded-xl border ${r.severity === 'High' ? 'bg-rose-50/60 border-rose-100' : r.severity === 'Medium' ? 'bg-amber-50/60 border-amber-100' : 'bg-blue-50/60 border-blue-100'}`}>
                                        <div className={`font-bold ${r.severity === 'High' ? 'text-rose-900' : r.severity === 'Medium' ? 'text-amber-900' : 'text-blue-900'}`}>{r.title}</div>
                                        <div className="text-[11px] text-slate-600 mt-0.5">{r.description}</div>
                                        <div className="text-[10px] text-slate-400 font-bold mt-2">{r.severity}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
