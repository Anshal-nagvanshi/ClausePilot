import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Settings({ setAppView, user, handleLogout }) {
    const userEmail = user?.email || 'user@example.com';
    const initialName = user?.user_metadata?.full_name || user?.user_metadata?.name || userEmail.split('@')[0];
    
    const [fullName, setFullName] = useState(initialName);
    const [role, setRole] = useState(user?.user_metadata?.role || 'Legal Counsel & Admin');
    const [organization, setOrganization] = useState(user?.user_metadata?.organization || 'ClausePilot User');
    const [newPassword, setNewPassword] = useState('');
    const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
    const [isSaving, setIsSaving] = useState(false);

    // Derive avatar initials
    const initials = (fullName || userEmail)
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'CP';

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setStatusMsg({ type: '', text: '' });

        try {
            const { error } = await supabase.auth.updateUser({
                data: {
                    full_name: fullName,
                    role,
                    organization
                }
            });

            if (error) throw error;
            setStatusMsg({ type: 'success', text: 'Profile updated successfully!' });
        } catch (err) {
            console.error('Error updating profile:', err);
            setStatusMsg({ type: 'error', text: err.message || 'Failed to update profile.' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (!newPassword || newPassword.length < 6) {
            setStatusMsg({ type: 'error', text: 'Password must be at least 6 characters.' });
            return;
        }

        setIsSaving(true);
        setStatusMsg({ type: '', text: '' });

        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;
            setNewPassword('');
            setStatusMsg({ type: 'success', text: 'Password changed successfully!' });
        } catch (err) {
            console.error('Error updating password:', err);
            setStatusMsg({ type: 'error', text: err.message || 'Failed to change password.' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">Account &amp; Workspace Settings</h1>
                    <p className="text-xs text-slate-500 mt-0.5">Manage your authenticated user profile, security credentials, and preferences.</p>
                </div>
                {handleLogout && (
                    <button
                        onClick={handleLogout}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs px-4 py-2 rounded-xl border border-rose-200 transition flex items-center gap-1.5 w-max"
                    >
                        <i className="fa-solid fa-right-from-bracket"></i> Sign Out
                    </button>
                )}
            </div>

            {statusMsg.text && (
                <div className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    statusMsg.type === 'success' 
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}>
                    <i className={`fa-solid ${statusMsg.type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}`}></i>
                    {statusMsg.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
                {/* Profile Form */}
                <form onSubmit={handleSaveProfile} className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                    <div className="flex items-center gap-2 font-bold text-slate-900 text-sm font-heading">
                        <div className="w-7 h-7 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center text-xs">
                            <i className="fa-regular fa-user"></i>
                        </div>
                        <div>
                            <div>Profile Information</div>
                            <div className="text-[10px] font-normal text-slate-400">Authenticated via Supabase Auth</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 py-1">
                        <div className="w-14 h-14 rounded-full bg-brand-600 text-white font-bold font-heading text-lg flex items-center justify-center shadow-xs">
                            {initials}
                        </div>
                        <div className="text-xs">
                            <div className="font-bold text-slate-900">{fullName || 'User'}</div>
                            <div className="text-[11px] text-slate-500">{userEmail}</div>
                            <span className="inline-block mt-1 bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-full">
                                Supabase Verified
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3 text-xs">
                        <div>
                            <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                            <input 
                                type="text" 
                                value={fullName} 
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50/50 font-medium text-slate-900" 
                            />
                        </div>

                        <div>
                            <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                            <input 
                                type="email" 
                                value={userEmail} 
                                disabled
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-100 font-medium text-slate-500 cursor-not-allowed" 
                            />
                        </div>

                        <div>
                            <label className="block font-semibold text-slate-700 mb-1">Role</label>
                            <select 
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50/50 font-medium text-slate-900"
                            >
                                <option>Legal Counsel &amp; Admin</option>
                                <option>Contract Manager</option>
                                <option>Compliance Officer</option>
                                <option>Executive / Partner</option>
                            </select>
                        </div>

                        <div>
                            <label className="block font-semibold text-slate-700 mb-1">Organization</label>
                            <input 
                                type="text" 
                                value={organization}
                                onChange={(e) => setOrganization(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50/50 font-medium text-slate-900" 
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={isSaving}
                            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-brand-500/20 transition disabled:opacity-50"
                        >
                            {isSaving ? 'Saving Profile...' : 'Save Profile Details'}
                        </button>
                    </div>
                </form>

                {/* Security & Password */}
                <form onSubmit={handleUpdatePassword} className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                    <div className="flex items-center gap-2 font-bold text-slate-900 text-sm font-heading">
                        <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center text-xs">
                            <i className="fa-solid fa-lock"></i>
                        </div>
                        <div>
                            <div>Security Credentials</div>
                            <div className="text-[10px] font-normal text-slate-400">Update account password and review auth status.</div>
                        </div>
                    </div>

                    <div className="space-y-3 text-xs">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600 space-y-1">
                            <div>Account Created: <strong>{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Active session'}</strong></div>
                            <div className="truncate">User ID: <strong className="font-mono text-[10px] text-slate-500">{user?.id || 'Unknown'}</strong></div>
                        </div>

                        <div>
                            <label className="block font-semibold text-slate-700 mb-1">New Password</label>
                            <input 
                                type="password" 
                                placeholder="Enter new password (min. 6 chars)"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50/50 font-medium text-slate-900" 
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={isSaving || !newPassword}
                            className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition disabled:opacity-40"
                        >
                            {isSaving ? 'Updating...' : 'Update Password'}
                        </button>
                    </div>

                    <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                        <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                            <div>
                                <div className="font-bold text-slate-900">Session Protection</div>
                                <div className="text-[10px] text-slate-500">Auto JWT token refresh active</div>
                            </div>
                            <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-full">Active</span>
                        </div>
                    </div>
                </form>

                {/* Workspace Preferences */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                    <div className="flex items-center gap-2 font-bold text-slate-900 text-sm font-heading">
                        <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs">
                            <i className="fa-solid fa-sliders"></i>
                        </div>
                        <div>
                            <div>Workspace Preferences</div>
                            <div className="text-[10px] font-normal text-slate-400">ClausePilot application settings</div>
                        </div>
                    </div>

                    <div className="space-y-3.5 text-xs">
                        <div>
                            <label className="block font-semibold text-slate-700 mb-1">Default AI Model</label>
                            <select defaultValue="Groq LLaMA-3 70B" className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 font-medium text-slate-900">
                                <option>Groq LLaMA-3 70B (Ultra Fast)</option>
                                <option>Groq Mixtral 8x7B</option>
                            </select>
                        </div>

                        <div>
                            <label className="block font-semibold text-slate-700 mb-1">Storage Provider</label>
                            <input 
                                type="text" 
                                value="Supabase Storage (contract-documents)" 
                                disabled
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed font-medium text-[11px]" 
                            />
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                            <span className="font-semibold text-slate-700">Auto-Extract Risks on Upload</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                            <span className="font-semibold text-slate-700">Auto-Extract Obligations</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-600"></div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
