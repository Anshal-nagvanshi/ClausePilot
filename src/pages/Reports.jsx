import React, { useState, useEffect } from 'react';
import { getContracts, getContractById, getRisksByContract, getObligationsByContract, getEffectiveObligationStatus } from '../lib/contractService';
import { generateReport } from '../lib/aiService';

export default function Reports({ setAppView, contractId, _navigateToContract }) {
    const [contracts, setContracts] = useState([]);
    const [selectedId, setSelectedId] = useState(contractId || null);
    const [contract, setContract] = useState(null);
    const [risks, setRisks] = useState([]);
    const [obligations, setObligations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [aiReport, setAiReport] = useState('');
    const [isGeneratingAi, setIsGeneratingAi] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        async function fetchContracts() {
            try {
                const list = await getContracts();
                setContracts(list);
                if (!selectedId && list.length > 0) {
                    setSelectedId(list[0].id);
                }
            } catch (err) {
                console.error('Failed to load contracts:', err);
            }
        }
        fetchContracts();
    }, []);

    useEffect(() => {
        if (!selectedId) {
            setLoading(false);
            return;
        }

        async function loadReportData() {
            setLoading(true);
            setAiReport('');
            try {
                const [cData, rData, oData] = await Promise.all([
                    getContractById(selectedId),
                    getRisksByContract(selectedId),
                    getObligationsByContract(selectedId)
                ]);
                setContract(cData);
                setRisks(rData);
                setObligations(oData);
            } catch (err) {
                console.error('Failed to load contract report data:', err);
            } finally {
                setLoading(false);
            }
        }

        loadReportData();
    }, [selectedId]);

    const handleGenerateAiReport = async () => {
        if (!contract) return;
        setIsGeneratingAi(true);
        try {
            const contextText = contract.extracted_text || `${contract.title}\n${contract.summary || ''}`;
            const reportText = await generateReport(contextText);
            setAiReport(reportText);
        } catch (err) {
            console.error('Failed to generate AI report:', err);
            setAiReport('Could not generate comprehensive report: ' + (err.message || 'Unknown error'));
        } finally {
            setIsGeneratingAi(false);
        }
    };

    const handleCopyReport = () => {
        const text = `ClausePilot Contract Report: ${contract?.title || 'Contract'}
=====================================================
Effective Date: ${contract?.effective_date || 'N/A'}
Expiration Date: ${contract?.expiration_date || 'N/A'}
Contract Value: ${contract?.contract_value || 'N/A'}
Parties: ${Array.isArray(contract?.parties) ? contract.parties.join(', ') : contract?.parties || 'N/A'}

SUMMARY:
${contract?.summary || 'N/A'}

RISKS IDENTIFIED (${risks.length}):
${risks.map(r => `- [${r.severity}] ${r.title}: ${r.description}`).join('\n')}

OBLIGATIONS (${obligations.length}):
${obligations.map(o => `- ${o.description} (Due: ${o.due_date}, Responsible: ${o.responsible_party})`).join('\n')}

${aiReport ? `\nAI EXECUTIVE ANALYSIS:\n${aiReport}` : ''}
`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const highRisks = risks.filter(r => r.severity === 'High');
    const medRisks = risks.filter(r => r.severity === 'Medium');
    const lowRisks = risks.filter(r => r.severity === 'Low');

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">Contract Analysis Report</h1>
                    <p className="text-xs text-slate-500 mt-0.5">Comprehensive audit, risk posture, and AI-powered executive report.</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                    {contracts.length > 0 && (
                        <select
                            value={selectedId || ''}
                            onChange={(e) => setSelectedId(e.target.value)}
                            className="w-full sm:w-auto text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                        >
                            {contracts.map(c => (
                                <option key={c.id} value={c.id}>{c.title}</option>
                            ))}
                        </select>
                    )}
                    {contract && (
                        <div className="flex items-center gap-2 flex-wrap">
                            <button
                                onClick={handleCopyReport}
                                className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs px-3 py-2 rounded-xl transition flex items-center gap-1.5 shadow-2xs"
                            >
                                <i className={`fa-regular ${copied ? 'fa-circle-check text-emerald-600' : 'fa-copy'}`}></i>
                                {copied ? 'Copied!' : 'Copy Report'}
                            </button>
                            <button
                                onClick={() => window.print()}
                                className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs px-3 py-2 rounded-xl transition flex items-center gap-1.5 shadow-2xs"
                            >
                                <i className="fa-solid fa-print"></i> Print
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200">
                    <i className="fa-solid fa-circle-notch fa-spin text-2xl text-brand-600 mb-2"></i>
                    <p className="text-xs text-slate-500">Compiling contract report...</p>
                </div>
            ) : !contract ? (
                <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
                    <i className="fa-regular fa-file-lines text-3xl text-slate-300 mb-2"></i>
                    <h3 className="text-sm font-bold text-slate-700">No contract selected</h3>
                    <p className="text-xs text-slate-500 mt-1">Please upload a contract to generate and review reports.</p>
                    <button onClick={() => setAppView('upload')} className="mt-3 text-xs bg-brand-600 text-white font-bold px-4 py-2 rounded-xl">
                        Upload Contract
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Header Banner */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-bold font-heading text-slate-900">{contract.title}</h2>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                    contract.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                    contract.status === 'Needs Review' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                    'bg-slate-100 text-slate-700 border-slate-200'
                                }`}>
                                    {contract.status || 'Active'}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500">
                                Type: <strong className="text-slate-700">{contract.contract_type || 'General Contract'}</strong> &bull; 
                                Uploaded: {new Date(contract.created_at).toLocaleDateString()}
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleGenerateAiReport}
                                disabled={isGeneratingAi}
                                className="bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition flex items-center gap-2 disabled:opacity-50"
                            >
                                {isGeneratingAi ? (
                                    <>
                                        <i className="fa-solid fa-circle-notch fa-spin"></i>
                                        Generating Deep AI Report...
                                    </>
                                ) : (
                                    <>
                                        <i className="fa-solid fa-wand-magic-sparkles"></i>
                                        Generate Deep AI Audit
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* AI Generated Report Section if present */}
                    {aiReport && (
                        <div className="bg-gradient-to-br from-indigo-50/50 via-white to-brand-50/50 p-6 rounded-2xl border border-indigo-100 shadow-2xs space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-bold font-heading text-indigo-950 flex items-center gap-2">
                                    <i className="fa-solid fa-brain text-indigo-600"></i> AI Comprehensive Executive Analysis
                                </h3>
                                <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">Groq AI Analysis</span>
                            </div>
                            <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap font-sans bg-white/80 p-4 rounded-xl border border-indigo-50">
                                {aiReport}
                            </div>
                        </div>
                    )}

                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
                            <span className="text-[11px] font-semibold text-slate-500 block mb-1">Contract Value</span>
                            <span className="text-base font-extrabold text-slate-900">{contract.contract_value || 'Not specified'}</span>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
                            <span className="text-[11px] font-semibold text-slate-500 block mb-1">Effective Date</span>
                            <span className="text-sm font-extrabold text-slate-900">{contract.effective_date || 'Not specified'}</span>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
                            <span className="text-[11px] font-semibold text-slate-500 block mb-1">Expiration Date</span>
                            <span className="text-sm font-extrabold text-slate-900">{contract.expiration_date || 'Not specified'}</span>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
                            <span className="text-[11px] font-semibold text-slate-500 block mb-1">Renewal Terms</span>
                            <span className="text-xs font-bold text-slate-900 line-clamp-2">{contract.renewal_terms || 'Not specified'}</span>
                        </div>
                    </div>

                    {/* Summary & Parties */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs lg:col-span-2 space-y-3">
                            <h3 className="text-sm font-bold font-heading text-slate-900">Executive Summary</h3>
                            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
                                {contract.summary || 'No summary available for this contract.'}
                            </p>

                            <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-4 text-xs text-slate-600">
                                <div>
                                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Parties Involved</span>
                                    <span className="font-semibold text-slate-800">
                                        {Array.isArray(contract.parties) ? contract.parties.join(', ') : contract.parties || 'Not specified'}
                                    </span>
                                </div>
                                {contract.payment_terms && (
                                    <div>
                                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Payment Terms</span>
                                        <span className="font-semibold text-slate-800">{contract.payment_terms}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Risk Overview Mini-Card */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
                            <h3 className="text-sm font-bold font-heading text-slate-900">Risk Profile</h3>
                            <div className="space-y-2 text-xs">
                                <div className="flex items-center justify-between p-2.5 bg-rose-50 rounded-xl">
                                    <span className="font-semibold text-rose-800 flex items-center gap-1.5">
                                        <i className="fa-solid fa-triangle-exclamation"></i> High Risks
                                    </span>
                                    <span className="font-bold text-rose-900">{highRisks.length}</span>
                                </div>
                                <div className="flex items-center justify-between p-2.5 bg-amber-50 rounded-xl">
                                    <span className="font-semibold text-amber-800 flex items-center gap-1.5">
                                        <i className="fa-solid fa-shield-halved"></i> Medium Risks
                                    </span>
                                    <span className="font-bold text-amber-900">{medRisks.length}</span>
                                </div>
                                <div className="flex items-center justify-between p-2.5 bg-emerald-50 rounded-xl">
                                    <span className="font-semibold text-emerald-800 flex items-center gap-1.5">
                                        <i className="fa-solid fa-circle-check"></i> Low Risks
                                    </span>
                                    <span className="font-bold text-emerald-900">{lowRisks.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Risks Section */}
                    {risks.length > 0 && (
                        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                            <h3 className="text-sm font-bold font-heading text-slate-900">Detailed Risk Items</h3>
                            <div className="space-y-2.5">
                                {risks.map((r, idx) => (
                                    <div key={r.id || idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-3 text-xs">
                                        <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                            r.severity === 'High' ? 'bg-rose-100 text-rose-700' :
                                            r.severity === 'Medium' ? 'bg-amber-100 text-amber-700' :
                                            'bg-emerald-100 text-emerald-700'
                                        }`}>
                                            {r.severity}
                                        </span>
                                        <div className="space-y-0.5">
                                            <div className="font-bold text-slate-900">{r.title}</div>
                                            <p className="text-slate-600 text-[11px] leading-relaxed">{r.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Key Obligations Section */}
                    {obligations.length > 0 && (
                        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                            <h3 className="text-sm font-bold font-heading text-slate-900">Key Obligations &amp; Compliance</h3>
                            <div className="divide-y divide-slate-100 text-xs">
                                {obligations.map((ob, idx) => {
                                    const effective = getEffectiveObligationStatus(ob);
                                    return (
                                        <div key={ob.id || idx} className="py-3 flex items-center justify-between gap-4">
                                            <div className="space-y-0.5">
                                                <div className="font-bold text-slate-900">{ob.description}</div>
                                                <div className="text-[11px] text-slate-500">
                                                    Party: <strong className="text-slate-700">{ob.responsible_party}</strong> &bull; 
                                                    Due: <strong className="text-slate-700">{ob.due_date}</strong>
                                                    {ob.category && ` &bull; Category: ${ob.category}`}
                                                </div>
                                            </div>
                                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${
                                                effective === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                                                effective === 'Overdue' ? 'bg-rose-100 text-rose-800' :
                                                'bg-blue-100 text-blue-800'
                                            }`}>
                                                {effective}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
