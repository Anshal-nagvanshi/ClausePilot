import React from 'react';

export default function Settings({ setAppView }) {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">Settings</h1>
                <p className="text-xs text-slate-500 mt-0.5">Manage your account, preferences, and application settings.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                    <div className="flex items-center gap-2 font-bold text-slate-900 text-sm font-heading">
                        <div className="w-7 h-7 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center text-xs">
                            <i className="fa-regular fa-user"></i>
                        </div>
                        <div>
                            <div>Profile Settings</div>
                            <div className="text-[10px] font-normal text-slate-400">Update your personal information and account details.</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 py-1">
                        <div className="w-14 h-14 rounded-full bg-slate-800 text-white font-bold font-heading text-lg flex items-center justify-center shadow-xs">
                            JD
                        </div>
                        <button type="button" className="bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs transition flex items-center gap-1.5">
                            <i className="fa-solid fa-camera text-slate-400 text-xs"></i> Change Photo
                        </button>
                    </div>

                    <div className="space-y-3 text-xs">
                        <div>
                            <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                            <input type="text" defaultValue="John Doe" className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50/50 font-medium text-slate-900" />
                        </div>

                        <div>
                            <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                            <input type="email" defaultValue="john@company.com" className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50/50 font-medium text-slate-900" />
                        </div>

                        <div>
                            <label className="block font-semibold text-slate-700 mb-1">Role</label>
                            <select className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50/50 font-medium text-slate-900">
                                <option>Legal Counsel &amp; Admin</option>
                                <option>Contract Manager</option>
                                <option>Executive</option>
                            </select>
                        </div>

                        <div>
                            <label className="block font-semibold text-slate-700 mb-1">Organization (Optional)</label>
                            <input type="text" defaultValue="Acme Global Inc." className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50/50 font-medium text-slate-900" />
                        </div>

                        <div>
                            <label className="block font-semibold text-slate-700 mb-1">Bio (Optional)</label>
                            <textarea rows="2" defaultValue="Building AI solutions for smarter contract management." className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50/50 font-medium text-slate-900"></textarea>
                        </div>

                        <button type="button" className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-brand-500/20 transition">
                            Save Changes
                        </button>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                    <div className="flex items-center gap-2 font-bold text-slate-900 text-sm font-heading">
                        <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs">
                            <i className="fa-solid fa-sliders"></i>
                        </div>
                        <div>
                            <div>Preferences</div>
                            <div className="text-[10px] font-normal text-slate-400">Customize your workspace experience.</div>
                        </div>
                    </div>

                    <div className="space-y-3.5 text-xs">
                        <div>
                            <label className="block font-semibold text-slate-700 mb-1">Theme</label>
                            <select className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50/50 font-medium text-slate-900">
                                <option>☀️ Light Mode</option>
                                <option>🌙 Dark Mode</option>
                                <option>💻 System Default</option>
                            </select>
                        </div>

                        <div>
                            <label className="block font-semibold text-slate-700 mb-1">Language</label>
                            <select className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50/50 font-medium text-slate-900">
                                <option>English (US)</option>
                                <option>Spanish</option>
                                <option>German</option>
                            </select>
                        </div>

                        <div>
                            <label className="block font-semibold text-slate-700 mb-1">Date Format</label>
                            <select className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50/50 font-medium text-slate-900">
                                <option>DD MMM YYYY (01 Jan 2026)</option>
                                <option>MM/DD/YYYY</option>
                            </select>
                        </div>

                        <div>
                            <label className="block font-semibold text-slate-700 mb-1">Default View</label>
                            <select className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50/50 font-medium text-slate-900">
                                <option>Dashboard</option>
                                <option>Contracts Directory</option>
                            </select>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                            <span className="font-semibold text-slate-700">Show Page Previews</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                            <span className="font-semibold text-slate-700">Enable AI Suggestions</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-600"></div>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                    <div className="flex items-center gap-2 font-bold text-slate-900 text-sm font-heading">
                        <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-xs">
                            <i className="fa-regular fa-bell"></i>
                        </div>
                        <div>
                            <div>Notification Settings</div>
                            <div className="text-[10px] font-normal text-slate-400">Manage what notifications you receive.</div>
                        </div>
                    </div>

                    <div className="space-y-3.5 text-xs">
                        <div className="flex items-center justify-between py-1 border-b border-slate-100">
                            <span className="font-semibold text-slate-700">Contract Upload Updates</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between py-1 border-b border-slate-100">
                            <span className="font-semibold text-slate-700">Deadline Reminders</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between py-1 border-b border-slate-100">
                            <span className="font-semibold text-slate-700">Risk Alerts</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between py-1 border-b border-slate-100">
                            <span className="font-semibold text-slate-700">Version Comparison Updates</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-600"></div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                    <div className="flex items-center gap-2 font-bold text-slate-900 text-sm font-heading">
                        <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center text-xs">
                            <i className="fa-solid fa-lock"></i>
                        </div>
                        <div>
                            <div>Security</div>
                            <div className="text-[10px] font-normal text-slate-400">Keep your account secure.</div>
                        </div>
                    </div>

                    <div className="space-y-2.5 text-xs">
                        <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition">
                            <div>
                                <div className="font-bold text-slate-900">Change Password</div>
                                <div className="text-[10px] text-slate-500">Update your password regularly.</div>
                            </div>
                            <i className="fa-solid fa-chevron-right text-slate-400 text-xs"></i>
                        </div>

                        <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition">
                            <div>
                                <div className="font-bold text-slate-900">Two-Factor Authentication</div>
                                <div className="text-[10px] text-slate-500">Add an extra layer of security.</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="bg-rose-100 text-rose-800 text-[9px] font-bold px-2 py-0.5 rounded-full">Not Enabled</span>
                                <i className="fa-solid fa-chevron-right text-slate-400 text-xs"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                    <div className="flex items-center gap-2 font-bold text-slate-900 text-sm font-heading">
                        <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs">
                            <i className="fa-solid fa-shield-halved"></i>
                        </div>
                        <div>
                            <div>Data &amp; Privacy</div>
                            <div className="text-[10px] font-normal text-slate-400">Control your data and privacy settings.</div>
                        </div>
                    </div>

                    <div className="space-y-2.5 text-xs">
                        <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition">
                            <div>
                                <div className="font-bold text-slate-900">Data Retention</div>
                                <div className="text-[10px] text-slate-500">Choose how long to keep your data.</div>
                            </div>
                            <i className="fa-solid fa-chevron-right text-slate-400 text-xs"></i>
                        </div>

                        <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition">
                            <div>
                                <div className="font-bold text-slate-900">Download My Data</div>
                                <div className="text-[10px] text-slate-500">Export your contracts and analysis.</div>
                            </div>
                            <i className="fa-solid fa-chevron-right text-slate-400 text-xs"></i>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                    <div className="flex items-center gap-2 font-bold text-slate-900 text-sm font-heading">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 text-brand-600 flex items-center justify-center text-xs">
                            <i className="fa-solid fa-cubes"></i>
                        </div>
                        <div>
                            <div>Application</div>
                            <div className="text-[10px] font-normal text-slate-400">Manage application settings.</div>
                        </div>
                    </div>

                    <div className="space-y-2.5 text-xs">
                        <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition">
                            <div>
                                <div className="font-bold text-slate-900">Clear Cache</div>
                                <div className="text-[10px] text-slate-500">Clear temporary files.</div>
                            </div>
                            <i className="fa-solid fa-chevron-right text-slate-400 text-xs"></i>
                        </div>

                        <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition">
                            <div>
                                <div className="font-bold text-slate-900">About ClausePilot</div>
                                <div className="text-[10px] text-slate-500">Version 1.0.0</div>
                            </div>
                            <i className="fa-solid fa-chevron-right text-slate-400 text-xs"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
