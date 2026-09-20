import React, { useState, useRef } from 'react';
import { extractContractMetadata } from '../lib/aiService';
import { extractTextFromFile } from '../lib/documentParser';
import { createContract, createObligations, createRisks, logActivity } from '../lib/contractService';
import { uploadContractFile } from '../lib/storageService';

const CONTRACT_TYPES = [
    'SaaS & Software Agreement',
    'Non-Disclosure Agreement (NDA)',
    'Master Services Agreement (MSA)',
    'Vendor & Supply Contract',
    'Employment & Consulting Agreement',
    'Service Level Agreement (SLA)',
    'Other Business Contract'
];

export default function Upload({ setAppView, user, refreshContracts, navigateToContract }) {
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [contractTitle, setContractTitle] = useState('');
    const [contractCategory, setContractCategory] = useState(CONTRACT_TYPES[0]);
    const [priority, setPriority] = useState('Normal');
    const [isProcessing, setIsProcessing] = useState(false);
    const [analysisStep, setAnalysisStep] = useState(0);
    const [progress, setProgress] = useState(0);
    const [uploadComplete, setUploadComplete] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [createdContractId, setCreatedContractId] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    const steps = [
        { label: 'Reading document text & OCR extraction', icon: 'fa-file-lines' },
        { label: 'Identifying parties, clauses & legal definitions', icon: 'fa-wand-magic-sparkles' },
        { label: 'Extracting key obligations, renewal terms & deadlines', icon: 'fa-list-check' },
        { label: 'Saving to database & generating risk analysis', icon: 'fa-triangle-exclamation' },
        { label: 'Analysis complete & stored in database', icon: 'fa-circle-check' }
    ];

    const formatFileSize = (bytes) => {
        if (!bytes) return '—';
        if (typeof bytes === 'string') return bytes;
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            applyFile(e.target.files[0]);
        }
    };

    const applyFile = (file) => {
        setSelectedFile(file);
        const cleanTitle = file.name
            .replace(/\.[^/.]+$/, '')
            .replace(/[_-]/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
        setContractTitle(cleanTitle);
        setUploadComplete(false);
        setProgress(0);
        setAnalysisStep(0);
        setAnalysisResult(null);
        setCreatedContractId(null);
        setErrorMsg('');
    };

    const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            applyFile(e.dataTransfer.files[0]);
        }
    };

    const triggerBrowse = () => { if (fileInputRef.current) fileInputRef.current.click(); };

    const startAnalysis = async () => {
        if (!selectedFile) return;
        setIsProcessing(true);
        setProgress(5);
        setAnalysisStep(0);
        setErrorMsg('');

        try {
            // Step 1: Extract text
            setAnalysisStep(0);
            setProgress(15);
            let text = '';
            if (selectedFile instanceof File) {
                text = await extractTextFromFile(selectedFile);
            } else {
                text = "This is a sample contract. No real text available for this demo file.";
            }

            // Step 2: Upload file to Supabase Storage
            setAnalysisStep(1);
            setProgress(30);
            let fileUrl = '';
            if (selectedFile instanceof File) {
                try {
                    const uploadResult = await uploadContractFile(selectedFile);
                    fileUrl = uploadResult.url;
                } catch (uploadErr) {
                    console.warn('File upload to storage failed (continuing):', uploadErr.message);
                }
            }

            // Step 3: AI Extraction
            setAnalysisStep(2);
            setProgress(50);
            const metadata = await extractContractMetadata(text);
            console.log("AI Extracted Metadata:", metadata);

            // Step 4: Save to Supabase
            setAnalysisStep(3);
            setProgress(75);

            const contractRecord = await createContract({
                title: contractTitle || metadata.summary?.slice(0, 60) || 'Untitled Contract',
                file_name: selectedFile.name,
                file_url: fileUrl,
                file_size: typeof selectedFile.size === 'number' ? formatFileSize(selectedFile.size) : (selectedFile.size || ''),
                file_type: selectedFile.type || '',
                raw_text: text,
                category: contractCategory,
                priority: priority,
                status: 'Active',
                summary: metadata.summary || '',
                contract_type: metadata.contractType || contractCategory,
                parties: metadata.parties || [],
                effective_date: metadata.effectiveDate || 'Not specified',
                expiration_date: metadata.expirationDate || 'Not specified',
                renewal_terms: metadata.renewalTerms || 'Not specified',
                payment_terms: metadata.paymentTerms || 'Not specified'
            });

            // Save obligations
            let savedObligations = [];
            if (metadata.obligations && metadata.obligations.length > 0) {
                savedObligations = await createObligations(contractRecord.id, metadata.obligations);
            }

            // Save risks
            let savedRisks = [];
            if (metadata.risks && metadata.risks.length > 0) {
                savedRisks = await createRisks(contractRecord.id, metadata.risks);
            }

            // Log activity
            await logActivity('ai_analysis_complete', `AI extracted ${savedObligations.length} obligations and ${savedRisks.length} risks`, contractRecord.id);

            setAnalysisResult({
                ...metadata,
                obligationsCount: savedObligations.length,
                risksCount: savedRisks.length
            });
            setCreatedContractId(contractRecord.id);

            // Step 5: Done
            setProgress(100);
            setAnalysisStep(4);
            setIsProcessing(false);
            setUploadComplete(true);

            if (refreshContracts) refreshContracts();

        } catch (error) {
            console.error("Analysis Failed:", error);
            setIsProcessing(false);
            setErrorMsg(error.message || 'Failed to analyze the document.');
        }
    };

    const getFileIcon = (filename = '') => {
        const lower = filename.toLowerCase();
        if (lower.endsWith('.pdf')) return { icon: 'fa-solid fa-file-pdf', color: 'text-rose-500 bg-rose-50' };
        if (lower.endsWith('.docx') || lower.endsWith('.doc')) return { icon: 'fa-solid fa-file-word', color: 'text-blue-600 bg-blue-50' };
        return { icon: 'fa-solid fa-file-lines', color: 'text-emerald-600 bg-emerald-50' };
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
                <div>
                    <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight flex items-center gap-2.5">
                        <i className="fa-solid fa-cloud-arrow-up text-brand-600"></i> Upload Contract Document
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                        Upload your business contracts in PDF, DOCX, or TXT. AI will extract clauses, obligations, and key dates.
                    </p>
                </div>
                <button
                    onClick={() => setAppView('contracts')}
                    className="self-start sm:self-auto text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-2xs hover:bg-slate-50 flex items-center gap-1.5 transition"
                >
                    <i className="fa-solid fa-folder-closed"></i> View All Contracts
                </button>
            </div>

            {/* Hidden native file input */}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.docx,.doc,.txt" className="hidden" />

            {errorMsg && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-start gap-2">
                    <i className="fa-solid fa-circle-exclamation mt-0.5"></i>
                    <div>
                        <div className="font-bold">Analysis Error</div>
                        <p>{errorMsg}</p>
                    </div>
                </div>
            )}

            {!selectedFile ? (
                <div className="space-y-6">
                    <div
                        onClick={triggerBrowse}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-3xl p-10 lg:p-14 text-center cursor-pointer transition-all duration-200 bg-white shadow-2xs flex flex-col items-center justify-center gap-4 ${
                            isDragging
                                ? 'border-brand-600 bg-brand-50/50 scale-[1.01]'
                                : 'border-slate-300 hover:border-brand-500 hover:bg-slate-50/70'
                        }`}
                    >
                        <div className="w-20 h-20 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center text-3xl shadow-sm border border-brand-100/60">
                            <i className="fa-solid fa-cloud-arrow-up"></i>
                        </div>
                        <div className="max-w-md space-y-1">
                            <p className="text-base font-bold text-slate-900">
                                Drag & drop your contract file here, or{' '}
                                <span className="text-brand-600 underline font-extrabold">browse files</span>
                            </p>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Choose any contract document from your computer. Supports PDF, DOCX, DOC, or TXT up to 25MB.
                            </p>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
                            <span className="flex items-center gap-1.5"><i className="fa-solid fa-file-pdf text-rose-400"></i> PDF</span>
                            <span>&bull;</span>
                            <span className="flex items-center gap-1.5"><i className="fa-solid fa-file-word text-blue-500"></i> DOCX / DOC</span>
                            <span>&bull;</span>
                            <span className="flex items-center gap-1.5"><i className="fa-solid fa-file-lines text-slate-400"></i> TXT</span>
                        </div>
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); triggerBrowse(); }}
                            className="mt-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-lg shadow-brand-500/25 flex items-center gap-2 transition"
                        >
                            <i className="fa-solid fa-arrow-up-from-bracket"></i> Select Document from Computer
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-5">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                            <div className="flex items-center gap-3.5 min-w-0">
                                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-xl sm:text-2xl shadow-xs flex-shrink-0 ${getFileIcon(selectedFile.name).color}`}>
                                    <i className={getFileIcon(selectedFile.name).icon}></i>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate max-w-[220px] sm:max-w-md" title={selectedFile.name}>{selectedFile.name}</h2>
                                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                                            Ready for AI
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        Size: {formatFileSize(selectedFile.size)} &bull; Type: {selectedFile.type || 'Document'}
                                    </p>
                                </div>
                            </div>
                            {!isProcessing && !uploadComplete && (
                                <div className="flex items-center justify-end gap-2 flex-shrink-0">
                                    <button type="button" onClick={triggerBrowse} className="text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition">Change File</button>
                                    <button type="button" onClick={() => setSelectedFile(null)} className="text-xs font-semibold text-rose-600 hover:text-rose-800 p-1.5 rounded-lg hover:bg-rose-50 transition" aria-label="Remove file"><i className="fa-solid fa-xmark"></i></button>
                                </div>
                            )}
                        </div>

                        {!uploadComplete && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Contract Display Title</label>
                                    <input type="text" value={contractTitle} onChange={(e) => setContractTitle(e.target.value)} disabled={isProcessing}
                                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50 disabled:opacity-60 font-semibold text-slate-800" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Contract Classification</label>
                                    <select value={contractCategory} onChange={(e) => setContractCategory(e.target.value)} disabled={isProcessing}
                                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50 disabled:opacity-60 font-semibold text-slate-800">
                                        {CONTRACT_TYPES.map(type => (<option key={type} value={type}>{type}</option>))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Priority Level</label>
                                    <select value={priority} onChange={(e) => setPriority(e.target.value)} disabled={isProcessing}
                                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50 disabled:opacity-60 font-semibold text-slate-800">
                                        <option value="Normal">Normal Review</option>
                                        <option value="High">High Urgency</option>
                                        <option value="Critical">Critical Compliance</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {isProcessing && (
                            <div className="space-y-4 pt-3">
                                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                                    <span className="flex items-center gap-2">
                                        <i className="fa-solid fa-gear fa-spin text-brand-600"></i>
                                        {steps[analysisStep]?.label || 'Analyzing document...'}
                                    </span>
                                    <span className="text-brand-600 font-mono text-sm">{progress}%</span>
                                </div>
                                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
                                    <div className="h-full bg-gradient-to-r from-brand-600 to-brand-400 rounded-full transition-all duration-300 shadow-sm" style={{ width: `${progress}%` }}></div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                                    {steps.slice(0, 4).map((step, idx) => {
                                        const isDone = analysisStep > idx;
                                        const isCurrent = analysisStep === idx;
                                        return (
                                            <div key={idx} className={`text-xs p-2.5 rounded-xl border flex items-center gap-2.5 transition ${isDone ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800 font-medium' : isCurrent ? 'bg-brand-50/70 border-brand-200 text-brand-800 font-bold' : 'bg-slate-50/50 border-slate-100 text-slate-400'}`}>
                                                {isDone ? <i className="fa-solid fa-circle-check text-emerald-600"></i> : isCurrent ? <i className="fa-solid fa-spinner fa-spin text-brand-600"></i> : <i className="fa-regular fa-circle text-slate-300"></i>}
                                                <span className="truncate">{step.label}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {uploadComplete && analysisResult && (
                            <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-lg shadow-sm">
                                        <i className="fa-solid fa-circle-check"></i>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-emerald-900">Contract Successfully Analyzed & Saved!</h3>
                                        <p className="text-xs text-emerald-700 mt-0.5">
                                            Extracted {analysisResult.obligationsCount || 0} obligations and {analysisResult.risksCount || 0} risk items.
                                            {analysisResult.parties && analysisResult.parties.length > 0 && ` Parties: ${analysisResult.parties.join(', ')}.`}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-3 pt-1">
                                    <button onClick={() => { if (createdContractId) navigateToContract(createdContractId); else setAppView('contract-details'); }}
                                        className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-brand-500/20 flex items-center gap-2 transition">
                                        <i className="fa-solid fa-eye"></i> Open Document Viewer & AI Clauses
                                    </button>
                                    <button onClick={() => { setSelectedFile(null); setUploadComplete(false); setAnalysisResult(null); }}
                                        className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-2 transition">
                                        Upload Another
                                    </button>
                                </div>
                            </div>
                        )}

                        {!isProcessing && !uploadComplete && (
                            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setSelectedFile(null)} className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition text-center">Cancel</button>
                                <button type="button" onClick={startAnalysis}
                                    className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition transform hover:-translate-y-0.5">
                                    <i className="fa-solid fa-wand-magic-sparkles"></i> Start AI Extraction &amp; Analysis
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
