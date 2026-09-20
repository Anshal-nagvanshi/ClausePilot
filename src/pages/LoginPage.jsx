import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function LoginPage({ setMainPage, setAppView, setUser, initialMode = 'login' }) {
    const [mode, setMode] = useState(initialMode); // 'login' or 'signup'
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (initialMode) {
            setMode(initialMode);
            setErrorMessage('');
            setSuccessMessage('');
        }
    }, [initialMode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
        setLoading(true);

        const cleanEmail = email.trim();
        const cleanPassword = password;

        if (!cleanEmail || !cleanPassword) {
            setErrorMessage('Please enter both email and password.');
            setLoading(false);
            return;
        }

        if (mode === 'signup' && cleanPassword.length < 6) {
            setErrorMessage('Password must be at least 6 characters long.');
            setLoading(false);
            return;
        }

        try {
            if (mode === 'signup') {
                const { data, error } = await supabase.auth.signUp({
                    email: cleanEmail,
                    password: cleanPassword,
                    options: {
                        data: {
                            full_name: fullName.trim() || cleanEmail.split('@')[0] || 'User'
                        }
                    }
                });

                if (error) {
                    setErrorMessage(error.message);
                    return;
                }

                if (data?.session?.user) {
                    if (setUser) setUser(data.session.user);
                    setAppView('dashboard');
                } else if (data?.user) {
                    // Registration recorded in backend, confirmation may be required
                    setSuccessMessage('Registration successful! If your account requires email confirmation, please check your inbox before signing in.');
                    setMode('login');
                } else {
                    setErrorMessage('Account creation failed. Please try again.');
                }
            } else {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: cleanEmail,
                    password: cleanPassword
                });

                if (error) {
                    setErrorMessage(error.message);
                    return;
                }

                if (data?.session?.user) {
                    if (setUser) setUser(data.session.user);
                    setAppView('dashboard');
                } else {
                    setErrorMessage('Unable to sign in. Please verify your credentials.');
                }
            }
        } catch (err) {
            setErrorMessage(err.message || 'An unexpected error occurred during authentication.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 bg-white overflow-y-auto">
            <div className="min-h-full flex flex-col lg:flex-row">
                <div className="lg:w-1/2 bg-gradient-to-br from-brand-900 via-brand-800 to-slate-900 text-white p-5 sm:p-8 lg:p-16 flex flex-col justify-between relative overflow-hidden">
                    <div className="flex items-center justify-between z-10">
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setMainPage('landing')}>
                            <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                                <i className="fa-solid fa-file-contract"></i>
                            </div>
                            <span className="text-2xl font-bold font-heading">ClausePilot</span>
                        </div>
                        <button onClick={() => setMainPage('landing')} className="text-xs text-brand-200 hover:text-white flex items-center gap-1 font-semibold">
                            <i className="fa-solid fa-arrow-left"></i> Back to Home
                        </button>
                    </div>

                    <div className="hidden lg:block my-12 z-10 max-w-lg">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold mb-4 border border-brand-400/20">
                            <i className="fa-solid fa-bolt text-amber-400"></i> Supabase Auth &amp; Cloud Database Connected
                        </div>
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

                    <div className="hidden lg:flex z-10 text-xs text-brand-300 items-center justify-between border-t border-white/10 pt-4">
                        <span>&copy; 2026 ClausePilot Inc.</span>
                        <span className="flex gap-4">
                            <a href="#" className="hover:underline">Privacy Policy</a>
                            <a href="#" className="hover:underline">Terms of Service</a>
                        </span>
                    </div>
                </div>

                <div className="lg:w-1/2 p-6 sm:p-8 lg:p-16 flex items-center justify-center bg-slate-50 flex-1">
                    <div className="w-full max-w-md space-y-6">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold font-heading text-slate-900">Welcome to ClausePilot</h2>
                            <p className="text-xs text-slate-500 mt-1">{mode === 'login' ? 'Sign in to your account with Supabase' : 'Create a Supabase-powered account'}</p>
                        </div>

                        <div className="flex bg-slate-200/70 p-1 rounded-xl">
                            <button 
                                onClick={() => { setMode('login'); setErrorMessage(''); setSuccessMessage(''); }} 
                                className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${mode === 'login' ? 'bg-white shadow text-brand-600' : 'text-slate-600 hover:text-slate-900'}`}
                            >
                                Sign In
                            </button>
                            <button 
                                onClick={() => { setMode('signup'); setErrorMessage(''); setSuccessMessage(''); }} 
                                className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${mode === 'signup' ? 'bg-white shadow text-brand-600' : 'text-slate-600 hover:text-slate-900'}`}
                            >
                                Sign Up
                            </button>
                        </div>

                        {errorMessage && (
                            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex flex-col gap-2">
                                <div className="flex items-start gap-2">
                                    <i className="fa-solid fa-circle-exclamation mt-0.5 text-rose-500"></i>
                                    <div className="flex-1 font-medium leading-relaxed">
                                        <span>{errorMessage}</span>
                                    </div>
                                </div>
                                {errorMessage.toLowerCase().includes('rate limit') && (
                                    <div className="mt-1 pt-2 border-t border-rose-200/80 text-[11px] text-rose-800 space-y-1">
                                        <p className="font-bold flex items-center gap-1.5">
                                            <i className="fa-solid fa-lightbulb text-amber-500"></i> How to fix this in Supabase (10-second fix):
                                        </p>
                                        <ol className="list-decimal list-inside space-y-0.5 text-rose-700 text-[11px]">
                                            <li>Open your <strong>Supabase Dashboard</strong></li>
                                            <li>Go to <strong>Authentication &rarr; Providers &rarr; Email</strong></li>
                                            <li>Turn <strong>Confirm email</strong> to <strong>OFF</strong> and click <strong>Save</strong></li>
                                        </ol>
                                        <p className="text-[10px] text-slate-500 mt-1">
                                            Turning this off allows immediate sign-ups without sending confirmation emails, permanently avoiding the email rate limit.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {successMessage && (
                            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 flex items-start gap-2">
                                <i className="fa-solid fa-circle-check mt-0.5 text-emerald-500"></i>
                                <div className="flex-1 font-medium leading-relaxed">
                                    <span>{successMessage}</span>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {mode === 'signup' && (
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                                    <input 
                                        type="text" 
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Enter your full name" 
                                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white" 
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Work Email</label>
                                <div className="relative">
                                    <i className="fa-regular fa-envelope absolute left-3.5 top-3 text-slate-400 text-sm"></i>
                                    <input 
                                        type="email" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@company.com" 
                                        required 
                                        className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white" 
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-xs font-semibold text-slate-700">Password</label>
                                    <a href="#" onClick={(e) => { e.preventDefault(); alert("Use your registered email and password to sign in."); }} className="text-xs text-brand-600 hover:underline font-semibold">Forgot password?</a>
                                </div>
                                <div className="relative">
                                    <i className="fa-solid fa-lock absolute left-3.5 top-3 text-slate-400 text-sm"></i>
                                    <input 
                                        type="password" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••••••" 
                                        required 
                                        className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white" 
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl shadow-lg shadow-brand-500/25 transition flex items-center justify-center gap-2 text-sm"
                            >
                                {loading ? (
                                    <>
                                        <i className="fa-solid fa-spinner fa-spin text-sm"></i>
                                        <span>Connecting to Supabase...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                                        <i className="fa-solid fa-arrow-right text-xs"></i>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
