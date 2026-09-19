import React, { useState } from 'react';

export default function LoginPage({ setMainPage, setAppView }) {
    const [mode, setMode] = useState('login'); // 'login' or 'signup'

    const handleSubmit = (e) => {
        e.preventDefault();
        setAppView('dashboard');
    };

    return (
        <div className="flex-1 bg-white overflow-y-auto">
            <div className="min-h-full flex flex-col lg:flex-row">
                <div className="lg:w-1/2 bg-gradient-to-br from-brand-900 via-brand-800 to-slate-900 text-white p-8 lg:p-16 flex flex-col justify-between relative overflow-hidden">
                    <div className="flex items-center justify-between z-10">
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setMainPage('landing')}>
                            <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center text-white font-bold">
                                <i className="fa-solid fa-file-contract"></i>
                            </div>
                            <span className="text-2xl font-bold font-heading">ClausePilot</span>
                        </div>
                        <button onClick={() => setMainPage('landing')} className="text-xs text-brand-200 hover:text-white flex items-center gap-1 font-semibold">
                            <i className="fa-solid fa-arrow-left"></i> Back to Home
                        </button>
                    </div>

                    <div className="my-12 z-10 max-w-lg">
                        <h2 className="text-3xl lg:text-4xl font-extrabold font-heading mb-4 leading-tight">
                            Turn Complex Contracts into Clear Insights
                        </h2>
                        <p className="text-brand-100 text-sm leading-relaxed mb-8">
                            Upload, analyze, and track your business contracts with AI. Save time, reduce risk, and never miss an important obligation again.
                        </p>

                        <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-xs">
                            <p className="italic text-brand-100">"ClausePilot helps our team stay on top of agreements and reduces hours of manual work."</p>
                            <p className="font-bold text-white mt-2">&mdash; Operations Lead, TechCorp</p>
                        </div>
                    </div>

                    <div className="z-10 text-xs text-brand-300 flex items-center justify-between border-t border-white/10 pt-4">
                        <span>&copy; 2026 ClausePilot Inc.</span>
                        <span className="flex gap-4">
                            <a href="#" className="hover:underline">Privacy Policy</a>
                            <a href="#" className="hover:underline">Terms of Service</a>
                        </span>
                    </div>
                </div>

                <div className="lg:w-1/2 p-8 lg:p-16 flex items-center justify-center bg-slate-50">
                    <div className="w-full max-w-md space-y-6">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold font-heading text-slate-900">Welcome to ClausePilot</h2>
                            <p className="text-xs text-slate-500 mt-1">{mode === 'login' ? 'Sign in to your account to continue' : 'Create an account to get started'}</p>
                        </div>

                        <div className="flex bg-slate-200/70 p-1 rounded-xl">
                            <button 
                                onClick={() => setMode('login')} 
                                className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${mode === 'login' ? 'bg-white shadow text-brand-600' : 'text-slate-600 hover:text-slate-900'}`}
                            >
                                Sign In
                            </button>
                            <button 
                                onClick={() => setMode('signup')} 
                                className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${mode === 'signup' ? 'bg-white shadow text-brand-600' : 'text-slate-600 hover:text-slate-900'}`}
                            >
                                Sign Up
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {mode === 'signup' && (
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                                    <input type="text" placeholder="John Doe" className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white" />
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Work Email</label>
                                <div className="relative">
                                    <i className="fa-regular fa-envelope absolute left-3.5 top-3 text-slate-400 text-sm"></i>
                                    <input type="email" defaultValue="john@company.com" required className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white" />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-xs font-semibold text-slate-700">Password</label>
                                    <a href="#" className="text-xs text-brand-600 hover:underline font-semibold">Forgot password?</a>
                                </div>
                                <div className="relative">
                                    <i className="fa-solid fa-lock absolute left-3.5 top-3 text-slate-400 text-sm"></i>
                                    <input type="password" defaultValue="••••••••••••" required className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white" />
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-brand-500/25 transition flex items-center justify-center gap-2 text-sm">
                                <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span> <i className="fa-solid fa-arrow-right text-xs"></i>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
