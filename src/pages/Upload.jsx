import React, { useState, useRef } from 'react';

const CONTRACT_TYPES = [
    'SaaS & Software Agreement',
    'Non-Disclosure Agreement (NDA)',
    'Master Services Agreement (MSA)',
    'Vendor & Supply Contract',
    'Employment & Consulting Agreement',
    'Service Level Agreement (SLA)',
    'Other Business Contract'
];

const SAMPLE_DOCUMENTS = [
    { name: 'Acme_SaaS_Enterprise_Agreement.pdf', size: '2.4 MB', type: 'application/pdf', category: 'SaaS & Software Agreement' },
    { name: 'Mutual_Non_Disclosure_Agreement.docx', size: '420 KB', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', category: 'Non-Disclosure Agreement (NDA)' },
    { name: 'Global_Logistics_Supply_Contract.pdf', size: '3.1 MB', type: 'application/pdf', category: 'Vendor & Supply Contract' }
];

export default function Upload({ setAppView }) {
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

    const steps = [
        { label: 'Reading document text & OCR extraction', icon: 'fa-file-lines' },
        { label: 'Identifying parties, clauses & legal definitions', icon: 'fa-wand-magic-sparkles' },
        { label: 'Extracting key obligations, renewal terms & deadlines', icon: 'fa-list-check' },
        { label: 'Evaluating risk factors & compliance warnings', icon: 'fa-triangle-exclamation' },
        { label: 'Analysis complete & stored in vector knowledge base', icon: 'fa-circle-check' }
    ];

    const formatFileSize = (bytes) => {
        if (!bytes) return '1.2 MB';
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
        // Clean filename for contract title
        const cleanTitle = file.name
            .replace(/\.[^/.]+$/, '')
            .replace(/[_-]/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
        setContractTitle(cleanTitle);
        setUploadComplete(false);
        setProgress(0);
        setAnalysisStep(0);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            applyFile(e.dataTransfer.files[0]);
        }
    };

    const handleChooseSample = (sample) => {
        setSelectedFile({
            name: sample.name,
            size: sample.size,
            type: sample.type
        });
        const cleanTitle = sample.name
            .replace(/\.[^/.]+$/, '')
            .replace(/[_-]/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
        setContractTitle(cleanTitle);
        setContractCategory(sample.category);
        setUploadComplete(false);
        setProgress(0);
        setAnalysisStep(0);
    };

    const triggerBrowse = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const startAnalysis = () => {
        if (!selectedFile) return;
        setIsProcessing(true);
        setProgress(5);
        setAnalysisStep(0);

        let currentProgress = 5;
        let stepIdx = 0;

        const interval = setInterval(() => {
            currentProgress += Math.floor(Math.random() * 12) + 8;
            if (currentProgress > 95) currentProgress = 95;
            setProgress(currentProgress);

            if (currentProgress > 25 && stepIdx === 0) {
                stepIdx = 1;
                setAnalysisStep(1);
            } else if (currentProgress > 50 && stepIdx === 1) {
                stepIdx = 2;
                setAnalysisStep(2);
            } else if (currentProgress > 75 && stepIdx === 2) {
                stepIdx = 3;
                setAnalysisStep(3);
            }

            if (currentProgress >= 95) {
                clearInterval(interval);
                setTimeout(() => {
                    setProgress(100);
                    setAnalysisStep(4);
                    setIsProcessing(false);
                    setUploadComplete(true);
                }, 600);
            }
        }, 300);
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
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.docx,.doc,.txt"
                className="hidden"
            />

            {!selectedFile ? (
                /* Empty / Dropzone State */
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
                            <span className="flex items-center gap-1.5">
                                <i className="fa-solid fa-file-pdf text-rose-400"></i> PDF
                            </span>
                            <span>&bull;</span>
                            <span className="flex items-center gap-1.5">
                                <i className="fa-solid fa-file-word text-blue-500"></i> DOCX / DOC
                            </span>
                            <span>&bull;</span>
                            <span className="flex items-center gap-1.5">
                                <i className="fa-solid fa-file-lines text-slate-400"></i> TXT
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                triggerBrowse();
                            }}
                            className="mt-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-lg shadow-brand-500/25 flex items-center gap-2 transition"
                        >
                            <i className="fa-solid fa-arrow-up-from-bracket"></i> Select Document from Computer
                        </button>
                    </div>

                    {/* Quick Demo Samples */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <i className="fa-solid fa-bolt text-amber-500 text-xs"></i>
                                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                                    Or Try a Pre-Loaded Sample Contract
                                </h3>
                            </div>
                            <span className="text-[11px] text-slate-400">Quick 1-click test</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {SAMPLE_DOCUMENTS.map((doc, idx) => {
                                const style = getFileIcon(doc.name);
                                return (
                                    <div
                                        key={idx}
                                        onClick={() => handleChooseSample(doc)}
                                        className="p-3.5 rounded-xl border border-slate-200/80 hover:border-brand-400 hover:bg-brand-50/30 transition cursor-pointer flex items-center gap-3 group"
                                    >
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0 ${style.color}`}>
                                            <i className={style.icon}></i>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs font-bold text-slate-800 truncate group-hover:text-brand-600">
                                                {doc.name}
                                            </p>
                                            <p className="text-[10px] text-slate-400 mt-0.5">{doc.size} &bull; {doc.category}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            ) : (
                /* Document Selected / Processing State */
                <div className="space-y-6">
                    {/* Selected File Card */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-5">
                        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
                            <div className="flex items-center gap-3.5">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-xs ${getFileIcon(selectedFile.name).color}`}>
                                    <i className={getFileIcon(selectedFile.name).icon}></i>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-base font-bold text-slate-900">{selectedFile.name}</h2>
                                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                            Ready for AI
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        Size: {formatFileSize(selectedFile.size)} &bull; Type: {selectedFile.type || 'Document'}
                                    </p>
                                </div>
                            </div>

                            {!isProcessing && !uploadComplete && (
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={triggerBrowse}
                                        className="text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition"
                                    >
                                        Change File
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedFile(null)}
                                        className="text-xs font-semibold text-rose-600 hover:text-rose-800 p-1.5 rounded-lg hover:bg-rose-50 transition"
                                    >
                                        <i className="fa-solid fa-xmark"></i>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Metadata inputs */}
                        {!uploadComplete && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                        Contract Display Title
                                    </label>
                                    <input
                                        type="text"
                                        value={contractTitle}
                                        onChange={(e) => setContractTitle(e.target.value)}
                                        disabled={isProcessing}
                                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50 disabled:opacity-60 font-semibold text-slate-800"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                        Contract Classification
                                    </label>
                                    <select
                                        value={contractCategory}
                                        onChange={(e) => setContractCategory(e.target.value)}
                                        disabled={isProcessing}
                                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50 disabled:opacity-60 font-semibold text-slate-800"
                                    >
                                        {CONTRACT_TYPES.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                        Priority Level
                                    </label>
                                    <select
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value)}
                                        disabled={isProcessing}
                                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50 disabled:opacity-60 font-semibold text-slate-800"
                                    >
                                        <option value="Normal">Normal Review</option>
                                        <option value="High">High Urgency</option>
                                        <option value="Critical">Critical Compliance</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* Processing & Progress Section */}
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
                                    <div
                                        className="h-full bg-gradient-to-r from-brand-600 to-brand-400 rounded-full transition-all duration-300 shadow-sm"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>

                                {/* Step checklist */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                                    {steps.slice(0, 4).map((step, idx) => {
                                        const isDone = analysisStep > idx;
                                        const isCurrent = analysisStep === idx;
                                        return (
                                            <div
                                                key={idx}
                                                className={`text-xs p-2.5 rounded-xl border flex items-center gap-2.5 transition ${
                                                    isDone
                                                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800 font-medium'
                                                        : isCurrent
                                                        ? 'bg-brand-50/70 border-brand-200 text-brand-800 font-bold'
                                                        : 'bg-slate-50/50 border-slate-100 text-slate-400'
                                                }`}
                                            >
                                                {isDone ? (
                                                    <i className="fa-solid fa-circle-check text-emerald-600"></i>
                                                ) : isCurrent ? (
                                                    <i className="fa-solid fa-spinner fa-spin text-brand-600"></i>
                                                ) : (
                                                    <i className="fa-regular fa-circle text-slate-300"></i>
                                                )}
                                                <span className="truncate">{step.label}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Completed State */}
                        {uploadComplete && (
                            <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-lg shadow-sm">
                                        <i className="fa-solid fa-circle-check"></i>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-emerald-900">
                                            Contract Successfully Analyzed &amp; Ingested!
                                        </h3>
                                        <p className="text-xs text-emerald-700 mt-0.5">
                                            Extracted 8 obligations, 4 renewal deadlines, and 2 high-risk clauses.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-3 pt-1">
                                    <button
                                        onClick={() => setAppView('contract-details')}
                                        className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-brand-500/20 flex items-center gap-2 transition"
                                    >
                                        <i className="fa-solid fa-eye"></i> Open Document Viewer &amp; AI Clauses
                                    </button>
                                    <button
                                        onClick={() => setAppView('obligations')}
                                        className="bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-2 transition"
                                    >
                                        <i className="fa-solid fa-list-check"></i> View Extracted Obligations
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedFile(null);
                                            setUploadComplete(false);
                                        }}
                                        className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-2 transition"
                                    >
                                        Upload Another
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Action buttons when file chosen and not yet processing */}
                        {!isProcessing && !uploadComplete && (
                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setSelectedFile(null)}
                                    className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={startAnalysis}
                                    className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-lg shadow-brand-500/25 flex items-center gap-2 transition transform hover:-translate-y-0.5"
                                >
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
