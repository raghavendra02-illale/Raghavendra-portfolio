import React, { useState } from 'react';
import { PIPELINE_STAGES } from '../data/workstationData';

interface DefenseProps {
  onCopy: (text: string, label: string) => void;
  onShowToast: (msg: string) => void;
}

export const DefenseSection: React.FC<DefenseProps> = ({ onCopy, onShowToast }) => {
  const [activeStageId, setActiveStageId] = useState<number>(5);
  const [logText, setLogText] = useState<string>(
    '[STAGE 05/05] SHA-256 Checksum: 0x9AFE12 matches master ADE-DRDO flight firmware. 100% BITWISE PASS.'
  );
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const handleInspectStage = (stageId: number) => {
    setActiveStageId(stageId);
    const stage = PIPELINE_STAGES.find((s) => s.id === stageId);
    if (stage) {
      setLogText(stage.log);
      onShowToast(`Inspecting Stage 0${stageId} Telemetry`);
    }
  };

  const runPipelineSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    onShowToast('Executing 5-Stage Flight Verification Run...');

    setActiveStageId(1);
    setLogText('[PIPELINE RUNNING] Initializing continuous sensor telemetry ingestion...');

    setTimeout(() => {
      setActiveStageId(2);
      setLogText('[STAGE 02/05] Memory pool allocated (64MB). C99 arena checks: 0 bounds errors, 0 leaks.');
    }, 700);

    setTimeout(() => {
      setActiveStageId(3);
      setLogText('[STAGE 03/05] ADA source injection validated. Type invariant checking passed.');
    }, 1400);

    setTimeout(() => {
      setActiveStageId(4);
      setLogText('[STAGE 04/05] Python NRT matrix: 128 regression test suites verified without drift.');
    }, 2100);

    setTimeout(() => {
      setActiveStageId(5);
      setLogText('[STAGE 05/05] SHA-256 Checksum: 0x9AFE12 matches master ADE-DRDO flight firmware. 100% BITWISE PASS.');
      setIsSimulating(false);
      onShowToast('Flight Pipeline Execution PASSED (100%)');
    }, 2800);
  };

  return (
    <section
      id="defense"
      className="w-full glass-card rounded-2xl p-6 sm:p-8 border border-[#1e293b] shadow-xl flex flex-col gap-5 scroll-mt-24"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1e293b]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30 flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[24px]">shield</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-lg sm:text-xl font-bold text-[#f1f5f9]">
                L&amp;T Technology Services
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-[#10b981]/20 text-[#10b981] font-mono text-[11px] font-semibold border border-[#10b981]/30">
                Sept 2024 — Present
              </span>
            </div>
            <p className="font-mono text-xs text-[#06b6d4] mt-0.5">
              Software Engineer • Client: ADE - DRDO (Aeronautical Development Establishment)
            </p>
          </div>
        </div>

        <button
          type="button"
          className="px-3.5 py-1.5 rounded-lg bg-[#10b981] text-[#090d16] font-mono text-xs font-bold active:scale-95 transition-all flex items-center gap-1.5 self-start sm:self-auto hover:brightness-110 shadow-md shadow-[#10b981]/20 cursor-pointer disabled:opacity-50"
          onClick={runPipelineSimulation}
          disabled={isSimulating}
        >
          <span className="material-symbols-outlined text-[16px]">play_circle</span>
          {isSimulating ? 'Executing Verification...' : 'Run Flight Pipeline Sim'}
        </button>
      </div>

      {/* 4 Pillars with Hover Elevation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#141d2f] border border-[#1e293b]/60 flex flex-col justify-between holo-card">
          <div>
            <div className="flex justify-between font-mono text-[11px] text-[#10b981] mb-1">
              <span>01. C ENGINE</span>
              <span className="font-bold">15,000+ LOC</span>
            </div>
            <h3 className="font-display text-sm font-bold text-[#f1f5f9]">Standard C Tooling</h3>
            <p className="font-body text-xs text-[#94a3b8] mt-1 leading-relaxed">
              Deterministic configuration validation system with custom memory pools, bounds-checking, and zero memory leaks for flight telemetry.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-[#1e293b]/40 flex justify-between font-mono text-[10px] text-[#64748b]">
            <span>Standard C99</span>
            <span className="text-[#10b981] font-bold">DETERMINISTIC</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#141d2f] border border-[#1e293b]/60 flex flex-col justify-between holo-card">
          <div>
            <div className="flex justify-between font-mono text-[11px] text-[#06b6d4] mb-1">
              <span>02. VALIDATION</span>
              <span className="font-bold">100% REGRESSION</span>
            </div>
            <h3 className="font-display text-sm font-bold text-[#f1f5f9]">Python NRT Framework</h3>
            <p className="font-body text-xs text-[#94a3b8] mt-1 leading-relaxed">
              Automated Non-Regression Testing (NRT) framework with intelligent schema assertions, mock data generation, and telemetry verification.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-[#1e293b]/40 flex justify-between font-mono text-[10px] text-[#64748b]">
            <span>Pandera &amp; PyTest</span>
            <span className="text-[#06b6d4] font-bold">ZERO DRIFT</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#141d2f] border border-[#1e293b]/60 flex flex-col justify-between holo-card">
          <div>
            <div className="flex justify-between font-mono text-[11px] text-[#8b5cf6] mb-1">
              <span>03. MIGRATION</span>
              <span className="font-bold">ZERO SYNTAX LOSS</span>
            </div>
            <h3 className="font-display text-sm font-bold text-[#f1f5f9]">ADA Source Injection</h3>
            <p className="font-body text-xs text-[#94a3b8] mt-1 leading-relaxed">
              Structured CSV parsing to automated injection pipelines into ADA codebases, ensuring backward compatibility and strict type invariance.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-[#1e293b]/40 flex justify-between font-mono text-[10px] text-[#64748b]">
            <span>ADA-to-C Pipelines</span>
            <span className="text-[#8b5cf6] font-bold">TYPE ENFORCED</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#141d2f] border border-[#1e293b]/60 flex flex-col justify-between holo-card">
          <div>
            <div className="flex justify-between font-mono text-[11px] text-emerald-400 mb-1">
              <span>04. CRYPTO</span>
              <span className="font-bold">SHA-256 GATES</span>
            </div>
            <h3 className="font-display text-sm font-bold text-[#f1f5f9]">Firmware Integrity</h3>
            <p className="font-body text-xs text-[#94a3b8] mt-1 leading-relaxed">
              Bitwise anomaly detection and cryptographic checksum validation ensuring tamper-proof binaries across aerospace deliverables.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-[#1e293b]/40 flex justify-between font-mono text-[10px] text-[#64748b]">
            <span>Bitwise Hash Checks</span>
            <span className="text-emerald-400 font-bold">100% AUDITED</span>
          </div>
        </div>
      </div>

      {/* Interactive 5-Stage Flight Telemetry Node Row */}
      <div className="p-4 rounded-xl bg-[#05080e] border border-[#1e293b] flex flex-col gap-3 relative">
        <div className="flex justify-between items-center text-xs font-mono text-[#64748b]">
          <span className="flex items-center gap-2 text-[#f1f5f9] font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]" />
            </span>
            SIMULATED DEFENSE VERIFICATION PIPELINE (Click any node to inspect telemetry)
          </span>
          <span className="text-[#06b6d4] font-mono">PORT #8091 // ACTIVE</span>
        </div>

        {/* Connecting Light Stream Flow Line (Desktop) */}
        <div className="hidden sm:block w-full h-[2px] rounded-full pipeline-wire-flow opacity-70 mb-[-6px]" />

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono relative z-10">
          {PIPELINE_STAGES.map((st) => {
            const isSelected = activeStageId === st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => handleInspectStage(st.id)}
                className={`p-2 rounded-lg bg-[#141d2f] text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-2 border-[#06b6d4] shadow-[0_0_15px_rgba(6,182,212,0.35)] text-[#f1f5f9]'
                    : 'border border-[#1e293b] hover:border-[#06b6d4]/60 text-[#94a3b8]'
                }`}
              >
                <div className="text-[10px] text-[#06b6d4] font-bold flex items-center justify-between">
                  <span>{st.stageNum}</span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-ping" />}
                </div>
                <div className="text-xs font-semibold truncate text-[#f1f5f9]">{st.title}</div>
                <div className="text-[10px] text-[#64748b]">{st.stat}</div>
              </button>
            );
          })}
        </div>

        {/* Real-Time Log Viewer with Blinking Cursor */}
        <div className="p-3 rounded-lg bg-[#070a12] font-mono text-xs text-[#94a3b8] flex items-center justify-between overflow-x-auto border border-[#1e293b]/50">
          <div className="flex items-center gap-1.5 truncate pr-2">
            <span className="text-emerald-400 font-bold">[TELEMETRY]</span>
            <span className="truncate text-[#f1f5f9]">{logText}</span>
            <span className="inline-block w-2 h-3.5 bg-[#06b6d4] animate-pulse shrink-0 align-middle" />
          </div>
          <button
            type="button"
            className="shrink-0 p-1 text-[#64748b] hover:text-[#06b6d4] active:scale-90 transition-transform cursor-pointer"
            onClick={() => onCopy(logText, 'Telemetry log output')}
            title="Copy Log"
          >
            <span className="material-symbols-outlined text-[15px]">content_copy</span>
          </button>
        </div>
      </div>
    </section>
  );
};
