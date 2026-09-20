import React, { useState, useEffect } from 'react';
import { getAlerts } from '../lib/contractService';

export default function Alerts({ _setAppView, navigateToContract, onAlertsCountChange }) {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterSeverity, setFilterSeverity] = useState('All');

    useEffect(() => {
        async function loadAlerts() {
            setLoading(true);
            try {
                const generatedAlerts = await getAlerts();
                setAlerts(generatedAlerts);
                if (onAlertsCountChange) {
                    onAlertsCountChange(generatedAlerts.length);
                }
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
