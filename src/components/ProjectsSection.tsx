import React, { useState } from 'react';
import { PROJECTS } from '../data/workstationData';

interface ProjectsProps {
  onShowToast: (msg: string) => void;
}

export const ProjectsSection: React.FC<ProjectsProps> = ({ onShowToast }) => {
  const [filter, setFilter] = useState<'all' | 'genai' | 'aerospace' | 'cloud'>('all');

  const genAiCount = PROJECTS.filter((p) => p.category === 'genai').length;
  const aerospaceCount = PROJECTS.filter((p) => p.category === 'aerospace').length;
  const cloudCount = PROJECTS.filter((p) => p.category === 'cloud').length;

  const filteredProjects = PROJECTS.filter((p) => {
    if (filter === 'all') return true;
    return p.category === filter;
  });

  const handleFilterChange = (cat: 'all' | 'genai' | 'aerospace' | 'cloud') => {
    setFilter(cat);
    onShowToast(`Showing ${cat.toUpperCase()} systems`);
  };

  return (
    <section id="projects" className="w-full flex flex-col gap-5 scroll-mt-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-[#f1f5f9] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#06b6d4] text-[24px]">hub</span>
            Featured Production Systems
          </h2>
          <p className="font-mono text-xs text-[#64748b] mt-0.5">
            Engineered architectures &amp; production systems with complete readable documentation
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-1 p-1 bg-[#0f1624] rounded-xl border border-[#1e293b]">
          <button
            type="button"
            className={`px-3 py-1 rounded-lg font-mono text-xs font-semibold transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-[#06b6d4] text-[#090d16]'
                : 'text-[#94a3b8] hover:text-[#f1f5f9]'
            }`}
            onClick={() => handleFilterChange('all')}
          >
            All ({PROJECTS.length})
          </button>
          <button
            type="button"
            className={`px-3 py-1 rounded-lg font-mono text-xs font-semibold transition-all cursor-pointer ${
              filter === 'genai'
                ? 'bg-[#06b6d4] text-[#090d16]'
                : 'text-[#94a3b8] hover:text-[#f1f5f9]'
            }`}
            onClick={() => handleFilterChange('genai')}
          >
            GenAI &amp; Agents ({genAiCount})
          </button>
          <button
            type="button"
            className={`px-3 py-1 rounded-lg font-mono text-xs font-semibold transition-all cursor-pointer ${
              filter === 'aerospace'
                ? 'bg-[#06b6d4] text-[#090d16]'
                : 'text-[#94a3b8] hover:text-[#f1f5f9]'
            }`}
            onClick={() => handleFilterChange('aerospace')}
          >
            LTTS ({aerospaceCount})
          </button>
          <button
            type="button"
            className={`px-3 py-1 rounded-lg font-mono text-xs font-semibold transition-all cursor-pointer ${
              filter === 'cloud'
                ? 'bg-[#06b6d4] text-[#090d16]'
                : 'text-[#94a3b8] hover:text-[#f1f5f9]'
            }`}
            onClick={() => handleFilterChange('cloud')}
          >
            Data &amp; Cloud ({cloudCount})
          </button>
        </div>
      </div>

      {/* 6 Production Systems Responsive Clean Grid: 3-column on large screens, completely readable */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProjects.map((p) => (
          <div
            key={p.id}
            className="p-6 rounded-2xl glass-card flex flex-col justify-between gap-4 holo-card"
          >
            <div className="flex flex-col gap-2.5">
              <div className="flex justify-between items-center text-[11px] font-mono">
                <span
                  className={`px-2 py-0.5 rounded-full font-semibold flex items-center gap-1.5 ${
                    p.category === 'genai'
                      ? 'bg-[#8b5cf6]/20 text-[#8b5cf6]'
                      : p.category === 'aerospace'
                      ? 'bg-[#06b6d4]/20 text-[#06b6d4]'
                      : 'bg-[#10b981]/20 text-[#10b981]'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      p.category === 'genai'
                        ? 'bg-[#8b5cf6]'
                        : p.category === 'aerospace'
                        ? 'bg-[#06b6d4]'
                        : 'bg-[#10b981]'
                    }`}
                  />
                  {p.tag}
                </span>
                <span className="text-[#64748b]">{p.filename}</span>
              </div>

              <h3 className="font-display text-base font-bold text-[#f1f5f9]">
                {p.title}
              </h3>

              <p className="font-body text-xs text-[#94a3b8] leading-relaxed">
                {p.description}
              </p>

              <div className="p-3 rounded-xl bg-[#05080e] font-mono text-xs flex flex-col gap-1 border border-[#1e293b]/40 mt-1">
                <div className="flex justify-between text-[10px] text-[#64748b]">
                  <span>{p.metricLabel}</span>
                  <span
                    className={`font-bold ${
                      p.category === 'genai'
                        ? 'text-[#8b5cf6]'
                        : p.category === 'aerospace'
                        ? 'text-[#10b981]'
                        : 'text-[#06b6d4]'
                    }`}
                  >
                    {p.metricValue}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div
                    className={`text-[11px] font-medium ${
                      p.category === 'aerospace' ? 'text-emerald-400' : 'text-[#06b6d4]'
                    }`}
                  >
                    {p.metricHighlight}
                  </div>

                  {/* Equalizer animation for Voice AI card */}
                  {p.hasAudioVisualizer && (
                    <div
                      className="flex items-end gap-1 h-5 px-2 bg-[#141d2f]/80 rounded-md py-0.5"
                      title="Live audio stream frequency visualization"
                    >
                      <span className="w-1 bg-emerald-400 rounded-full eq-bar-1" />
                      <span className="w-1 bg-[#10b981] rounded-full eq-bar-2" />
                      <span className="w-1 bg-[#06b6d4] rounded-full eq-bar-3" />
                      <span className="w-1 bg-[#8b5cf6] rounded-full eq-bar-4" />
                      <span className="w-1 bg-emerald-400 rounded-full eq-bar-5" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#1e293b]/50 flex justify-between items-center text-xs font-mono">
              <span className="text-[#64748b]">{p.stack}</span>
              <span
                className={`font-semibold flex items-center gap-1 ${
                  p.category === 'genai'
                    ? 'text-[#8b5cf6]'
                    : p.category === 'aerospace'
                    ? 'text-[#06b6d4]'
                    : 'text-[#10b981]'
                }`}
              >
                {p.statusBadge}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
