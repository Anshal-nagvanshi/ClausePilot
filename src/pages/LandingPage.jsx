import React from 'react';

export default function LandingPage({ setMainPage, setAppView }) {
    return (
        <div className="flex-1 overflow-y-auto bg-slate-50">
            <nav className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
                            <i className="fa-solid fa-file-contract text-xl"></i>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold font-heading text-slate-900 tracking-tight leading-tight">Clause<span className="text-brand-600">Pilot</span></span>
                            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Smarter Contracts &bull; Safer Business</span>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
                        <a href="#features" className="hover:text-brand-600 transition">Features</a>
                        <a href="#how-it-works" className="hover:text-brand-600 transition">How It Works</a>
                        <a href="#pricing" className="hover:text-brand-600 transition">Pricing</a>
                        <a href="#testimonials" className="hover:text-brand-600 transition">Testimonials</a>
                    </div>

                    <div className="flex items-center gap-3">
                        <button onClick={() => setMainPage('login')} className="text-sm font-semibold text-slate-700 hover:text-brand-600 px-4 py-2 rounded-xl transition border border-slate-200 hover:border-slate-300 bg-white">
                            Sign In
                        </button>
                        <button onClick={() => setAppView('dashboard')} className="text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 px-5 py-2.5 rounded-xl shadow-lg shadow-brand-500/25 transition">
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 overflow-hidden bg-gradient-to-b from-blue-50/60 via-slate-50 to-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-6 space-y-6">
                            <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-200 text-brand-700 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide">
                                <i className="fa-solid fa-sparkles text-brand-500"></i> AI-Powered Contract Intelligence
                            </div>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-slate-900 tracking-tight leading-[1.15]">
                                Understand Your Contracts with <span className="text-brand-600 underline decoration-brand-200 underline-offset-8">Clarity</span>
                            </h1>
                            <p className="text-slate-600 text-lg leading-relaxed max-w-xl">
                                Upload, analyze, and track your business contracts with AI. Extract key information, identify obligations, track deadlines, and get instant answers &mdash; all in one place.
                            </p>

                            <div className="flex flex-wrap items-center gap-4 pt-2">
                                <button onClick={() => setAppView('dashboard')} className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3.5 rounded-xl shadow-xl shadow-brand-500/30 flex items-center gap-2 transition transform hover:-translate-y-0.5">
                                    Get Started <i className="fa-solid fa-arrow-right text-xs"></i>
                                </button>
                                <button onClick={() => setAppView('contract-details')} className="bg-white hover:bg-slate-100 text-slate-800 font-semibold px-6 py-3.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2 transition">
                                    <i className="fa-regular fa-circle-play text-brand-600 text-lg"></i> Watch Demo
                                </button>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-200/80">
                                <div>
                                    <div className="text-2xl font-black text-slate-900 font-heading">80%</div>
                                    <div className="text-xs text-slate-500 font-medium">Faster Review Time</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-slate-900 font-heading">3x</div>
                                    <div className="text-xs text-slate-500 font-medium">Obligation Tracking</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-slate-900 font-heading">99%</div>
                                    <div className="text-xs text-slate-500 font-medium">Extraction Accuracy</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-slate-900 font-heading">500+</div>
                                    <div className="text-xs text-slate-500 font-medium">Contracts Analyzed</div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-6 relative">
                            <div className="relative mx-auto rounded-2xl bg-white p-4 shadow-2xl border border-slate-200/80 transform hover:scale-[1.01] transition duration-300">
                                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4 px-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                                        <span className="text-xs text-slate-400 font-medium ml-2">app.clausepilot.com</span>
                                    </div>
                                    <div className="text-xs text-slate-400 font-medium">Mon, Sep 15, 2026</div>
                                </div>

                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-base font-bold text-slate-900">Welcome back, John! 👋</h3>
                                            <p className="text-xs text-slate-500">Here's what's happening with your contracts today.</p>
                                        </div>
                                        <span className="bg-brand-100 text-brand-700 px-2.5 py-1 rounded-full text-xs font-bold">Pro Account</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-white p-3 rounded-lg border border-slate-200/80 shadow-2xs">
                                            <div className="text-[11px] text-slate-500 font-semibold">Total Contracts</div>
                                            <div className="text-xl font-bold text-slate-900">24</div>
                                        </div>
                                        <div className="bg-white p-3 rounded-lg border border-slate-200/80 shadow-2xs">
                                            <div className="text-[11px] text-slate-500 font-semibold">Open Obligations</div>
                                            <div className="text-xl font-bold text-slate-900">12</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
