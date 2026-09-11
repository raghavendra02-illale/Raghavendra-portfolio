import React from 'react';
import { SKILL_CATEGORIES } from '../data/workstationData';

export const SkillsSection: React.FC = () => {
  return (
    <section
      id="arsenal"
      className="w-full glass-card rounded-2xl p-6 sm:p-8 border border-[#1e293b] shadow-xl flex flex-col gap-5 scroll-mt-24"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1e293b]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#06b6d4]/20 text-[#06b6d4] border border-[#06b6d4]/30 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[22px]">terminal</span>
            </div>
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-black text-[#f1f5f9] tracking-tight">
                Technical Skills &amp; Core Competencies
              </h2>
              <p className="font-mono text-xs text-[#64748b] mt-0.5">
                Verified technical proficiencies across Systems, Data Engineering, GenAI, and Backend Cloud Infrastructure
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#10b981]/15 border border-[#10b981]/30 text-[#10b981] font-mono text-xs font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-ping" />
            100% PRODUCTION TESTED
          </span>
          <span className="hidden sm:inline px-2.5 py-1 rounded-full bg-[#1b273e] text-[#06b6d4] font-mono text-[11px] border border-[#1e293b]">
            5 DOMAINS • 28+ TECHS
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 font-mono text-xs">
        {SKILL_CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            className={`p-5 rounded-2xl bg-[#141d2f]/90 border border-[#1e293b]/60 flex flex-col justify-between holo-card gap-4 ${
              cat.colSpan || ''
            }`}
          >
            <div>
              <div className="flex items-center justify-between pb-2.5 border-b border-[#1e293b]/40">
                <div className={`font-display text-sm font-bold ${cat.accentColor} flex items-center gap-2`}>
                  <span className="material-symbols-outlined text-[19px]">{cat.icon}</span>
                  {cat.title}
                </div>
                {cat.badge ? (
                  <span className="text-[10px] text-[#8b5cf6] font-bold px-1.5 py-0.5 rounded bg-[#8b5cf6]/10 border border-[#8b5cf6]/30">
                    {cat.badge}
                  </span>
                ) : (
                  <span className="text-[10px] text-[#64748b] font-mono">{cat.codeTag}</span>
                )}
              </div>

              <div
                className={`gap-2 mt-3 ${
                  cat.id === 'databases'
                    ? 'grid grid-cols-1 sm:grid-cols-2'
                    : 'flex flex-col'
                }`}
              >
                {cat.skills.map((s, idx) => {
                  const isWide = cat.id === 'databases' && idx === 4;
                  return (
                    <div
                      key={s.name}
                      className={`p-2.5 rounded-xl bg-[#1b273e]/60 border border-[#1e293b]/50 flex items-center justify-between hover:border-[#06b6d4]/50 transition-colors ${
                        isWide ? 'sm:col-span-2 border-[#8b5cf6]/40 hover:border-[#8b5cf6]' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#06b6d4]" />
                        <span className="font-bold text-[#f1f5f9]">{s.name}</span>
                      </div>
                      <span className={`text-[11px] font-semibold ${s.color}`}>
                        {s.detail}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 border-t border-[#1e293b]/40 flex items-center justify-between text-[11px] text-[#64748b]">
              <span>{cat.footerLabel}</span>
              <span className={`font-bold ${cat.accentColor}`}>{cat.footerValue}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
