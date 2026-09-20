import React, { useState, useEffect, useRef } from 'react';
import { getContracts, getContractById, getChatHistory, saveChatMessage } from '../lib/contractService';
import { chatWithRAG } from '../lib/aiService';

export default function AskAI({ setAppView, contractId, navigateToContract }) {
    const [contracts, setContracts] = useState([]);
    const [selectedId, setSelectedId] = useState(contractId || null);
    const [contract, setContract] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingContract, setLoadingContract] = useState(true);
    const [activeReferences, setActiveReferences] = useState(null);
    const chatEndRef = useRef(null);

    // Load available contracts
    useEffect(() => {
        async function fetchContracts() {
            try {
                const list = await getContracts();
                setContracts(list);
                if (!selectedId && list.length > 0) {
                    setSelectedId(list[0].id);
                }
            } catch (err) {
                console.error('Failed to load contracts:', err);
            }
        }
        fetchContracts();
    }, []);

    // Load contract details and previous chat history
    useEffect(() => {
        if (!selectedId) {
            setLoadingContract(false);
            return;
        }

        async function loadData() {
            setLoadingContract(true);
            try {
                const [cData, history] = await Promise.all([
                    getContractById(selectedId),
                    getChatHistory(selectedId)
                ]);
                setContract(cData);

                if (history && history.length > 0) {
                    setMessages(history.map(h => ({ role: h.role, content: h.content })));
                } else {
                    setMessages([
                        { 
                            role: 'assistant', 
                            content: `Hello! I am your Question Answering Agent for "${cData.title}". I use RAG retrieval to locate exact clauses and cite section references for every answer.` 
                        }
                    ]);
                }
            } catch (err) {
                console.error('Failed to load contract details:', err);
            } finally {
                setLoadingContract(false);
            }
        }

        loadData();
    }, [selectedId]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (customPrompt) => {
        const textToSend = customPrompt || inputValue;
        if (!textToSend.trim() || isLoading || !contract) return;

        const userMsg = { role: 'user', content: textToSend };
        const newHistory = [...messages, userMsg];
        setMessages(newHistory);
        setInputValue('');
        setIsLoading(true);

        // Save user message in database
        await saveChatMessage(contract.id, 'user', textToSend);

        try {
            const contextText = contract.extracted_text || 
                `Title: ${contract.title}\nSummary: ${contract.summary}\nPayment Terms: ${contract.payment_terms}\nRenewal: ${contract.renewal_terms}`;

            // Execute RAG Question Answering Agent
            const ragResult = await chatWithRAG(
                contextText,
                textToSend,
                messages.filter(m => m.role === 'user' || m.role === 'assistant')
            );

            const assistantMsg = {
                role: 'assistant',
                content: ragResult.answer,
                references: ragResult.retrievedChunks
            };

            setMessages([...newHistory, assistantMsg]);
            setActiveReferences(ragResult.retrievedChunks);

            // Save assistant response to Supabase
            await saveChatMessage(contract.id, 'assistant', ragResult.answer);
        } catch (error) {
            console.error("RAG Chat Error:", error);
            setMessages([
                ...newHistory, 
                { role: 'assistant', content: 'Encountered an error querying the contract: ' + (error.message || '') }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <button 
                        onClick={() => {
                            if (contract && navigateToContract) {
                                navigateToContract(contract.id);
                            } else {
                                setAppView('contracts');
                            }
                        }} 
                        className="text-xs font-semibold text-brand-600 hover:underline flex items-center gap-1 mb-1"
                    >
                        <i className="fa-solid fa-arrow-left"></i> Back to Contract
                    </button>
                    <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">AI Question Answering Agent</h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                        RAG-powered retrieval: Answers grounded in contract clauses with source section citations.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {contracts.length > 0 && (
                        <select
                            value={selectedId || ''}
                            onChange={(e) => setSelectedId(e.target.value)}
                            className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                        >
                            {contracts.map(c => (
                                <option key={c.id} value={c.id}>{c.title}</option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            {loadingContract ? (
                <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200">
                    <i className="fa-solid fa-circle-notch fa-spin text-2xl text-brand-600 mb-2"></i>
                    <p className="text-xs text-slate-500">Loading RAG index &amp; contract text...</p>
                </div>
            ) : !contract ? (
                <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
                    <i className="fa-solid fa-robot text-3xl text-slate-300 mb-2"></i>
                    <h3 className="text-sm font-bold text-slate-700">No contract selected</h3>
                    <p className="text-xs text-slate-500 mt-1">Upload a contract to start asking questions with RAG.</p>
                    <button onClick={() => setAppView('upload')} className="mt-3 text-xs bg-brand-600 text-white font-bold px-4 py-2 rounded-xl">
                        Upload Contract
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left Panel: Document Viewer & RAG Retrieved Chunks */}
                    <div className="order-2 lg:order-1 lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col h-[340px] lg:h-[600px]">
                        <div className="bg-slate-50 p-3.5 border-b border-slate-200 flex items-center justify-between text-xs text-slate-700">
                            <span className="font-bold truncate max-w-[200px]">{contract.title}</span>
                            <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full">
                                RAG Citation Panel
                            </span>
                        </div>

                        <div className="p-4 overflow-y-auto custom-scrollbar text-xs leading-relaxed space-y-3 flex-1">
                            {activeReferences && activeReferences.length > 0 ? (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-[11px] font-bold text-indigo-900 bg-indigo-50/70 p-2.5 rounded-xl border border-indigo-100">
                                        <span><i className="fa-solid fa-crosshairs text-indigo-600 mr-1"></i> Retrieved Evidence Chunks ({activeReferences.length})</span>
                                        <button onClick={() => setActiveReferences(null)} className="text-[10px] text-slate-400 hover:text-slate-700">Show Full Document</button>
                                    </div>
                                    {activeReferences.map((ref, idx) => (
                                        <div key={ref.id || idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 space-y-1">
                                            <div className="flex items-center justify-between text-[10px] font-bold text-slate-600">
                                                <span className="text-brand-700">Ref #{idx + 1} &bull; {ref.title}</span>
                                                <span className="bg-white border px-1.5 py-0.5 rounded text-[9px]">{ref.section}</span>
                                            </div>
                                            <p className="font-mono text-[11px] text-slate-600 whitespace-pre-wrap leading-relaxed bg-white p-2 rounded border border-slate-100">
                                                {ref.text}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : contract.extracted_text ? (
                                <div className="space-y-2">
                                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pb-1">Raw Extracted Contract Text</div>
                                    <div className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-slate-700 bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
                                        {contract.extracted_text}
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 bg-slate-50 rounded-xl text-slate-600 text-xs">
                                    {contract.summary || 'No text preview available.'}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Panel: AI Chat Thread with Citations */}
                    <div className="order-1 lg:order-2 lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 sm:p-5 flex flex-col h-[500px] lg:h-[600px] justify-between">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <span className="font-bold text-xs text-slate-900 flex items-center gap-2">
                                <i className="fa-solid fa-wand-magic-sparkles text-brand-600"></i> RAG Legal Q&amp;A Agent
                            </span>
                            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                                <i className="fa-solid fa-shield-check mr-1"></i> Grounded in Evidence
                            </span>
                        </div>

                        {/* Messages Thread */}
                        <div className="space-y-3 overflow-y-auto custom-scrollbar my-3 flex-1 pr-1">
                            {messages.map((msg, idx) => (
                                <div 
                                    key={idx} 
                                    className={msg.role === 'assistant' 
                                        ? "bg-slate-50 border border-slate-100 p-4 rounded-2xl text-xs text-slate-800 space-y-2" 
                                        : "bg-brand-600 text-white p-3.5 rounded-2xl text-xs space-y-1 ml-10 shadow-2xs"}
                                >
                                    <div className="font-bold text-[11px] flex items-center justify-between opacity-80">
                                        <span>{msg.role === 'assistant' ? 'ClausePilot RAG Agent' : 'You'}</span>
                                    </div>
                                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>

                                    {/* Show citation references badge if available */}
                                    {msg.references && msg.references.length > 0 && (
                                        <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center gap-1.5 text-[10px]">
                                            <span className="font-semibold text-slate-500">Source Citations:</span>
                                            {msg.references.map((ref, rIdx) => (
                                                <button
                                                    key={rIdx}
                                                    onClick={() => setActiveReferences(msg.references)}
                                                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-md font-medium transition"
                                                >
                                                    {ref.title || `Section ${ref.section}`}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                            {isLoading && (
                                <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl text-xs text-slate-600 flex gap-2 items-center w-max">
                                    <i className="fa-solid fa-circle-notch fa-spin text-brand-600"></i> 
                                    <span>Retrieving clauses &amp; verifying references...</span>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input & Suggested Prompts */}
                        <div className="pt-3 border-t border-slate-100 space-y-2">
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    placeholder="Ask any question (e.g., 'What are the liability limits?' or 'How can this be terminated?')" 
                                    className="flex-1 px-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50" 
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    disabled={isLoading}
                                />
                                <button 
                                    onClick={() => handleSend()}
                                    disabled={isLoading || !inputValue.trim()}
                                    className="bg-brand-600 text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-brand-700 transition disabled:opacity-40"
                                >
                                    <i className="fa-solid fa-paper-plane"></i>
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                                <button 
                                    onClick={() => handleSend("What are the limitation of liability terms and caps?")} 
                                    className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-2.5 py-1 rounded-md transition"
                                >
                                    Limitation of Liability
                                </button>
                                <button 
                                    onClick={() => handleSend("What are the indemnification obligations?")} 
                                    className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-2.5 py-1 rounded-md transition"
                                >
                                    Indemnification
                                </button>
                                <button 
                                    onClick={() => handleSend("What are the termination for convenience and notice periods?")} 
                                    className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-2.5 py-1 rounded-md transition"
                                >
                                    Termination &amp; Notice
                                </button>
                                <button 
                                    onClick={() => handleSend("What governing law and dispute jurisdiction apply?")} 
                                    className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-2.5 py-1 rounded-md transition"
                                >
                                    Governing Law
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
