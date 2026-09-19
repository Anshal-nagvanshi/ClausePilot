import React from 'react';

export default function AskAI({ setAppView }) {
    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <button onClick={() => setAppView('contract-details')} className="text-xs font-semibold text-brand-600 hover:underline flex items-center gap-1 mb-1">
                        <i className="fa-solid fa-arrow-left"></i> Back to Contract
                    </button>
                    <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">AI Contract Assistant</h1>
                    <p className="text-xs text-slate-500 mt-0.5">Ask questions, get instant answers, and extract key insights using AI.</p>
                </div>
            </div>

            <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold text-slate-500">
                <button className="pb-2 border-b-2 border-brand-600 text-brand-600 font-bold flex items-center gap-1.5"><i className="fa-regular fa-comments"></i> Chat</button>
                <button className="pb-2 hover:text-slate-900 flex items-center gap-1.5"><i className="fa-regular fa-lightbulb"></i> Key Insights</button>
                <button className="pb-2 hover:text-slate-900 flex items-center gap-1.5"><i className="fa-regular fa-file-lines"></i> Clause Analysis</button>
                <button className="pb-2 hover:text-slate-900 flex items-center gap-1.5"><i className="fa-solid fa-triangle-exclamation"></i> Risks &amp; Issues</button>
                <button className="pb-2 hover:text-slate-900 flex items-center gap-1.5"><i className="fa-solid fa-list"></i> Summary</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col h-[550px]">
                    <div className="bg-slate-50 p-3 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
                        <span className="font-semibold">Document Viewer (5 / 12)</span>
                        <div className="flex items-center gap-2">
                            <button className="p-1 hover:text-slate-900"><i className="fa-solid fa-minus"></i></button>
                            <span>100%</span>
                            <button className="p-1 hover:text-slate-900"><i className="fa-solid fa-plus"></i></button>
                        </div>
                    </div>
                    <div className="p-6 overflow-y-auto custom-scrollbar font-serif text-xs leading-relaxed text-slate-800 space-y-4">
                        <h3 className="font-bold font-sans text-xs uppercase tracking-wider text-slate-900">3. PAYMENT TERMS</h3>
                        <p className="bg-amber-100/80 p-2 rounded border border-amber-200">Customer shall pay the Service Provider a monthly fee of $10,000 within thirty (30) days of the invoice date.</p>

                        <h3 className="font-bold font-sans text-xs uppercase tracking-wider text-slate-900 pt-2">4. TERM AND RENEWAL</h3>
                        <p className="bg-emerald-100/80 p-2 rounded border border-emerald-200">This Agreement shall automatically renew for successive one-year terms unless either party provides thirty (30) days written notice of non-renewal.</p>

                        <h3 className="font-bold font-sans text-xs uppercase tracking-wider text-slate-900 pt-2">5. TERMINATION</h3>
                        <p className="bg-rose-100/80 p-2 rounded border border-rose-200">Either party may terminate this Agreement for cause with thirty (30) days written notice if the other party materially breaches any term of this Agreement.</p>
                    </div>
                </div>

                <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 flex flex-col h-[550px] justify-between">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <span className="font-bold text-xs text-slate-900 flex items-center gap-2"><i className="fa-solid fa-wand-magic-sparkles text-brand-600"></i> AI Assistant</span>
                        <span className="bg-brand-50 text-brand-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Powered by GPT-4</span>
                    </div>

                    <div className="space-y-3 overflow-y-auto custom-scrollbar my-3 flex-1">
                        <div className="bg-blue-50 p-3 rounded-2xl text-xs text-slate-800 space-y-1">
                            <div className="font-bold text-brand-700 flex items-center justify-between">
                                <span>AI Assistant:</span>
                                <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-blue-200">Source: Section 3 (Page 5)</span>
                            </div>
                            <p>The contract states that the customer must pay the service provider a monthly fee of $10,000 within thirty (30) days of the invoice date.</p>
                        </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 space-y-2">
                        <div className="flex gap-2">
                            <input type="text" placeholder="Ask a question about this contract..." className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50" />
                            <button className="bg-brand-600 text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-brand-700 transition"><i className="fa-solid fa-paper-plane"></i></button>
                        </div>
                        <div className="flex flex-wrap gap-1">
                            <button className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium px-2 py-1 rounded-md">Summarize this contract</button>
                            <button className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium px-2 py-1 rounded-md">Show key dates</button>
                            <button className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium px-2 py-1 rounded-md">Find risks</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
