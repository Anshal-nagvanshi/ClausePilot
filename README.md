
# 🧠 ClauseMind AI

### AI-Powered Contract Review & Obligation Tracking System

ClauseMind AI is an intelligent contract analysis platform that uses **Agentic AI and Retrieval-Augmented Generation (RAG)** to help users understand business contracts, identify obligations, detect risks, and track important deadlines.

The system reduces manual contract review efforts by extracting important information and presenting it in a simple, structured dashboard.

> ⚠️ ClauseMind AI provides AI-assisted contract analysis and does not replace professional legal advice.

---

## 🚀 Features

- 📄 **Contract Upload** – Upload PDF, DOCX, and TXT contracts.
- 🤖 **AI Contract Summarization** – Generate easy-to-understand contract summaries.
- 🔍 **Clause Extraction** – Identify important contract clauses.
- 📌 **Obligation Detection** – Extract responsibilities assigned to each party.
- 📅 **Deadline Tracking** – Identify renewal, payment, and termination dates.
- ⚠️ **Risk Identification** – Highlight clauses that require human review.
- 💬 **AI Contract Assistant** – Ask questions about uploaded contracts.
- 📚 **Source-Based Answers** – Provide relevant page or clause references.
- 🔄 **Contract Comparison** – Compare different contract versions.
- 📊 **Interactive Dashboard** – View contracts, obligations, risks, and timelines.
- 🔔 **Renewal Alerts** – Track upcoming contract deadlines.

---

## 🎯 Problem Statement

Business contracts often contain complex language, important obligations, payment terms, and renewal conditions. Manually reviewing these documents can be time-consuming and may result in missed deadlines or important clauses.

ClauseMind AI addresses this problem by using AI agents to analyze contracts, extract meaningful information, and assist users in managing contractual responsibilities.

---

## 💡 Proposed Solution

ClauseMind AI combines document processing, Large Language Models (LLMs), and Retrieval-Augmented Generation (RAG) to provide intelligent contract analysis.

The system:

1. Accepts a contract uploaded by the user.
2. Extracts and processes the document text.
3. Identifies important clauses and contractual obligations.
4. Detects deadlines, renewal terms, and potential risks.
5. Stores structured contract information.
6. Answers user questions using relevant contract content.
7. Displays results through an interactive dashboard.

---

## 🏗️ System Architecture

```text
                 User
                  |
                  v
          React Frontend
                  |
                  v
          Node.js Backend
                  |
                  v
        Document Processing
                  |
                  v
          Text Extraction
                  |
                  v
       Agentic AI Workflow
                  |
        ---------------------
        |         |         |
        v         v         v
    Summary   Obligation   Risk
     Agent      Agent     Agent
        |         |         |
        ---------------------
                  |
                  v
        Embedding & RAG
                  |
                  v
          MongoDB Database
                  |
                  v
       AI Answers & Dashboard
```

---

## 🤖 AI Agents

### 1. Document Processing Agent
Extracts and cleans text from uploaded documents.

### 2. Contract Analysis Agent
Identifies parties, clauses, payment terms, and contract conditions.

### 3. Obligation Agent
Detects responsibilities, deadlines, and assigned parties.

### 4. Risk Analysis Agent
Highlights clauses that may require additional human review.

### 5. Question Answering Agent
Answers questions using retrieved contract content and source references.

### 6. Comparison Agent
Identifies differences between multiple contract versions.

---

## 🛠️ Technology Stack

### Frontend
- React.js
- TypeScript
- Vite
- Tailwind CSS

### Backend
- Node.js
- Express.js
- TypeScript

### Database
- MongoDB Atlas
- MongoDB Atlas Vector Search

### Artificial Intelligence
- Large Language Model API
- Retrieval-Augmented Generation (RAG)
- Text Embeddings
- Structured JSON Outputs

### Document Processing
- PDF Parser
- DOCX Parser
- Text Extraction Tools

### Deployment
- Vercel
- MongoDB Atlas

---

## 📂 Project Structure

```text
ClauseMind-AI/
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── services/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── services/
│   │   └── agents/
│   └── server.ts
│
├── datasets/
│
├── README.md
└── .env.example
```

---

## 📊 Datasets

ClauseMind AI can use the following datasets for research, evaluation, and model development:

### CUAD
Contract Understanding Atticus Dataset (CUAD) is used for legal clause extraction and contract understanding.

### ContractNLI
ContractNLI is used for evidence-based reasoning over contracts. It includes classifications such as:

- Entailment
- Contradiction
- Neutral

### Synthetic Contracts
Fictional contracts can be created to test:

- Renewal deadlines
- Payment obligations
- Termination conditions
- Contract comparison
- Obligation tracking

---

## 🔄 RAG Workflow

ClauseMind AI uses Retrieval-Augmented Generation to answer contract-related questions.

```text
Contract Upload
      |
      v
Text Extraction
      |
      v
Text Chunking
      |
      v
Generate Embeddings
      |
      v
Store in Vector Database
      |
      v
User Question
      |
      v
Retrieve Relevant Chunks
      |
      v
LLM Generates Answer
      |
      v
Answer with Source Reference
```

RAG helps the system provide answers based on the uploaded contract rather than relying only on the model's general knowledge.

---

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/ClauseMind-AI.git
cd ClauseMind-AI
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 3. Install Backend Dependencies

```bash
cd ../backend
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
LLM_API_KEY=your_llm_api_key
```

Add the required frontend environment variable:

```env
VITE_API_BASE_URL=http://localhost:5001/api
```

> Never upload API keys or `.env` files to GitHub.

### 5. Run the Backend

```bash
npm run dev
```

### 6. Run the Frontend

Open another terminal:

```bash
cd frontend
npm run dev
```

The application will be available at the local Vite URL shown in your terminal.

---

## 🧪 Example Questions

Users can ask questions such as:

- When does this contract expire?
- Is automatic renewal mentioned?
- What are the payment conditions?
- What obligations belong to the client?
- What happens if a party terminates the contract?
- Which clauses require human review?
- What changed between the two contract versions?

---

## 🔐 Security and Privacy

The project should follow these security practices:

- Protect uploaded documents.
- Never expose API keys in frontend code.
- Validate uploaded file types.
- Implement authentication and authorization.
- Restrict access to user-specific contracts.
- Avoid storing unnecessary sensitive information.
- Inform users about AI limitations.

---

## ⚠️ Limitations

- AI-generated results may contain errors.
- Legal interpretation requires professional review.
- OCR quality may affect scanned document analysis.
- Complex legal clauses may require additional context.
- Deadline extraction should be verified by users.
- The system is not a substitute for a qualified lawyer.

---

## 🔮 Future Scope

- Multi-language contract analysis.
- Advanced legal risk scoring.
- Email and calendar integration.
- Automatic reminder notifications.
- Support for additional document formats.
- Improved clause-level explainability.
- Enterprise-level access control.
- Integration with contract management platforms.

---

## 👥 Team

| Name | Role |
|------|------|
| Anshal |  Full-Stack Development |
| Vikesh | Development & AI Integration |

---

## 🏆 Hackathon Project

**Project Name:** ClauseMind AI  
**Category:** Agentic AI  
**Project Type:** AI-Powered Contract Analysis and Management System

---

## 📄 License

This project is developed for educational and hackathon purposes.

Add an appropriate open-source license before distributing the project publicly.
