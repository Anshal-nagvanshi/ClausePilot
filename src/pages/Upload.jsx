import React, { useState } from 'react';

export default function Upload({ setAppView }) {
    const [progress, setProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    const simulateUploadProcess = () => {
        setIsUploading(true);
        let currProgress = 10;
        setProgress(currProgress);

        const interval = setInterval(() => {
            currProgress += 15;
            if (currProgress > 100) currProgress = 100;
            setProgress(currProgress);

            if (currProgress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    setAppView('contract-details');
                }, 600);
            }
        }, 250);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center">
                <h1 className="text-2xl font-bold font-heading text-slate-900">Upload Contract Document</h1>
                <p className="text-xs text-slate-500 mt-1">Upload PDF, DOCX, or TXT files to extract obligations, clauses, and timelines automatically.</p>
            </div>

            <div onClick={simulateUploadProcess} className="border-2 border-dashed border-brand-300 hover:border-brand-500 bg-white p-10 rounded-2xl text-center cursor-pointer transition space-y-4 shadow-2xs">
                <div className="w-16 h-16 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto text-2xl">
                    <i className="fa-solid fa-cloud-arrow-up"></i>
                </div>
                <div>
                    <p className="text-sm font-bold text-slate-800">Drag and drop your contract here, or <span className="text-brand-600 underline">browse</span></p>
                    <p className="text-xs text-slate-400 mt-1">Supports PDF, DOCX, TXT up to 25MB</p>
                </div>
            </div>

            {isUploading && (
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                        <span>Analyzing Document: Acme_Services_Agreement.pdf</span>
                        <span className="text-brand-600">{progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-600 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
            )}
        </div>
    );
}
