import React, { useState, useEffect } from 'react';
import { getContracts, deleteContract } from '../lib/contractService';

export default function Contracts({ setAppView, navigateToContract, contractsRefreshKey }) {
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [typeFilter, setTypeFilter] = useState('All');

    useEffect(() => { loadContracts(); }, [contractsRefreshKey]);

    const loadContracts = async () => {
        try {
            const data = await getContracts();
            setContracts(data);
        } catch (err) {
            console.error('Failed to load contracts:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (e, contractId) => {
        e.stopPropagation();
        if (!confirm('Delete this contract? This cannot be undone.')) return;
        try {
            await deleteContract(contractId);
            setContracts(c => c.filter(x => x.id !== contractId));
        } catch (err) { console.error('Delete failed:', err); }
    };

    const filtered = contracts.filter(c => {
        const matchSearch = !search || c.title?.toLowerCase().includes(search.toLowerCase()) ||
            (c.parties || []).join(' ').toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'All' || c.status === statusFilter;
        const matchType = typeFilter === 'All' || c.contract_type === typeFilter || c.category === typeFilter;
        return matchSearch && matchStatus && matchType;
    });

    const uniqueTypes = [...new Set(contracts.map(c => c.contract_type || c.category).filter(Boolean))];

    if (loading) {
        return <div className="flex items-center justify-center h-64"><i className="fa-solid fa-spinner fa-spin text-brand-600 text-2xl"></i></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">Contracts Directory</h1>
                    <p className="text-xs text-slate-500 mt-0.5">Browse, filter, and manage all organization agreements.</p>
                </div>
                <button onClick={() => setAppView('upload')} className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-brand-500/20 transition flex items-center gap-2">
                    <i className="fa-solid fa-cloud-arrow-up"></i> Upload Contract
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="relative flex-1 min-w-[240px]">
                        <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-slate-400 text-xs"></i>
                        <input type="text" placeholder="Search contracts..." value={search} onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50" />
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-700">
                            <option value="All">All Statuses</option>
                            <option value="Active">Active</option>
                            <option value="Pending">Pending</option>
                            <option value="Expired">Expired</option>
                        </select>
                        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-700">
                            <option value="All">All Types</option>
                            {uniqueTypes.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <div className="text-center py-12 text-xs text-slate-400">
                        <i className="fa-regular fa-folder-open text-3xl mb-3 block"></i>
                        {contracts.length === 0 ? 'No contracts yet. Upload your first contract!' : 'No contracts match your filters.'}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50/80 text-slate-500 font-semibold uppercase text-[10px] border-b border-slate-200">
                                <tr>
                                    <th className="py-3 px-4">Contract Name</th>
                                    <th className="py-3 px-4">Parties</th>
                                    <th className="py-3 px-4">Type</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4">Expiry Date</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                                {filtered.map(c => (
                                    <tr key={c.id} className="hover:bg-slate-50 transition cursor-pointer" onClick={() => navigateToContract(c.id)}>
                                        <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                                            <i className={`fa-regular ${c.file_name?.endsWith('.pdf') ? 'fa-file-pdf text-rose-500' : 'fa-file-lines text-blue-500'} text-sm`}></i>
                                            {c.title}
                                        </td>
                                        <td className="py-3 px-4">{(c.parties || []).join(' • ') || '—'}</td>
                                        <td className="py-3 px-4">{c.contract_type || c.category || '—'}</td>
                                        <td className="py-3 px-4">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : c.status === 'Expired' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}`}>
                                                {c.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-slate-500">{c.expiration_date || '—'}</td>
                                        <td className="py-3 px-4 text-right">
                                            <button onClick={(e) => { e.stopPropagation(); navigateToContract(c.id); }} className="text-brand-600 hover:text-brand-800 font-bold px-2 py-1">View</button>
                                            <button onClick={(e) => handleDelete(e, c.id)} className="text-rose-500 hover:text-rose-700 font-bold px-2 py-1 ml-1"><i className="fa-solid fa-trash-can text-[10px]"></i></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
