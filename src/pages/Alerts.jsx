import React, { useState, useEffect } from 'react';
import { getContracts, getAllObligations, getAllRisks } from '../lib/contractService';

export default function Alerts({ setAppView, navigateToContract }) {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterSeverity, setFilterSeverity] = useState('All');

    useEffect(() => {
        async function loadAlerts() {
            setLoading(true);
            try {
                const [contracts, obligations, risks] = await Promise.all([
                    getContracts(),
                    getAllObligations(),
                    getAllRisks()
                ]);

                const generatedAlerts = [];
                const now = new Date();
                const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

                // 1. Expirations & Renewals
                contracts.forEach(c => {
                    if (c.expiration_date && c.expiration_date !== 'Not specified') {
                        const expDate = new Date(c.expiration_date);
                        if (!isNaN(expDate)) {
                            if (expDate < now) {
                                generatedAlerts.push({
                                    id: `exp-${c.id}`,
                                    title: 'Contract Expired',
                                    description: `"${c.title}" reached its expiration date on ${c.expiration_date}.`,
                                    severity: 'Urgent',
                                    badgeColor: 'bg-rose-100 text-rose-700 border-rose-200',
                                    icon: 'fa-solid fa-triangle-exclamation',
                                    iconBg: 'bg-rose-500 text-white',
                                    contractId: c.id,
                                    contractTitle: c.title,
                                    date: c.expiration_date
                                });
                            } else if (expDate <= thirtyDaysLater) {
                                const daysLeft = Math.ceil((expDate - now) / (1000 * 60 * 60 * 24));
                                generatedAlerts.push({
                                    id: `renew-${c.id}`,
                                    title: 'Expiration Notice Approaching',
                                    description: `"${c.title}" will expire in ${daysLeft} days (${c.expiration_date}). Review renewal terms.`,
                                    severity: 'Urgent',
                                    badgeColor: 'bg-rose-100 text-rose-700 border-rose-200',
                                    icon: 'fa-solid fa-clock-rotate-left',
                                    iconBg: 'bg-rose-500 text-white',
                                    contractId: c.id,
                                    contractTitle: c.title,
                                    date: c.expiration_date
                                });
                            }
                        }
                    }
                });

                // 2. Overdue Obligations
                obligations.forEach(o => {
                    if (o.status === 'Overdue') {
                        generatedAlerts.push({
                            id: `ob-overdue-${o.id}`,
                            title: 'Overdue Obligation',
                            description: `${o.description} (Responsible: ${o.responsible_party}) is marked as overdue.`,
                            severity: 'Urgent',
                            badgeColor: 'bg-rose-100 text-rose-700 border-rose-200',
                            icon: 'fa-solid fa-circle-exclamation',
                            iconBg: 'bg-rose-500 text-white',
                            contractId: o.contract_id,
                            contractTitle: o.contracts?.title || 'Contract',
                            date: o.due_date
                        });
                    } else if (o.status !== 'Completed' && o.due_date && o.due_date !== 'Not specified') {
                        const d = new Date(o.due_date);
                        if (!isNaN(d)) {
                            if (d < now) {
                                generatedAlerts.push({
                                    id: `ob-pastdue-${o.id}`,
                                    title: 'Overdue Obligation',
                                    description: `Due date passed (${o.due_date}): "${o.description}".`,
                                    severity: 'Urgent',
                                    badgeColor: 'bg-rose-100 text-rose-700 border-rose-200',
                                    icon: 'fa-solid fa-circle-exclamation',
                                    iconBg: 'bg-rose-500 text-white',
                                    contractId: o.contract_id,
                                    contractTitle: o.contracts?.title || 'Contract',
                                    date: o.due_date
                                });
                            } else if (d <= new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000)) {
                                generatedAlerts.push({
                                    id: `ob-due-soon-${o.id}`,
                                    title: 'Obligation Due Soon',
                                    description: `Due on ${o.due_date}: "${o.description}". Assigned to ${o.responsible_party}.`,
                                    severity: 'Medium',
                                    badgeColor: 'bg-amber-100 text-amber-700 border-amber-200',
                                    icon: 'fa-regular fa-clock',
                                    iconBg: 'bg-amber-500 text-white',
                                    contractId: o.contract_id,
                                    contractTitle: o.contracts?.title || 'Contract',
                                    date: o.due_date
                                });
                            }
                        }
                    }
                });

                // 3. High and Medium Risks
                risks.forEach(r => {
                    if (r.severity === 'High') {
                        generatedAlerts.push({
                            id: `risk-high-${r.id}`,
                            title: `High Risk: ${r.title}`,
                            description: r.description || 'High risk identified in contract clauses requiring immediate attention.',
                            severity: 'High',
                            badgeColor: 'bg-orange-100 text-orange-700 border-orange-200',
                            icon: 'fa-solid fa-triangle-exclamation',
                            iconBg: 'bg-orange-500 text-white',
                            contractId: r.contract_id,
                            contractTitle: r.contracts?.title || 'Contract',
                            date: 'Action needed'
                        });
                    } else if (r.severity === 'Medium') {
                        generatedAlerts.push({
                            id: `risk-med-${r.id}`,
                            title: `Medium Risk: ${r.title}`,
                            description: r.description || 'Moderate risk flagged in contract clauses.',
                            severity: 'Medium',
                            badgeColor: 'bg-amber-100 text-amber-700 border-amber-200',
                            icon: 'fa-solid fa-shield-halved',
                            iconBg: 'bg-amber-500 text-white',
                            contractId: r.contract_id,
                            contractTitle: r.contracts?.title || 'Contract',
                            date: 'Review recommended'
                        });
                    }
                });

                setAlerts(generatedAlerts);
            } catch (err) {
                console.error('Failed to generate alerts:', err);
            } finally {
                setLoading(false);
            }
        }

        loadAlerts();
    }, []);

    const filteredAlerts = alerts.filter(a => {
        if (filterSeverity === 'All') return true;
        return a.severity.toLowerCase() === filterSeverity.toLowerCase();
    });

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">Alerts &amp; Notifications</h1>
                    <p className="text-xs text-slate-500 mt-0.5">Real-time alerts for contract deadlines, upcoming renewals, and detected risks.</p>
                </div>
                <div className="flex items-center gap-2">
                    <select
                        value={filterSeverity}
                        onChange={(e) => setFilterSeverity(e.target.value)}
                        className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-700"
                    >
                        <option value="All">All Severities</option>
                        <option value="Urgent">Urgent</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200">
                    <i className="fa-solid fa-circle-notch fa-spin text-2xl text-brand-600 mb-2"></i>
                    <p className="text-xs text-slate-500">Loading alerts...</p>
                </div>
            ) : filteredAlerts.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 text-xl">
                        <i className="fa-solid fa-circle-check"></i>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">All Clear!</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                        No active alerts match your criteria. When contracts near expiration, obligations are due, or risks are detected, they will show up here.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredAlerts.map(alert => (
                        <div
                            key={alert.id}
                            className="p-4 bg-white hover:bg-slate-50/80 transition border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs"
                        >
                            <div className="flex items-start gap-3.5">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${alert.iconBg}`}>
                                    <i className={alert.icon}></i>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-slate-900">{alert.title}</span>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${alert.badgeColor}`}>
                                            {alert.severity}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-600 leading-relaxed">{alert.description}</p>
                                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                                        <span>Contract: <strong className="text-slate-700">{alert.contractTitle}</strong></span>
                                        {alert.date && <span>&bull; Date: {alert.date}</span>}
                                    </div>
                                </div>
                            </div>

                            <div className="shrink-0 flex sm:flex-col items-end justify-end">
                                {alert.contractId && (
                                    <button
                                        onClick={() => navigateToContract(alert.contractId)}
                                        className="text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline flex items-center gap-1"
                                    >
                                        View Contract &rarr;
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
