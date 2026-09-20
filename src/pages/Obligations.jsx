import React, { useEffect, useRef, useState } from 'react';
import { getObligationsByContract, getContractById, updateObligation, getEffectiveObligationStatus, isDueDateOverdue } from '../lib/contractService';

export default function Obligations({ setAppView, contractId }) {
    const chartRef = useRef(null);
    const [obligations, setObligations] = useState([]);
    const [contract, setContract] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { if (contractId) loadData(); else setLoading(false); }, [contractId]);

    const loadData = async () => {
        try {
            const [obs, c] = await Promise.all([
                getObligationsByContract(contractId),
                getContractById(contractId)
            ]);
            setObligations(obs);
            setContract(c);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    useEffect(() => {
        if (!chartRef.current || !window.Chart || obligations.length === 0) return;
        const statusCounts = { Upcoming: 0, Overdue: 0, Completed: 0 };
        obligations.forEach(o => {
            const s = getEffectiveObligationStatus(o);
            if (statusCounts[s] !== undefined) {
                statusCounts[s]++;
            } else {
                statusCounts[s] = 1;
            }
        });

        const labels = Object.keys(statusCounts).filter(k => statusCounts[k] > 0);
        const data = labels.map(k => statusCounts[k]);
        const colorMap = {
            Upcoming: '#3b82f6',
            Overdue: '#f43f5e',
            Completed: '#10b981'
        };

        const chart = new window.Chart(chartRef.current, {
            type: 'doughnut',
            data: {
                labels,
                datasets: [{
                    data,
                    backgroundColor: labels.map(l => colorMap[l] || '#94a3b8'),
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                cutout: '72%',
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: { boxWidth: 12, font: { size: 11 } }
                    }
                },
                responsive: true,
                maintainAspectRatio: false
            }
        });
        return () => chart.destroy();
    }, [obligations]);

    const toggleStatus = async (ob) => {
        const currentEffective = getEffectiveObligationStatus(ob);
        const newStatus = currentEffective === 'Completed'
            ? (isDueDateOverdue(ob.due_date) ? 'Overdue' : 'Upcoming')
            : 'Completed';
        try {
            await updateObligation(ob.id, { status: newStatus });
            setObligations(prev => prev.map(o => o.id === ob.id ? { ...o, status: newStatus } : o));
        } catch (err) { console.error('Failed to update obligation status:', err); }
    };

    if (loading) return <div className="flex items-center justify-center h-64"><i className="fa-solid fa-spinner fa-spin text-brand-600 text-2xl"></i></div>;

    if (!contractId) {
        return <div className="text-center py-16 text-xs text-slate-400"><p>Select a contract first to view its obligations.</p><button onClick={() => setAppView('contracts')} className="text-brand-600 font-bold hover:underline mt-2">Go to Contracts</button></div>;
    }

    const total = obligations.length;
    const upcoming = obligations.filter(o => getEffectiveObligationStatus(o) === 'Upcoming').length;
    const overdue = obligations.filter(o => getEffectiveObligationStatus(o) === 'Overdue').length;
    const completed = obligations.filter(o => getEffectiveObligationStatus(o) === 'Completed').length;

    const statusColor = (s) => s === 'Upcoming' ? 'bg-blue-100 text-blue-800' : s === 'Overdue' ? 'bg-rose-100 text-rose-800' : s === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800';
    const catColor = (c) => c === 'Payment' ? 'bg-purple-50 text-purple-700' : c === 'Service Delivery' ? 'bg-blue-50 text-brand-700' : c === 'Renewal' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600';

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <button onClick={() => setAppView('contract-details')} className="text-xs font-semibold text-brand-600 hover:underline flex items-center gap-1 mb-1"><i className="fa-solid fa-arrow-left"></i> Back to Contract</button>
                    <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">Obligations</h1>
                    <p className="text-xs text-slate-500 mt-0.5">All identified obligations from {contract?.title || 'this contract'}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-brand-600 flex items-center justify-center text-xl font-bold"><i className="fa-regular fa-square-check"></i></div>
                    <div><div className="text-2xl font-extrabold text-slate-900 font-heading">{total}</div><div className="text-xs font-semibold text-slate-700">Total</div></div>
                </div>
                <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xl font-bold"><i className="fa-regular fa-circle-check"></i></div>
                    <div><div className="text-2xl font-extrabold text-slate-900 font-heading">{upcoming}</div><div className="text-xs font-semibold text-slate-700">Upcoming</div></div>
                </div>
                <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center text-xl font-bold"><i className="fa-regular fa-clock"></i></div>
                    <div><div className="text-2xl font-extrabold text-slate-900 font-heading">{overdue}</div><div className="text-xs font-semibold text-slate-700">Overdue</div></div>
                </div>
                <div className="bg-purple-50/60 p-4 rounded-2xl border border-purple-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center text-xl font-bold"><i className="fa-solid fa-users-gear"></i></div>
                    <div><div className="text-2xl font-extrabold text-slate-900 font-heading">{completed}</div><div className="text-xs font-semibold text-slate-700">Completed</div></div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
                {obligations.length === 0 ? (
                    <div className="text-center py-12 text-xs text-slate-400"><i className="fa-regular fa-clipboard text-3xl mb-2 block"></i>No obligations extracted yet.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50/80 text-slate-500 font-semibold uppercase text-[10px] border-b border-slate-200">
                                <tr><th className="py-3 px-4 w-10">#</th><th className="py-3 px-4">Obligation</th><th className="py-3 px-4">Responsible Party</th><th className="py-3 px-4">Due Date</th><th className="py-3 px-4">Status</th><th className="py-3 px-4">Category</th><th className="py-3 px-4 text-right">Actions</th></tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                                {obligations.map((ob, idx) => {
                                    const effective = getEffectiveObligationStatus(ob);
                                    return (
                                        <tr key={ob.id}>
                                            <td className="py-3 px-4 text-slate-400">{idx + 1}</td>
                                            <td className="py-3 px-4 font-bold text-slate-900 max-w-xs">{ob.description}</td>
                                            <td className="py-3 px-4">{ob.responsible_party || '—'}</td>
                                            <td className="py-3 px-4">{ob.due_date || '—'}</td>
                                            <td className="py-3 px-4"><span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${statusColor(effective)}`}>{effective}</span></td>
                                            <td className="py-3 px-4"><span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${catColor(ob.category)}`}>{ob.category || '—'}</span></td>
                                            <td className="py-3 px-4 text-right">
                                                <button
                                                    onClick={() => toggleStatus(ob)}
                                                    className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition inline-flex items-center gap-1.5 ${
                                                        effective === 'Completed'
                                                            ? 'text-slate-600 bg-slate-100 hover:bg-slate-200'
                                                            : 'text-white bg-brand-600 hover:bg-brand-700 shadow-2xs'
                                                    }`}
                                                >
                                                    <i className={`fa-solid ${effective === 'Completed' ? 'fa-rotate-left' : 'fa-check'}`}></i>
                                                    <span>{effective === 'Completed' ? 'Undo' : 'Complete'}</span>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {obligations.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                        <h3 className="text-sm font-bold font-heading text-slate-900">By Status</h3>
                        <div className="flex items-center justify-center relative py-2">
                            <div className="w-40 h-40"><canvas ref={chartRef}></canvas></div>
                            <div className="absolute text-center"><div className="text-2xl font-extrabold text-slate-900 font-heading">{total}</div><div className="text-[10px] font-semibold text-slate-400">Total</div></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
