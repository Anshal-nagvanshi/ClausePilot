import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Set worker source for pdfjs
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;

export async function extractTextFromFile(file) {
    if (!file) return '';

    const fileType = file.name.split('.').pop().toLowerCase();

    if (fileType === 'pdf') {
        return await extractFromPDF(file);
    } else if (fileType === 'docx' || fileType === 'doc') {
        return await extractFromDocx(file);
    } else if (fileType === 'txt') {
        return await file.text();
    } else {
        throw new Error('Unsupported file type');
    }
}

async function extractFromPDF(file) {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const strings = content.items.map(item => item.str);
            text += strings.join(' ') + '\n';
        }
        return text;
    } catch (e) {
        console.error("PDF parsing error:", e);
        throw new Error("Failed to parse PDF document.");
    }
}

async function extractFromDocx(file) {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        return result.value;
    } catch (e) {
        console.error("DOCX parsing error:", e);
        throw new Error("Failed to parse DOCX document.");
    }
}
