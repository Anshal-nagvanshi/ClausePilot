import { supabase } from './supabaseClient';

// ========================
// CONTRACTS
// ========================

export async function createContract(contractData) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
        .from('contracts')
        .insert({ ...contractData, user_id: user.id })
        .select()
        .single();

    if (error) throw error;

    // Log activity
    await logActivity('contract_uploaded', `Uploaded "${contractData.title}"`, data.id);

    return data;
}

export async function getContracts() {
    const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

export async function getContractById(contractId) {
    const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .eq('id', contractId)
        .single();

    if (error) throw error;
    return data;
}

export async function updateContract(contractId, updates) {
    const { data, error } = await supabase
        .from('contracts')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', contractId)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function deleteContract(contractId) {
    const { error } = await supabase
        .from('contracts')
        .delete()
        .eq('id', contractId);

    if (error) throw error;
}

// ========================
// OBLIGATIONS
// ========================

export async function createObligations(contractId, obligations) {
    if (!obligations || obligations.length === 0) return [];

    const rows = obligations.map(ob => ({
        contract_id: contractId,
        description: ob.description || ob,
        responsible_party: ob.responsible_party || ob.responsibleParty || 'Not specified',
        due_date: ob.due_date || ob.dueDate || 'Not specified',
        status: ob.status || 'Upcoming',
        category: ob.category || 'General',
        source_page: ob.source_page || ob.sourcePage || null
    }));

    const { data, error } = await supabase
        .from('obligations')
        .insert(rows)
        .select();

    if (error) throw error;
    return data || [];
}

export async function getObligationsByContract(contractId) {
    const { data, error } = await supabase
        .from('obligations')
        .select('*')
        .eq('contract_id', contractId)
        .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
}

export async function getAllObligations() {
    const { data, error } = await supabase
        .from('obligations')
        .select('*, contracts(title)')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

export async function updateObligation(obligationId, updates) {
    const { data, error } = await supabase
        .from('obligations')
        .update(updates)
        .eq('id', obligationId)
        .select()
        .single();

    if (error) throw error;
    return data;
}

// ========================
// RISKS
// ========================

export async function createRisks(contractId, risks) {
    if (!risks || risks.length === 0) return [];

    const rows = risks.map(r => ({
        contract_id: contractId,
        title: r.title || 'Untitled Risk',
        description: r.description || '',
        severity: r.severity || 'Medium'
    }));

    const { data, error } = await supabase
        .from('risks')
        .insert(rows)
        .select();

    if (error) throw error;
    return data || [];
}

export async function getRisksByContract(contractId) {
    const { data, error } = await supabase
        .from('risks')
        .select('*')
        .eq('contract_id', contractId)
        .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
}

export async function getAllRisks() {
    const { data, error } = await supabase
        .from('risks')
        .select('*, contracts(title)')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

// ========================
// CHAT HISTORY
// ========================

export async function saveChatMessage(contractId, role, content) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
        .from('chat_history')
        .insert({
            contract_id: contractId,
            user_id: user.id,
            role,
            content
        })
        .select()
        .single();

    if (error) {
        console.error('Failed to save chat message:', error);
        return null;
    }
    return data;
}

export async function getChatHistory(contractId) {
    const { data, error } = await supabase
        .from('chat_history')
        .select('*')
        .eq('contract_id', contractId)
        .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
}

// ========================
// ACTIVITY LOG
// ========================

export async function logActivity(action, details, contractId = null) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
        .from('activity_log')
        .insert({
            user_id: user.id,
            action,
            details,
            contract_id: contractId
        })
        .select()
        .single();

    if (error) {
        console.error('Failed to log activity:', error);
        return null;
    }
    return data;
}

export async function getRecentActivity(limit = 10) {
    const { data, error } = await supabase
        .from('activity_log')
        .select('*, contracts(title)')
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) throw error;
    return data || [];
}

// ========================
// DASHBOARD STATS
// ========================

export async function getDashboardStats() {
    const [contracts, obligations, risks] = await Promise.all([
        getContracts(),
        getAllObligations(),
        getAllRisks()
    ]);

    const totalContracts = contracts.length;
    const activeContracts = contracts.filter(c => c.status === 'Active').length;

    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const upcomingRenewals = contracts.filter(c => {
        if (!c.expiration_date || c.expiration_date === 'Not specified') return false;
        const exp = new Date(c.expiration_date);
        return exp >= now && exp <= thirtyDaysFromNow;
    }).length;

    const openObligations = obligations.filter(o => o.status !== 'Completed').length;
    const overdueObligations = obligations.filter(o => o.status === 'Overdue').length;
    const highRisks = risks.filter(r => r.severity === 'High').length;

    // Contracts by type
    const typeMap = {};
    contracts.forEach(c => {
        const t = c.contract_type || c.category || 'Other';
        typeMap[t] = (typeMap[t] || 0) + 1;
    });

    return {
        totalContracts,
        activeContracts,
        upcomingRenewals,
        openObligations,
        overdueObligations,
        needsReview: highRisks,
        contractsByType: typeMap,
        recentContracts: contracts.slice(0, 5),
        obligations,
        risks
    };
}

// ========================
// ALERTS
// ========================

export async function getAlerts() {
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

        return generatedAlerts;
    } catch (err) {
        console.error('Failed to get alerts:', err);
        return [];
    }
}

export async function getAlertsCount() {
    const alerts = await getAlerts();
    return alerts.length;
}

