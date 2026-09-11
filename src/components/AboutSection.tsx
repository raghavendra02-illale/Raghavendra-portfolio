import React from 'react';
import { motion } from 'motion/react';
import { CODING_PROFILES } from '../data/workstationData';

interface AboutProps {
  onNavigate: (sectionId: string) => void;
  onCopy: (text: string, label: string) => void;
  onShowToast: (msg: string) => void;
}

export const AboutSection: React.FC<AboutProps> = ({
  onNavigate,
  onCopy,
  onShowToast,
}) => {
  return (
    <motion.section
      id="about"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-full glass-card rounded-2xl p-6 sm:p-8 border border-[#1e293b] shadow-2xl relative overflow-hidden scroll-mt-24"
    >
      <div className="flex flex-col md:flex-row items-start justify-between gap-6">
        <div className="flex-1 flex flex-col gap-3 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#10b981]/10 border border-[#10b981]/30 text-[#10b981] font-mono text-xs font-semibold flex items-center gap-2 shadow-sm shadow-[#10b981]/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]" />
              </span>
              ORGANIZATION: LTTS
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#1b273e] text-[#06b6d4] font-mono text-[11px] border border-[#1e293b] hover:border-[#06b6d4]/40 transition-colors">
              15K+ LOC C PRODUCTION
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#1b273e] text-[#8b5cf6] font-mono text-[11px] border border-[#1e293b] hover:border-[#8b5cf6]/40 transition-colors">
              AUTONOMOUS RAG
            </span>
          </div>

          {/* Name Title Shimmer Effect */}
          <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-[#f1f5f9]">
            <span className="animate-shimmer">Raghavendra Illale</span>
          </h1>

          <p className="font-display text-base sm:text-lg text-[#06b6d4] font-medium">
            Applied AI &amp; Backend Systems Engineer | Distributed Systems &amp; Deterministic Aerospace Tooling
          </p>

          <p className="font-body text-sm text-[#94a3b8] leading-relaxed">
            Engineering high-assurance C/Python pipelines, deterministic validation engines, and bitwise verification frameworks at{' '}
            <strong className="text-[#f1f5f9] font-semibold">
              L&amp;T Technology Services (LTTS)
            </strong>
            . Specialized in building intelligent RAG knowledge engines, autonomous multi-agent financial systems (LangGraph / CrewAI), and resilient high-throughput backend microservices. Graduated from the prestigious{' '}
            <strong className="text-[#f1f5f9] font-semibold">
              National Institute of Technology Karnataka (NITK), Surathkal
            </strong>{' '}
            with a B.Tech in Electronics &amp; Communication Engineering.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <motion.button
              type="button"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.18 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4] text-[#090d16] font-mono text-xs font-bold transition-all shadow-lg shadow-[#8b5cf6]/20 hover:brightness-110 cursor-pointer"
              onClick={() => onNavigate('projects')}
            >
              <span className="material-symbols-outlined text-[18px]">layers</span>
              View Featured Production Systems
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.18 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#141d2f] hover:bg-[#1b273e] text-[#06b6d4] font-mono text-xs font-bold transition-all border border-[#1e293b] hover:border-[#06b6d4]/50 hover:shadow-lg hover:shadow-[#06b6d4]/10 cursor-pointer"
              onClick={() => onNavigate('defense')}
            >
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              Inspect C Tooling (LTTS)
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.18 }}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#141d2f] hover:bg-[#1b273e] text-[#f1f5f9] font-mono text-xs transition-all border border-[#1e293b] hover:border-[#06b6d4]/40 cursor-pointer"
              onClick={() => onCopy('raghavendraillale@gmail.com', 'Email Address')}
            >
              <span className="material-symbols-outlined text-[17px] text-[#06b6d4]">content_copy</span>
              Copy Email
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.18 }}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#06b6d4]/10 hover:bg-[#06b6d4]/20 text-[#06b6d4] font-mono text-xs font-semibold transition-all border border-[#06b6d4]/40 hover:border-[#06b6d4] shadow-sm shadow-[#06b6d4]/15 cursor-pointer"
              onClick={(e) => {
                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                window.dispatchEvent(
                  new CustomEvent('burst-bubbles', {
                    detail: { x: rect.left + rect.width / 2, y: rect.top, count: 3 },
                  })
                );
                onShowToast('🫧 Spawned subtle bubbles! Touch anywhere to pop or float!');
              }}
              title="Spawn colorful glowing bubbles"
            >
              <span>🫧</span>
              <span>Pop Bubbles FX</span>
            </motion.button>
          </div>
        </div>

        {/* Academic & Direct Coordinates Card (Side by Side) */}
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          className="w-full md:w-[350px] lg:w-[380px] p-4 rounded-xl bg-[#05080e] border border-[#1e293b] flex flex-col gap-2.5 holo-card shrink-0"
        >
          <div className="flex justify-between items-center pb-2 border-b border-[#1e293b] text-[11px] font-mono">
            <span className="text-[#64748b] uppercase font-semibold">CREDENTIALS</span>
            <span className="text-[#06b6d4] font-bold">NITK SURATHKAL</span>
          </div>

          <div className="flex flex-col gap-2 text-xs font-mono">
            <div className="p-2 rounded bg-[#141d2f] flex justify-between">
              <span className="text-[#94a3b8]">Degree:</span>
              <span className="text-[#f1f5f9] font-bold">B.Tech ECE (NITK)</span>
            </div>

            <div
              className="p-2 rounded bg-[#141d2f] flex justify-between items-center cursor-pointer hover:border-[#06b6d4] border border-transparent transition-all group"
              onClick={() => onCopy('raghavendraillale@gmail.com', 'Email Address')}
              title="Click to copy email to clipboard"
            >
              <span className="text-[#94a3b8]">Email:</span>
              <span className="text-[#06b6d4] font-medium truncate max-w-[190px] group-hover:underline flex items-center gap-1">
                raghavendraillale@gmail.com
                <span className="material-symbols-outlined text-[13px] opacity-70">content_copy</span>
              </span>
            </div>

            <div
              className="p-2 rounded bg-[#141d2f] flex justify-between items-center cursor-pointer hover:border-[#10b981] border border-transparent transition-all group"
              onClick={() => onCopy('+917899911238', 'Phone Number')}
              title="Click to copy phone to clipboard"
            >
              <span className="text-[#94a3b8]">Phone:</span>
              <span className="text-[#10b981] font-bold flex items-center gap-1 group-hover:underline">
                +91 7899911238
                <span className="material-symbols-outlined text-[13px] opacity-70">content_copy</span>
              </span>
            </div>
          </div>

          {/* Guaranteed Direct Redirection Anchor Links */}
          <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-xs">
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="https://github.com/raghavendra02-illale"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded bg-[#141d2f] hover:bg-[#06b6d4] hover:text-[#090d16] text-[#f1f5f9] text-center transition-all flex items-center justify-center gap-1.5 font-semibold cursor-pointer border border-[#1e293b]/40"
              onClick={() => onShowToast('Opening GitHub profile...')}
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub ↗
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="https://www.linkedin.com/in/raghavendra-illale-93a325224/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded bg-[#141d2f] hover:bg-[#10b981] hover:text-[#090d16] text-[#f1f5f9] text-center transition-all flex items-center justify-center gap-1.5 font-semibold cursor-pointer border border-[#1e293b]/40"
              onClick={() => onShowToast('Opening LinkedIn profile...')}
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
              LinkedIn ↗
            </motion.a>
          </div>

          {/* Coding Platform Badges in Credentials Card - 3 All In One Line Beside Beside */}
          <div className="pt-2 border-t border-[#1e293b]/40 flex flex-col gap-1.5">
            <div className="text-[10px] font-mono text-[#64748b] uppercase font-semibold">
              CODING PLATFORMS
            </div>
            <div className="grid grid-cols-3 gap-1.5 font-mono text-[10px] sm:text-[11px]">
              {CODING_PROFILES.map((p) => (
                <motion.a
                  key={p.name}
                  whileHover={{ scale: 1.04, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-1.5 py-1.5 rounded bg-[#141d2f] text-[#f1f5f9] hover:${p.color} border border-[#1e293b]/40 flex items-center justify-center gap-1 transition-all whitespace-nowrap overflow-hidden hover:border-[#06b6d4]/50`}
                  onClick={() => onShowToast(`Opening ${p.name}...`)}
                  title={`${p.name} Profile`}
                >
                  <span className={`${p.color} font-bold shrink-0`}>{p.label}</span>
                  <span className="truncate">{p.name}</span>
                  <span className="shrink-0 text-[10px] opacity-80">↗</span>
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};
