import React, { useState, useEffect } from 'react';
import { getContracts, getContractById } from '../lib/contractService';
import { compareContracts } from '../lib/aiService';

export default function Compare({ setAppView }) {
    const [contracts, setContracts] = useState([]);
    const [version1Id, setVersion1Id] = useState('');
    const [version2Id, setVersion2Id] = useState('');
    const [comparisonResult, setComparisonResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [filterChangeType, setFilterChangeType] = useState('All');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        async function loadContractsList() {
            try {
                const list = await getContracts();
                setContracts(list);
                if (list.length >= 2) {
                    setVersion1Id(list[1].id);
                    setVersion2Id(list[0].id);
                } else if (list.length === 1) {
                    setVersion1Id(list[0].id);
                }
            } catch (err) {
                console.error('Failed to load contracts:', err);
            }
        }
        loadContractsList();
    }, []);

    const handleRunComparison = async () => {
        if (!version1Id || !version2Id) {
            setErrorMsg('Please select two contracts to compare.');
            return;
        }
        if (version1Id === version2Id) {
            setErrorMsg('Please select two different contract versions.');
            return;
        }

        setIsLoading(true);
        setErrorMsg('');

        try {
            const [c1, c2] = await Promise.all([
                getContractById(version1Id),
                getContractById(version2Id)
            ]);

            const text1 = c1.extracted_text || `${c1.title}\n${c1.summary || ''}\nPayment: ${c1.payment_terms}\nRenewal: ${c1.renewal_terms}`;
            const text2 = c2.extracted_text || `${c2.title}\n${c2.summary || ''}\nPayment: ${c2.payment_terms}\nRenewal: ${c2.renewal_terms}`;

            const result = await compareContracts(text1, text2, c1.title, c2.title);
            setComparisonResult(result);
        } catch (err) {
            console.error('Comparison error:', err);
            setErrorMsg('Failed to run comparison: ' + (err.message || 'Unknown error'));
        } finally {
            setIsLoading(false);
        }
    };

    const changes = comparisonResult?.changes || [];
    const filteredChanges = changes.filter(c => {
        if (filterChangeType === 'All') return true;
        return c.changeType.toLowerCase() === filterChangeType.toLowerCase();
    });

    const c1Name = contracts.find(c => c.id === version1Id)?.title || 'Version 1';
    const c2Name = contracts.find(c => c.id === version2Id)?.title || 'Version 2';

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">AI Contract Comparison Agent</h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Detect differences, analyze clause changes, and evaluate legal risk shifts between versions.
                    </p>
                </div>
                <button
                    onClick={() => setAppView('upload')}
                    className="bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs px-4 py-2 rounded-xl border border-slate-200 shadow-2xs transition flex items-center gap-2"
                >
                    <i className="fa-solid fa-cloud-arrow-up text-brand-600"></i> Upload Another Contract
                </button>
            </div>

            {/* Contract Version Selectors */}
            <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-[10px]">1</span>
                            Baseline Version (Original)
                        </label>
                        <select
                            value={version1Id}
                            onChange={(e) => setVersion1Id(e.target.value)}
                            className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                        >
                            <option value="">Select contract...</option>
                            {contracts.map(c => (
                                <option key={c.id} value={c.id}>{c.title} ({c.contract_type || 'Contract'})</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center text-[10px]">2</span>
                            Comparison Version (Revised / Vendor Draft)
                        </label>
                        <select
                            value={version2Id}
                            onChange={(e) => setVersion2Id(e.target.value)}
                            className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                        >
                            <option value="">Select contract...</option>
                            {contracts.map(c => (
                                <option key={c.id} value={c.id}>{c.title} ({c.contract_type || 'Contract'})</option>
                            ))}
                        </select>
                    </div>
                </div>

                {errorMsg && (
                    <div className="text-xs text-rose-700 bg-rose-50 border border-rose-200 p-3 rounded-xl flex items-center gap-2">
                        <i className="fa-solid fa-circle-exclamation"></i>
                        {errorMsg}
                    </div>
                )}

                <div className="flex justify-end pt-2">
                    <button
                        onClick={handleRunComparison}
                        disabled={isLoading || !version1Id || !version2Id}
                        className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition flex items-center gap-2 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <>
                                <i className="fa-solid fa-circle-notch fa-spin"></i>
                                Analyzing Differences with AI...
                            </>
                        ) : (
                            <>
                                <i className="fa-solid fa-code-compare"></i>
                                Run AI Version Comparison
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Comparison Results */}
            {comparisonResult && (
                <div className="space-y-6">
                    {/* Summary & Risk Shift Banner */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                            <div>
                                <h3 className="text-sm font-bold font-heading text-slate-900">Executive Comparison Summary</h3>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Comparing <strong>{c1Name}</strong> &rarr; <strong>{c2Name}</strong>
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-500 font-semibold">Risk Shift:</span>
                                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                                    comparisonResult.riskShift?.toLowerCase().includes('more risky') ? 'bg-rose-100 text-rose-800 border-rose-200' :
                                    comparisonResult.riskShift?.toLowerCase().includes('favorable') ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                                    'bg-amber-100 text-amber-800 border-amber-200'
                                }`}>
                                    {comparisonResult.riskShift || 'Neutral'}
                                </span>
                            </div>
                        </div>

                        <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/80 p-4 rounded-xl border border-slate-100">
                            {comparisonResult.summary}
                        </p>

                        {/* Counts */}
                        <div className="grid grid-cols-3 gap-3 pt-2">
                            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 text-center">
                                <span className="text-[11px] font-semibold text-emerald-800 block">Added Clauses</span>
                                <span className="text-lg font-extrabold text-emerald-900">
                                    {comparisonResult.statistics?.addedCount ?? changes.filter(c => c.changeType === 'Added').length}
                                </span>
                            </div>
                            <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-100 text-center">
                                <span className="text-[11px] font-semibold text-rose-800 block">Removed Clauses</span>
                                <span className="text-lg font-extrabold text-rose-900">
                                    {comparisonResult.statistics?.removedCount ?? changes.filter(c => c.changeType === 'Removed').length}
                                </span>
                            </div>
                            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100 text-center">
                                <span className="text-[11px] font-semibold text-amber-800 block">Modified Clauses</span>
                                <span className="text-lg font-extrabold text-amber-900">
                                    {comparisonResult.statistics?.modifiedCount ?? changes.filter(c => c.changeType === 'Modified').length}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Clause Changes */}
                    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
                        <div className="px-5 py-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                            <div className="flex gap-2">
                                {['All', 'Modified', 'Added', 'Removed'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setFilterChangeType(tab)}
                                        className={`px-3 py-1 rounded-lg font-bold transition ${
                                            filterChangeType === tab 
                                                ? 'bg-brand-600 text-white' 
                                                : 'text-slate-600 hover:text-slate-900 bg-slate-100'
                                        }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            <div className="text-[11px] text-slate-400">
                                Showing {filteredChanges.length} clause differences
                            </div>
                        </div>

                        <div className="divide-y divide-slate-100 p-5 space-y-4">
                            {filteredChanges.length === 0 ? (
                                <p className="text-xs text-slate-400 py-6 text-center">No clauses match the selected filter.</p>
                            ) : (
                                filteredChanges.map((change, idx) => (
                                    <div key={idx} className="pt-4 first:pt-0 space-y-3 text-xs">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <span className="font-bold text-slate-900 text-sm">{change.clauseName}</span>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                                    change.changeType === 'Added' ? 'bg-emerald-100 text-emerald-800' :
                                                    change.changeType === 'Removed' ? 'bg-rose-100 text-rose-800' :
                                                    'bg-amber-100 text-amber-800'
                                                }`}>
                                                    {change.changeType}
                                                </span>
                                                {change.riskLevel && (
                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                                                        Risk: {change.riskLevel}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                                                <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                                                    Original: {c1Name}
                                                </div>
                                                <p className="font-mono text-[11px] text-slate-700 whitespace-pre-wrap leading-relaxed">
                                                    {change.version1Text}
                                                </p>
                                            </div>

                                            <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                                                <div className="text-[10px] font-bold text-brand-600 uppercase mb-1">
                                                    Revised: {c2Name}
                                                </div>
                                                <p className="font-mono text-[11px] text-slate-800 whitespace-pre-wrap leading-relaxed">
                                                    {change.version2Text}
                                                </p>
                                            </div>
                                        </div>

                                        {change.legalImpact && (
                                            <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-[11px] text-indigo-950 flex items-start gap-2">
                                                <i className="fa-solid fa-scale-balanced text-indigo-600 mt-0.5"></i>
                                                <div>
                                                    <span className="font-bold">Legal Impact: </span>
                                                    {change.legalImpact}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
