import { retrieveRelevantChunks, buildRAGPromptContext } from './ragService.js';

const GROQ_API_KEY = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GROQ_API_KEY) || (typeof process !== 'undefined' && process.env?.VITE_GROQ_API_KEY);
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Supported active Groq models with automatic fallback
const PRIMARY_MODEL = 'openai/gpt-oss-120b';
const FALLBACK_MODELS = ['qwen/qwen3.8-27b', 'groq/compound'];

/**
 * Robust Groq API request runner with multi-model fallback.
 * Ensures that if a model is decommissioned or unavailable,
 * requests smoothly fall back to the next available active model.
 */
async function callGroqChat(payload) {
    if (!GROQ_API_KEY) {
        throw new Error('Groq API Key is not configured in .env');
    }

    const candidateModels = [PRIMARY_MODEL, ...FALLBACK_MODELS];
    let lastError = null;

    for (const model of candidateModels) {
        try {
            const response = await fetch(GROQ_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${GROQ_API_KEY}`
                },
                body: JSON.stringify({
                    ...payload,
                    model
                })
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                const errMsg = errData?.error?.message || `HTTP ${response.status} from Groq`;
                if (errMsg.includes('decommissioned') || errMsg.includes('does not exist') || response.status === 404 || response.status === 400) {
                    console.warn(`Groq model ${model} unavailable (${errMsg}). Trying fallback model...`);
                    lastError = new Error(errMsg);
                    continue;
                }
                throw new Error(errMsg);
            }

            return await response.json();
        } catch (err) {
            lastError = err;
            console.warn(`Groq attempt with ${model} failed:`, err.message);
        }
    }

    throw lastError || new Error('All Groq AI models failed. Please verify your Groq API key.');
}

/**
 * Cleanly parse JSON content even if the model wraps it with markdown code blocks.
 */
function cleanJsonParse(rawText) {
    if (!rawText) throw new Error('Empty response from AI model');
    let cleaned = rawText.trim();
    if (cleaned.startsWith('```json')) {
        cleaned = cleaned.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
    } else if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    return JSON.parse(cleaned);
}

/**
 * Question Answering Agent (RAG)
 * Implements Steps 5-7 & Section 6 of the ClausePilot AI Guide:
 * Retrieves the most relevant contract chunks and answers with explicit clause/section citations.
 */
export async function chatWithRAG(contractText, userQuestion, previousHistory = []) {
    // Step 5-6: Retrieve relevant chunks using RAG
    const relevantChunks = retrieveRelevantChunks(contractText, userQuestion, 4);
    const contextPrompt = buildRAGPromptContext(relevantChunks);

    const systemPrompt = `You are the Question Answering Agent for ClausePilot, an expert legal AI assistant.
Answer the user's question accurately using ONLY the retrieved contract clauses below.

CRITICAL INSTRUCTIONS (as required by the ClausePilot Guide):
1. Always cite the exact Section number, clause heading, or Reference # where your answer originated (e.g., "According to Section 4.2...", "In Reference #1...").
2. If the answer cannot be determined from the provided clauses, state clearly: "The provided contract sections do not contain information regarding this question."
3. Do NOT make assumptions or hallucinate terms not present in the clauses.
4. Be concise, legally rigorous, and helpful.

Retrieved Contract Clauses:
${contextPrompt}
`;

    const messages = [
        { role: 'system', content: systemPrompt },
        ...previousHistory.map(msg => ({ role: msg.role, content: msg.content })),
        { role: 'user', content: userQuestion }
    ];

    try {
        const data = await callGroqChat({
            messages,
            temperature: 0.1
        });

        return {
            answer: data.choices[0].message.content,
            retrievedChunks: relevantChunks
        };
    } catch (error) {
        console.error("RAG Chat Error:", error);
        throw error;
    }
}

/**
 * Backward-compatible chat wrapper
 */
export async function chatWithContract(contextText, userQuestion, previousHistory = []) {
    const res = await chatWithRAG(contextText, userQuestion, previousHistory);
    return res.answer;
}

/**
 * Contract Analysis & Risk Analysis Agent
 * Infused with CUAD (Contract Understanding Atticus Dataset) taxonomy and ContractNLI verification.
 */
export async function extractContractMetadata(contractText) {
    const systemPrompt = `You are a specialized legal AI pipeline combining the Contract Analysis Agent, Obligation Agent, and Risk Analysis Agent.
Analyze the contract text based on the CUAD (Contract Understanding Atticus Dataset) categories and ContractNLI legal reasoning.

Extract the information into the exact following JSON format:

{
  "summary": "2-3 sentence executive summary of the agreement",
  "contractType": "e.g. Master Services Agreement, SaaS Agreement, Non-Disclosure Agreement, Employment Agreement, License",
  "parties": ["Party 1 Name", "Party 2 Name"],
  "effectiveDate": "Date string or 'Not specified'",
  "expirationDate": "Date string or 'Not specified'",
  "renewalTerms": "Summary of renewal terms or 'Not specified'",
  "paymentTerms": "Summary of fees, payment schedule, and penalties or 'Not specified'",
  "governingLaw": "Jurisdiction / State / Country or 'Not specified'",
  "obligations": [
    {
      "description": "Clear description of the obligation",
      "responsibleParty": "Specific party name responsible (e.g. Customer, Provider)",
      "dueDate": "Specific date, timeline (e.g. Net 30 days), or 'Ongoing'",
      "category": "One of: Payment, Service Delivery, Compliance, Renewal, Reporting, Confidentiality, General",
      "sourcePage": "Exact Section number or Clause reference if found"
    }
  ],
  "risks": [
    {
      "title": "Short title of the risk / clause error",
      "description": "Detailed explanation of why this clause is risky or problematic",
      "severity": "High, Medium, or Low",
      "ruleTriggered": "Specific rule e.g. Uncapped Liability, Vague Termination, Unilateral Indemnification, Strict Renewal Lock, Ambiguous Timeline, One-sided Exclusivity",
      "clauseReference": "Section or clause number"
    }
  ],
  "cuadClassification": {
    "hasLimitationOfLiability": true,
    "hasIndemnification": true,
    "hasTerminationForConvenience": true,
    "hasIPOwnershipClause": true,
    "hasNonCompete": false
  }
}

LEGAL ERROR & RISK CHECKLIST RULES (Check every clause against these):
1. Uncapped Liability: If there is no Limitation of Liability clause or if damages are unlimited, flag as HIGH risk.
2. Unilateral / One-Sided Terms: If one party has termination for convenience or unilateral amendment rights while the other does not, flag as HIGH or MEDIUM risk.
3. Strict Auto-Renewal Lock: If written notice of non-renewal requires > 60 days, flag as MEDIUM risk.
4. Ambiguous Obligations: Flag duties with vague wording like "promptly" or "reasonable efforts" without clear timeframes.
5. Overly Broad Indemnity: Flag indemnity covering indirect, special, or consequential damages.

Return ONLY valid JSON with no markdown formatting or backticks.

Contract Text:
${contractText.slice(0, 26000)}
`;

    try {
        const data = await callGroqChat({
            messages: [{ role: 'system', content: systemPrompt }],
            temperature: 0.1,
            response_format: { type: "json_object" }
        });

        const jsonContent = data.choices[0].message.content;
        return cleanJsonParse(jsonContent);
    } catch (error) {
        console.error("Metadata Extraction Error:", error);
        throw error;
    }
}

/**
 * Comparison Agent (Agent 6)
 * Identifies differences between multiple contract versions.
 */
export async function compareContracts(contractText1, contractText2, title1 = 'Version 1', title2 = 'Version 2') {
    const systemPrompt = `You are the Comparison Agent for ClausePilot.
Compare two versions of a legal contract:
Version 1: ${title1}
Version 2: ${title2}

Analyze the legal differences and return ONLY a valid JSON object with the following structure:

{
  "summary": "High-level summary of major shifts between the two versions",
  "riskShift": "Assessment of whether Version 2 is More Favorable, Neutral, or More Risky to the client",
  "changes": [
    {
      "clauseName": "Section or clause title (e.g. 4. Payment Terms)",
      "changeType": "Added, Removed, or Modified",
      "version1Text": "Text in Version 1 or 'Not present'",
      "version2Text": "Text in Version 2 or 'Not present'",
      "legalImpact": "Legal analysis of what this change means in terms of risk, liability, or obligations",
      "riskLevel": "High, Medium, or Low"
    }
  ],
  "statistics": {
    "addedCount": 0,
    "removedCount": 0,
    "modifiedCount": 0
  }
}

Ensure the output is ONLY valid JSON with no markdown wrapping.

--- VERSION 1 (${title1}) ---
${contractText1.slice(0, 14000)}

--- VERSION 2 (${title2}) ---
${contractText2.slice(0, 14000)}
`;

    try {
        const data = await callGroqChat({
            messages: [{ role: 'system', content: systemPrompt }],
            temperature: 0.1,
            response_format: { type: "json_object" }
        });

        return cleanJsonParse(data.choices[0].message.content);
    } catch (error) {
        console.error("Contract Comparison Error:", error);
        throw error;
    }
}

/**
 * Deep Executive Report Generation
 */
export async function generateReport(contractText) {
    const systemPrompt = `You are a Senior Legal Analyst AI using CUAD and ContractNLI standards.
Generate a comprehensive executive audit report for the following contract. Include:

1. Executive Summary & Business Objective
2. Key Operational Commitments & Timelines
3. Critical Risk Analysis & Problematic Clauses (Limitation of Liability, Indemnity, Termination)
4. CUAD Clause Classification Overview
5. Actionable Legal Recommendations & Negotiation Strategies

Structure the output with professional markdown headings, bullet points, and citation of clauses.

Contract Text:
${contractText.slice(0, 22000)}
`;

    try {
        const data = await callGroqChat({
            messages: [{ role: 'system', content: systemPrompt }],
            temperature: 0.2
        });

        return data.choices[0].message.content;
    } catch (error) {
        console.error("Report Generation Error:", error);
        throw error;
    }
}
