# Raghavendra Illale — Workstation OS & Engineering Portfolio

An interactive, dark-futuristic Developer Workstation OS and engineering portfolio showcasing the work of **Raghavendra Illale**, Applied AI & Backend Systems Engineer at **L&T Technology Services (LTTS)**.

---

## ⚡ Overview

Built with an aerospace-grade terminal aesthetic, this application models an interactive developer workstation operating system. It features real-time telemetry monitors, a deterministic flight verification pipeline simulation, modular project showcases, verified skills matrices, and an integrated RFC 5322 encrypted message transmission console.

- **Developer:** Raghavendra Illale
- **Role:** Applied AI & Backend Systems Engineer
- **Current Organization:** L&T Technology Services (LTTS)
- **Education:** B.Tech in Electronics & Communication Engineering, National Institute of Technology Karnataka (NITK), Surathkal
- **Direct Coordinates:**
  - 📧 Email: [raghavendraillale@gmail.com](mailto:raghavendraillale@gmail.com)
  - 📞 Phone: [+91 7899911238](tel:+917899911238)
  - 🌐 GitHub: [github.com/raghavendra02-illale](https://github.com/raghavendra02-illale)
  - 💼 LinkedIn: [linkedin.com/in/raghavendra-illale-93a325224](https://www.linkedin.com/in/raghavendra-illale-93a325224/)

---

## 🚀 Key Modules & Workstation Spaces

### 1. Space `01 // About.py`
- **Identity & Background:** Applied AI, distributed systems, and deterministic aerospace verification background.
- **Academic Credentials:** NITK Surathkal ECE degree verification.
- **Quick Links:** One-click copy for email and phone numbers, direct access to coding profiles (LeetCode, GeeksforGeeks, Code360).

### 2. Space `02 // LTTS.c` (Aerospace Tooling & Systems)
- **C99 Deterministic Engine:** Custom memory pools, zero bounds errors, leak-free validation engine across 15,000+ LOC in standard C.
- **Python NRT Framework:** Non-Regression Testing suite running automated schema assertions and test matrices with zero drift.
- **ADA Source Injection:** Structured pipeline converting CSV telemetry into type-invariant ADA codebases with full backward compatibility.
- **Firmware Integrity (SHA-256):** Bitwise tamper-proof validation against flight firmware baselines.
- **Interactive 5-Stage Verification Runner:** Simulates real-time telemetry ingestion, memory auditing, type bridging, and cryptographic verification with live terminal logs.

### 3. Space `03 // Projects.json` (Featured Production Systems)
- **Filterable Showcase:** Filter by `All (6)`, `GenAI & Agents (3)`, `Aerospace (LTTS)`, and `Data & Cloud`.
  - *AI-Powered Banking Knowledge Assistant (RAG System)* (LangChain / ChromaDB / FAISS / FastAPI)
  - *Multi-Agent Financial Research Assistant* (LangGraph / CrewAI / FastAPI)
  - *LLM-Powered Conversational AI Assistant* with live frequency visualizer animation (PlayHT / OpenAI / Gradio)
  - *Deterministic C99 & NRT Tooling Suite* (Standard C99 / 15K+ LOC / LTTS)
  - *Enterprise Data Ingestion & Quality Framework* (Python / SQL / Pandas)
  - *Cloud Distributed Print Job Queue Service* (Docker / RESTful APIs / Fault-Tolerant)

### 4. Space `04 // Skills.matrix` (Technical Arsenal)
- **Systems & Low-Level:** Standard C (C99), Python 3.11, Memory Pools, Linux Systems Programming, POSIX.
- **Applied GenAI & Agents:** LangGraph, CrewAI, Retrieval-Augmented Generation (RAG), Function Calling, Prompt Optimization.
- **Data Engineering:** High-throughput streaming (1.4M tuples/s), Pandas, Pandera, Polars, Vector Search.
- **Backend & Cloud Infrastructure:** FastAPI, Express, Docker, Microservices, CI/CD, Git.
- **Databases & Vector Stores:** ChromaDB, FAISS, PostgreSQL, Redis, SQLite.

### 5. Space `05 // Credentials.cert` (Accredited Honors)
- Microsoft Azure Machine Learning Specialization
- Amazon ML Summer School Scholar
- CognitiveClass.ai Big Data & AI Honors
- NPTEL SWAYAM Elite Certification

### 6. Space `06 // Transmit.mail` (Encrypted Transmission Console)
- Pre-filled RFC 5322 payload dispatch form.
- Multi-channel dispatch options: Launches Gmail Web Compose, connects to default desktop/mobile email clients (`mailto:`), or copies full draft payloads to clipboard.

---

## 🛠️ Workstation UI & Interactive Features

- **Live Ticking Clock:** Second-accurate digital clock with one-click toggling between **IST (Indian Standard Time)** and **UTC**.
- **Keyboard Shortcuts:** Quick navigation via `Cmd/Ctrl + 1` through `Cmd/Ctrl + 6`.
- **Telemetry System Monitor:** Displays simulated system RAM allocation (14.8 / 64 GB), link states, and daemon health.
- **Audio Visualizer:** Animated 5-bar dynamic equalizer for real-time voice streaming representation.
- **Fluid Toast Notification Engine:** Non-blocking feedback on copies, navigation events, and simulation triggers.

---

## 💻 Tech Stack

- **Frontend:** React 19, TypeScript
- **Styling:** Tailwind CSS v4 (Glassmorphism, custom cyber grids, holographic cards, terminal badges)
- **Animation & Transitions:** Motion (`motion/react`), custom CSS keyframe animations (shimmer, equalizer, light pulse)
- **Icons:** Material Symbols & Lucide React
- **Build System:** Vite 6 with Node.js / Express integration

---

## 📦 Getting Started & Local Development

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm or yarn

### Installation

1. Clone or extract the project repository:
   ```bash
   git clone https://github.com/raghavendra02-illale/workstation-os.git
   cd workstation-os
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```
   The application will be accessible at: `http://localhost:3000`

### Build & Production Preview

- **Production Build:**
  ```bash
  npm run build
  ```
- **Preview Production Build:**
  ```bash
  npm run preview
  ```
- **Type Checking & Lint:**
  ```bash
  npm run lint
  ```

---

## 📄 Project Structure

```
├── public/                # Static assets
├── src/
│   ├── components/
│   │   ├── AboutSection.tsx        # Bio, credentials, coordinate badges
│   │   ├── ContactSection.tsx      # RFC 5322 mail dispatch & contact matrix
│   │   ├── CredentialsSection.tsx  # Accredited certifications & honors
│   │   ├── DefenseSection.tsx      # LTTS C/Python telemetry verification engine
│   │   ├── ProjectsSection.tsx     # Filterable production systems with audio EQ
│   │   ├── SkillsSection.tsx       # 5-domain technical competencies matrix
│   │   ├── StatusFooter.tsx        # Workstation status bar with git commit info
│   │   ├── Toast.tsx               # Non-blocking notification banner
│   │   ├── WorkstationHeader.tsx   # Fixed omnibar with IST/UTC live clock
│   │   └── WorkstationSidebar.tsx  # Workstation spaces navigation & monitors
│   ├── data/
│   │   └── workstationData.ts      # Structured telemetry, projects, and skills data
│   ├── App.tsx                     # Main application layout & keyboard navigation
│   ├── main.tsx                    # Vite React entrypoint
│   └── index.css                   # Tailwind CSS v4 styling & animations
├── metadata.json          # AI Studio applet metadata configuration
├── package.json           # Scripts and dependencies
├── tsconfig.json          # TypeScript compiler configuration
└── vite.config.ts         # Vite build configuration
```

---

## 📜 License

Distributed under the Apache-2.0 License. See `LICENSE` or individual source file headers for full details.
