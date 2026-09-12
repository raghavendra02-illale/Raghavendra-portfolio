import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Project } from '../types';
import { playModalSound, playClickSound, playSuccessSound } from '../utils/audioFx';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onShowToast,
}) => {
  useEffect(() => {
    if (project) {
      playModalSound(true);
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          playModalSound(false);
          onClose();
        }
      };
      window.addEventListener('keydown', onKeyDown);
      document.body.style.overflow = 'hidden';

      return () => {
        window.removeEventListener('keydown', onKeyDown);
        document.body.style.overflow = 'unset';
      };
    }
  }, [project, onClose]);

  if (!project) return null;

  const handleCopySpecs = () => {
    playSuccessSound();
    const specsText = `=== SYSTEM SPECIFICATION: ${project.title} ===
Category: ${project.category.toUpperCase()}
Module: ${project.filename}
Status: ${project.statusBadge}
Stack: ${project.techStackList?.join(', ') || project.stack}

Overview:
${project.detailedDescription || project.description}

Problem Solved:
${project.problemSolved || 'N/A'}

Architecture Flow:
${project.architectureFlow ? project.architectureFlow.map((s, i) => `${i + 1}. ${s}`).join('\n') : 'N/A'}

Key Engineering Highlights:
${project.keyHighlights ? project.keyHighlights.map((h) => `• ${h}`).join('\n') : 'N/A'}
`;
    navigator.clipboard?.writeText(specsText).then(() => {
      onShowToast(`Copied ${project.title} technical specifications!`);
    }).catch(() => {
      onShowToast('Copied specifications to clipboard');
    });
  };

  const getCategoryColor = (cat: string) => {
    if (cat === 'genai') return { text: 'text-[#8b5cf6]', bg: 'bg-[#8b5cf6]/15', border: 'border-[#8b5cf6]/40', dot: 'bg-[#8b5cf6]' };
    if (cat === 'aerospace') return { text: 'text-[#06b6d4]', bg: 'bg-[#06b6d4]/15', border: 'border-[#06b6d4]/40', dot: 'bg-[#06b6d4]' };
    return { text: 'text-[#10b981]', bg: 'bg-[#10b981]/15', border: 'border-[#10b981]/40', dot: 'bg-[#10b981]' };
  };

  const colors = getCategoryColor(project.category);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
          onClick={() => {
            playModalSound(false);
            onClose();
          }}
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl bg-[#0b101c] border border-[#1e293b] shadow-2xl shadow-cyan-500/10 z-10 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="p-4 sm:p-6 border-b border-[#1e293b] flex items-start justify-between gap-4 bg-[#0e1526]/80">
            <div className="flex flex-col gap-2 min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className={`px-2.5 py-0.5 rounded-full font-semibold border flex items-center gap-1.5 ${colors.bg} ${colors.text} ${colors.border}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                  {project.tag}
                </span>
                <span className="text-[#64748b] bg-[#141d2f] px-2 py-0.5 rounded font-mono text-[11px] border border-[#1e293b]">
                  {project.filename}
                </span>
                <span className="text-[#10b981] font-semibold text-[11px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                  {project.statusBadge}
                </span>
              </div>

              <h2 className="font-display text-lg sm:text-2xl font-bold text-[#f1f5f9] leading-tight">
                {project.title}
              </h2>
            </div>

            <button
              type="button"
              className="p-2 rounded-xl bg-[#141d2f] hover:bg-[#1f2d47] text-[#94a3b8] hover:text-[#f1f5f9] border border-[#1e293b] transition-all cursor-pointer shrink-0"
              onClick={() => {
                playClickSound();
                playModalSound(false);
                onClose();
              }}
              title="Close Dialog (Esc)"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Modal Scrollable Body */}
          <div className="p-4 sm:p-6 overflow-y-auto flex flex-col gap-6 font-body text-sm leading-relaxed text-[#cbd5e1]">
            {/* High-level Narrative */}
            <div>
              <h4 className="font-mono text-xs uppercase tracking-wider text-[#64748b] mb-1.5 font-semibold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#06b6d4]">info</span>
                System Overview &amp; Architecture
              </h4>
              <p className="text-[#cbd5e1] text-xs sm:text-sm leading-relaxed bg-[#111827]/60 p-4 rounded-xl border border-[#1e293b]/60">
                {project.detailedDescription || project.description}
              </p>
            </div>

            {/* Problem Solved Callout */}
            {project.problemSolved && (
              <div className="p-4 rounded-xl bg-[#06b6d4]/5 border border-[#06b6d4]/20 flex flex-col gap-1.5">
                <div className="font-mono text-[11px] uppercase tracking-wider text-[#06b6d4] font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">task_alt</span>
                  Engineering Problem Solved
                </div>
                <p className="text-xs sm:text-sm text-[#e2e8f0]">
                  {project.problemSolved}
                </p>
              </div>
            )}

            {/* Architecture Pipeline Flow */}
            {project.architectureFlow && project.architectureFlow.length > 0 && (
              <div>
                <h4 className="font-mono text-xs uppercase tracking-wider text-[#64748b] mb-2 font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#10b981]">alt_route</span>
                  Sequential Execution Pipeline
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs">
                  {project.architectureFlow.map((step, idx) => (
                    <div
                      key={step}
                      className="p-3 rounded-xl bg-[#141d2f]/70 border border-[#1e293b] flex items-center gap-3"
                    >
                      <span className="w-6 h-6 rounded-lg bg-[#06b6d4]/20 text-[#06b6d4] font-bold flex items-center justify-center text-[11px] shrink-0">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="text-[#f1f5f9] font-medium leading-snug">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Technical Highlights */}
            {project.keyHighlights && project.keyHighlights.length > 0 && (
              <div>
                <h4 className="font-mono text-xs uppercase tracking-wider text-[#64748b] mb-2 font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#8b5cf6]">verified</span>
                  Key Engineering Highlights
                </h4>
                <ul className="flex flex-col gap-2">
                  {project.keyHighlights.map((hl) => (
                    <li
                      key={hl}
                      className="p-3 rounded-xl bg-[#111827]/60 border border-[#1e293b]/60 flex items-start gap-2.5 text-xs text-[#cbd5e1]"
                    >
                      <span className="material-symbols-outlined text-[16px] text-[#10b981] shrink-0 mt-0.5">
                        check_circle
                      </span>
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quantifiable Metrics Grid */}
            {project.metricsData && project.metricsData.length > 0 && (
              <div>
                <h4 className="font-mono text-xs uppercase tracking-wider text-[#64748b] mb-2 font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-amber-400">speed</span>
                  Telemetry &amp; Benchmarks
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {project.metricsData.map((m) => (
                    <div
                      key={m.label}
                      className="p-3 rounded-xl bg-[#080d1a] border border-[#1e293b] flex flex-col gap-1 font-mono text-xs"
                    >
                      <span className="text-[10px] text-[#64748b] truncate">{m.label}</span>
                      <span className="font-bold text-sm text-[#06b6d4]">{m.value}</span>
                      {m.detail && <span className="text-[10px] text-[#94a3b8] leading-tight truncate">{m.detail}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tech Stack Chips */}
            {project.techStackList && project.techStackList.length > 0 && (
              <div>
                <h4 className="font-mono text-xs uppercase tracking-wider text-[#64748b] mb-2 font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#06b6d4]">terminal</span>
                  Integrated Technologies &amp; Libraries
                </h4>
                <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                  {project.techStackList.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-lg bg-[#141d2f] text-[#f1f5f9] border border-[#1e293b] text-[11px] font-medium hover:border-[#06b6d4]/50 transition-colors"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-4 sm:p-5 border-t border-[#1e293b] bg-[#0e1526]/80 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#141d2f] hover:bg-[#1e2b42] text-[#cbd5e1] hover:text-[#f1f5f9] border border-[#1e293b] cursor-pointer transition-all active:scale-95"
              onClick={handleCopySpecs}
            >
              <span className="material-symbols-outlined text-[16px] text-[#06b6d4]">content_copy</span>
              Copy Architecture Specs
            </button>

            <button
              type="button"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#06b6d4] hover:bg-[#0891b2] text-[#090d16] font-bold cursor-pointer transition-all active:scale-95 shadow-md shadow-[#06b6d4]/20"
              onClick={() => {
                playClickSound();
                playModalSound(false);
                onClose();
              }}
            >
              <span className="material-symbols-outlined text-[16px]">check</span>
              Done Exploring
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
