import React, { useState, useEffect } from 'react';
import { getContracts, getContractById, getObligationsByContract, updateObligation, getEffectiveObligationStatus, isDueDateOverdue } from '../lib/contractService';

export default function Timeline({ setAppView, contractId, navigateToContract }) {
    const [contracts, setContracts] = useState([]);
    const [selectedId, setSelectedId] = useState(contractId || null);
    const [contract, setContract] = useState(null);
    const [obligations, setObligations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [viewMode, setViewMode] = useState('timeline'); // 'timeline' | 'list'

    // Fetch contracts list
    useEffect(() => {
        async function fetchContractsList() {
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
        fetchContractsList();
    }, []);

    // Fetch selected contract details + obligations
    useEffect(() => {
        if (!selectedId) {
            setLoading(false);
            return;
        }

        async function loadContractData() {
            setLoading(true);
            try {
                const [cData, obData] = await Promise.all([
                    getContractById(selectedId),
                    getObligationsByContract(selectedId)
                ]);
                setContract(cData);
                setObligations(obData);
            } catch (err) {
                console.error('Failed to load contract timeline data:', err);
            } finally {
                setLoading(false);
            }
        }

        loadContractData();
    }, [selectedId]);

    // Calculate timeline stats accurately
    const upcomingCount = obligations.filter(o => getEffectiveObligationStatus(o) === 'Upcoming').length;
    const overdueCount = obligations.filter(o => getEffectiveObligationStatus(o) === 'Overdue').length;
    const completedCount = obligations.filter(o => getEffectiveObligationStatus(o) === 'Completed').length;

    // Filter obligations using unified effective status
    const filteredObligations = obligations.filter(item => {
        const effective = getEffectiveObligationStatus(item);
        const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
        const matchesStatus = filterStatus === 'All' || effective === filterStatus;
        return matchesCategory && matchesStatus;
    });

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

    const categories = ['All', ...new Set(obligations.map(o => o.category).filter(Boolean))];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <button 
                        onClick={() => {
                            if (selectedId && navigateToContract) {
                                navigateToContract(selectedId);
                            } else {
                                setAppView('contracts');
                            }
                        }} 
                        className="text-xs font-semibold text-brand-600 hover:underline flex items-center gap-1 mb-1"
                    >
                        <i className="fa-solid fa-arrow-left"></i> Back to Contract
                    </button>
                    <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">Contract Timeline</h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Key dates, milestones, and obligations {contract ? `for "${contract.title}"` : ''}
                    </p>
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
                    <select 
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="w-full sm:w-auto text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-700"
                    >
                        {categories.map(c => (
                            <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
                        ))}
                    </select>
                    <select 
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full sm:w-auto text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-700"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Upcoming">Upcoming</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Overdue">Overdue</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200">
                    <i className="fa-solid fa-circle-notch fa-spin text-2xl text-brand-600 mb-2"></i>
                    <p className="text-xs text-slate-500">Loading timeline...</p>
                </div>
            ) : !contract ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
                    <i className="fa-regular fa-calendar text-3xl text-slate-300 mb-2"></i>
                    <h3 className="text-sm font-bold text-slate-700">No contract selected</h3>
                    <p className="text-xs text-slate-500 mt-1">Please upload a contract or select one from the contracts tab.</p>
                    <button onClick={() => setAppView('upload')} className="mt-3 text-xs bg-brand-600 text-white font-bold px-4 py-2 rounded-xl">
                        Upload Contract
                    </button>
                </div>
            ) : (
                <>
                    {/* Stat Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                        <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                                <i className="fa-regular fa-calendar-check"></i>
                            </div>
                            <div>
                                <div className="text-sm font-extrabold text-slate-900 truncate">
                                    {contract.effective_date || 'Not specified'}
                                </div>
                                <div className="text-[10px] text-slate-500 font-semibold">Contract Start Date</div>
                            </div>
                        </div>

                        <div className="bg-purple-50/60 p-4 rounded-2xl border border-purple-100 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold">
                                <i className="fa-regular fa-calendar-xmark"></i>
                            </div>
                            <div>
                                <div className="text-sm font-extrabold text-slate-900 truncate">
                                    {contract.expiration_date || 'Not specified'}
                                </div>
                                <div className="text-[10px] text-slate-500 font-semibold">Contract End Date</div>
                            </div>
                        </div>

                        <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-100 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-brand-600 flex items-center justify-center font-bold">
                                <i className="fa-regular fa-clock"></i>
                            </div>
                            <div>
                                <div className="text-base font-extrabold text-slate-900">{upcomingCount}</div>
                                <div className="text-[10px] text-slate-500 font-semibold">Upcoming Milestones</div>
                            </div>
                        </div>

                        <div className={`p-4 rounded-2xl border flex items-center gap-3 ${overdueCount > 0 ? 'bg-rose-50/80 border-rose-200' : 'bg-amber-50/60 border-amber-100'}`}>
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${overdueCount > 0 ? 'bg-rose-500/10 text-rose-600' : 'bg-amber-500/10 text-amber-600'}`}>
                                <i className="fa-solid fa-triangle-exclamation"></i>
                            </div>
                            <div>
                                <div className={`text-base font-extrabold ${overdueCount > 0 ? 'text-rose-900' : 'text-slate-900'}`}>{overdueCount}</div>
                                <div className="text-[10px] text-slate-500 font-semibold">Overdue Items</div>
                            </div>
                        </div>

                        <div className="bg-teal-50/60 p-4 rounded-2xl border border-teal-100 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center font-bold">
                                <i className="fa-regular fa-circle-check"></i>
                            </div>
                            <div>
                                <div className="text-base font-extrabold text-slate-900">{completedCount}</div>
                                <div className="text-[10px] text-slate-500 font-semibold">Completed Milestones</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Main Timeline View */}
                        <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <h3 className="text-sm font-bold font-heading text-slate-900">Milestone Timeline</h3>
                                <div className="flex bg-slate-100 p-0.5 rounded-lg text-[11px] font-bold text-slate-600">
                                    <button 
                                        onClick={() => setViewMode('timeline')}
                                        className={`px-2.5 py-1 rounded-md transition ${viewMode === 'timeline' ? 'bg-brand-600 text-white shadow-2xs' : 'hover:text-slate-900'}`}
                                    >
                                        Timeline
                                    </button>
                                    <button 
                                        onClick={() => setViewMode('list')}
                                        className={`px-2.5 py-1 rounded-md transition ${viewMode === 'list' ? 'bg-brand-600 text-white shadow-2xs' : 'hover:text-slate-900'}`}
                                    >
                                        List View
                                    </button>
                                </div>
                            </div>

                            {filteredObligations.length === 0 ? (
                                <p className="text-xs text-slate-400 py-8 text-center">No obligations or milestones match current filters.</p>
                            ) : viewMode === 'timeline' ? (
                                <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                                    {filteredObligations.map((item, idx) => {
                                        const effective = getEffectiveObligationStatus(item);
                                        return (
                                            <div key={item.id || idx} className="relative flex items-start gap-4">
                                                <div className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[9px] text-white shadow-xs ${
                                                    effective === 'Completed' ? 'bg-emerald-500' :
                                                    effective === 'Overdue' ? 'bg-rose-500' :
                                                    'bg-brand-500'
                                                }`}>
                                                    <i className={`fa-solid ${
                                                        effective === 'Completed' ? 'fa-check' :
                                                        effective === 'Overdue' ? 'fa-triangle-exclamation' :
                                                        'fa-clock'
                                                    }`}></i>
                                                </div>

                                                <div className="flex-1 bg-slate-50 hover:bg-slate-100/80 transition p-3.5 rounded-xl border border-slate-200/80">
                                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                                        <span className="text-xs font-bold text-slate-900">{item.description}</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap ${
                                                                effective === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                                                                effective === 'Overdue' ? 'bg-rose-100 text-rose-800' :
                                                                'bg-blue-100 text-blue-800'
                                                            }`}>
                                                                {effective}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() => toggleStatus(item)}
                                                                className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition inline-flex items-center gap-1.5 ${
                                                                    effective === 'Completed'
                                                                        ? 'text-slate-600 bg-white hover:bg-slate-200 border border-slate-200'
                                                                        : 'text-white bg-brand-600 hover:bg-brand-700 shadow-2xs'
                                                                }`}
                                                                title={effective === 'Completed' ? 'Undo completion' : 'Mark obligation as completed'}
                                                            >
                                                                <i className={`fa-solid ${effective === 'Completed' ? 'fa-rotate-left' : 'fa-check'}`}></i>
                                                                <span>{effective === 'Completed' ? 'Undo' : 'Complete'}</span>
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-4 mt-2 text-[11px] text-slate-500">
                                                        <span className="flex items-center gap-1">
                                                            <i className="fa-regular fa-calendar text-slate-400"></i>
                                                            Due: <strong className="text-slate-700">{item.due_date || 'No date set'}</strong>
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <i className="fa-regular fa-user text-slate-400"></i>
                                                            Party: <strong className="text-slate-700">{item.responsible_party || 'Unassigned'}</strong>
                                                        </span>
                                                        {item.category && (
                                                            <span className="bg-slate-200/70 text-slate-600 px-2 py-0.5 rounded text-[10px] font-medium">
                                                                {item.category}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100 text-xs">
                                    {filteredObligations.map((item, idx) => {
                                        const effective = getEffectiveObligationStatus(item);
                                        return (
                                            <div key={item.id || idx} className="py-3 flex flex-wrap sm:flex-nowrap items-center justify-between gap-4">
                                                <div className="space-y-0.5">
                                                    <div className="font-bold text-slate-900">{item.description}</div>
                                                    <div className="text-[11px] text-slate-500">
                                                        Responsible: <strong className="text-slate-700">{item.responsible_party}</strong> &bull; Due: <strong className="text-slate-700">{item.due_date}</strong>
                                                        {item.category && ` &bull; Category: ${item.category}`}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                                                        effective === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                                                        effective === 'Overdue' ? 'bg-rose-100 text-rose-800' :
                                                        'bg-blue-100 text-blue-800'
                                                    }`}>
                                                        {effective}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleStatus(item)}
                                                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition inline-flex items-center gap-1.5 ${
                                                            effective === 'Completed'
                                                                ? 'text-slate-600 bg-white hover:bg-slate-200 border border-slate-200'
                                                                : 'text-white bg-brand-600 hover:bg-brand-700 shadow-2xs'
                                                        }`}
                                                    >
                                                        <i className={`fa-solid ${effective === 'Completed' ? 'fa-rotate-left' : 'fa-check'}`}></i>
                                                        <span>{effective === 'Completed' ? 'Undo' : 'Complete'}</span>
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Side Panel: Key Contract Dates */}
                        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                            <h3 className="text-sm font-bold font-heading text-slate-900">Contract Key Dates</h3>
                            
                            <div className="space-y-3 text-xs">
                                <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                                    <div>
                                        <div className="font-bold text-slate-900">Effective Date</div>
                                        <div className="text-[10px] text-slate-500">{contract.effective_date || 'Not specified'}</div>
                                    </div>
                                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Start</span>
                                </div>

                                <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                                    <div>
                                        <div className="font-bold text-slate-900">Expiration Date</div>
                                        <div className="text-[10px] text-slate-500">{contract.expiration_date || 'Not specified'}</div>
                                    </div>
                                    <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full">End</span>
                                </div>

                                <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                                    <div>
                                        <div className="font-bold text-slate-900">Renewal Notice Period</div>
                                        <div className="text-[10px] text-slate-500">{contract.renewal_notice_days ? `${contract.renewal_notice_days} days notice` : 'Not specified'}</div>
                                    </div>
                                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Notice</span>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-slate-100">
                                <button 
                                    onClick={() => navigateToContract && navigateToContract(contract.id)}
                                    className="w-full text-center text-xs font-bold text-brand-600 hover:text-brand-700 py-1"
                                >
                                    View Full Contract Details &rarr;
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
