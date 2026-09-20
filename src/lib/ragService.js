/**
 * ClausePilot RAG (Retrieval-Augmented Generation) Service
 * Implements Step 3-6 of the ClausePilot AI Guide:
 * 1. Semantic Legal Chunking (Clause & Section boundary preservation)
 * 2. Relevance Scoring & Retrieval
 * 3. Clause Citation & Reference Generation (CUAD & ContractNLI aligned)
 */

/**
 * Splits contract text into semantic legal chunks by sections, articles, and numbered clauses.
 */
export function chunkContractText(fullText, maxChunkLength = 1200) {
    if (!fullText || typeof fullText !== 'string') return [];

    // Split by common legal headings: Article, Section, numbered headings like "1.", "1.1", "Clause"
    const lines = fullText.split('\n');
    const chunks = [];
    let currentChunk = [];
    let currentTitle = 'Introduction / Preamble';
    let currentSection = 'Preamble';
    let charCount = 0;
    let chunkIndex = 1;

    // Regex for legal section headers
    const sectionHeaderRegex = /^(?:(?:ARTICLE|SECTION|CLAUSE)\s+([0-9A-ZIVX\.]+)|([0-9]+\.[0-9]*|[0-9]+)\s+([A-Z\s]{3,}))/i;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const match = line.match(sectionHeaderRegex);
        if (match && currentChunk.length > 0 && charCount > 250) {
            // Flush current chunk
            chunks.push({
                id: `chunk-${chunkIndex++}`,
                section: currentSection,
                title: currentTitle,
                text: currentChunk.join('\n'),
                length: charCount
            });

            currentChunk = [line];
            currentSection = match[1] || match[2] || `Section ${chunkIndex}`;
            currentTitle = line.length < 80 ? line : line.slice(0, 77) + '...';
            charCount = line.length;
        } else {
            currentChunk.push(line);
            charCount += line.length;

            // If chunk becomes too large without explicit heading, split smoothly at paragraph
            if (charCount >= maxChunkLength) {
                chunks.push({
                    id: `chunk-${chunkIndex++}`,
                    section: currentSection,
                    title: currentTitle,
                    text: currentChunk.join('\n'),
                    length: charCount
                });
                currentChunk = [];
                charCount = 0;
                currentTitle = `${currentSection} (Cont.)`;
            }
        }
    }

    if (currentChunk.length > 0) {
        chunks.push({
            id: `chunk-${chunkIndex++}`,
            section: currentSection,
            title: currentTitle,
            text: currentChunk.join('\n'),
            length: charCount
        });
    }

    return chunks;
}

/**
 * Tokenizes text and removes common stopwords for retrieval scoring
 */
function tokenize(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 2 && !STOPWORDS.has(w));
}

const STOPWORDS = new Set([
    'the', 'and', 'for', 'that', 'this', 'with', 'from', 'have', 'are', 'which',
    'been', 'were', 'will', 'shall', 'such', 'upon', 'under', 'herein', 'thereto'
]);

// Common CUAD (Contract Understanding Atticus Dataset) category keywords for semantic boost
const CUAD_KEYWORDS = {
    payment: ['payment', 'invoice', 'fee', 'price', 'compensation', 'billing', 'currency', 'tax', 'net', 'days'],
    termination: ['termination', 'terminate', 'cancel', 'expiration', 'convenience', 'breach', 'notice', 'cure'],
    liability: ['liability', 'indemnification', 'indemnify', 'hold harmless', 'damages', 'limitation', 'cap', 'consequential'],
    renewal: ['renewal', 'renew', 'term', 'extension', 'automatic', 'notice period'],
    confidentiality: ['confidential', 'proprietary', 'trade secret', 'disclosure', 'nda'],
    ip: ['intellectual property', 'patent', 'copyright', 'trademark', 'ownership', 'license', 'work for hire'],
    governing_law: ['governing law', 'jurisdiction', 'court', 'dispute', 'arbitration', 'venue', 'state of']
};

/**
 * Retrieves top-k most relevant contract chunks for a user query.
 * Aligns with Steps 5-6 in the ClausePilot AI Guide.
 */
export function retrieveRelevantChunks(contractText, query, topK = 4) {
    const chunks = chunkContractText(contractText);
    if (chunks.length === 0) return [];
    if (chunks.length <= topK) return chunks;

    const queryTokens = tokenize(query);
    const queryLower = query.toLowerCase();

    // Score each chunk
    const scoredChunks = chunks.map(chunk => {
        const chunkTokens = tokenize(chunk.text);
        const chunkLower = chunk.text.toLowerCase();
        let score = 0;

        // Keyword overlap score
        queryTokens.forEach(qt => {
            const occurrences = (chunkLower.match(new RegExp(`\\b${qt}\\b`, 'g')) || []).length;
            score += occurrences * 3;
        });

        // Exact phrase boost
        if (chunkLower.includes(queryLower)) {
            score += 15;
        }

        // Section header relevance boost
        queryTokens.forEach(qt => {
            if (chunk.title.toLowerCase().includes(qt)) {
                score += 8;
            }
        });

        // CUAD semantic expansion boost
        for (const [category, keywords] of Object.entries(CUAD_KEYWORDS)) {
            const queryMatchesCategory = keywords.some(kw => queryLower.includes(kw));
            if (queryMatchesCategory) {
                const categoryHits = keywords.filter(kw => chunkLower.includes(kw)).length;
                score += categoryHits * 2;
            }
        }

        return { ...chunk, score };
    });

    // Sort by score descending
    scoredChunks.sort((a, b) => b.score - a.score);

    // Return topK chunks (fallback to first chunks if all score 0)
    const top = scoredChunks.slice(0, topK);
    const hasScores = top.some(c => c.score > 0);
    return hasScores ? top : chunks.slice(0, topK);
}

/**
 * Formats retrieved chunks into a prompt context with explicit section citations.
 */
export function buildRAGPromptContext(retrievedChunks) {
    if (!retrievedChunks || retrievedChunks.length === 0) return 'No relevant clauses retrieved.';

    return retrievedChunks.map((chunk, i) => {
        return `[Source Reference #${i + 1} | Section: ${chunk.section} | Title: "${chunk.title}"]:\n${chunk.text}\n`;
    }).join('\n----------------------------------------\n');
}
