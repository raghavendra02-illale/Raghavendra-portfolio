import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface HeaderProps {
  activeSection: string;
  onToggleSidebar: () => void;
  onShowToast: (msg: string) => void;
  atmosphereMode?: 'bubbles' | 'sky' | 'water';
  onCycleAtmosphere?: () => void;
}

export const WorkstationHeader: React.FC<HeaderProps> = ({
  activeSection,
  onToggleSidebar,
  onShowToast,
  atmosphereMode = 'bubbles',
  onCycleAtmosphere,
}) => {
  const [timeZone, setTimeZone] = useState<'IST' | 'UTC'>('IST');
  const [clockString, setClockString] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      if (timeZone === 'IST') {
        const time = now.toLocaleTimeString('en-US', {
          timeZone: 'Asia/Kolkata',
          hour12: false,
        });
        setClockString(`${time} IST`);
      } else {
        const time = now.toLocaleTimeString('en-US', {
          timeZone: 'UTC',
          hour12: false,
        });
        setClockString(`${time} UTC`);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [timeZone]);

  const handleToggleTz = () => {
    const nextTz = timeZone === 'IST' ? 'UTC' : 'IST';
    setTimeZone(nextTz);
    onShowToast(`Clock toggled to ${nextTz}`);
  };

  return (
    <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-[#070a12]/95 backdrop-blur-xl z-30 px-4 md:px-8 border-b border-[#1e293b] flex items-center justify-between gap-4 shadow-lg">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="lg:hidden p-2 rounded-lg bg-[#141d2f] text-[#06b6d4] hover:bg-[#1b273e] active:scale-95 transition-transform"
          onClick={onToggleSidebar}
          title="Open Sidebar"
        >
          <span className="material-symbols-outlined text-[20px]">menu</span>
        </button>

        <div className="flex items-center gap-2 font-mono">
          <div className="w-2.5 h-2.5 rounded-full bg-[#06b6d4] animate-pulse" />
          <span className="text-xs font-bold text-[#f1f5f9] tracking-wide hidden sm:inline">
            core.raghavendra.eng
          </span>
          <span className="text-xs text-[#64748b] hidden sm:inline">/</span>
          <span className="text-xs text-[#06b6d4] font-medium truncate">
            {activeSection}.py
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1b273e] text-[#64748b] hidden md:inline ml-1 border border-[#1e293b]">
            v2.4.0-stable
          </span>
        </div>
      </div>

      {/* Center Status Node */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-[#141d2f]/70 border border-[#1e293b]/60 text-xs font-mono text-[#94a3b8]">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]" />
        </span>
        <span>LTTS PIPELINE: ACTIVE</span>
      </div>

      {/* Quick Action Badges & Clock */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden lg:flex items-center gap-1 font-mono text-[11px]">
          <motion.a
            href="https://github.com/raghavendra02-illale"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -1, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-2 py-1 rounded bg-[#141d2f] border border-[#1e293b]/60 text-[#f1f5f9] hover:text-[#06b6d4] transition-colors flex items-center gap-1.5"
            onClick={() => onShowToast('Opening GitHub profile...')}
            title="GitHub Profile"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>GitHub</span>
          </motion.a>

          <motion.a
            href="https://www.linkedin.com/in/raghavendra-illale-93a325224/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -1, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-2 py-1 rounded bg-[#141d2f] border border-[#1e293b]/60 text-[#f1f5f9] hover:text-[#10b981] transition-colors flex items-center gap-1.5"
            onClick={() => onShowToast('Opening LinkedIn profile...')}
            title="LinkedIn Profile"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
            <span>LinkedIn</span>
          </motion.a>
        </div>

        {/* Atmosphere Effect Quick Mode Switcher */}
        {onCycleAtmosphere && (
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.15 }}
            onClick={onCycleAtmosphere}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#141d2f] border border-[#06b6d4]/50 font-mono text-[11px] text-[#06b6d4] hover:bg-[#06b6d4]/10 transition-all cursor-pointer shadow-sm shadow-[#06b6d4]/15"
            title={`Current FX: ${atmosphereMode}. Click to switch between Bubbles, Star Sky, and Water Drops!`}
          >
            <span className="text-sm">
              {atmosphereMode === 'bubbles' ? '🫧' : atmosphereMode === 'sky' ? '🌌' : '💧'}
            </span>
            <span className="hidden sm:inline font-bold capitalize">{atmosphereMode} FX</span>
          </motion.button>
        )}

        {/* Active Live Ticking Digital Clock */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          transition={{ duration: 0.15 }}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#141d2f] border border-[#1e293b]/60 font-mono text-[11px] text-[#10b981] hover:border-[#10b981] transition-colors cursor-pointer"
          onClick={handleToggleTz}
          title="Click to toggle IST/UTC"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]" />
          </span>
          <span className="font-bold tracking-wider">{clockString || '00:00:00 IST'}</span>
        </motion.button>

        {/* Quick Mail Link */}
        <motion.a
          href="mailto:raghavendraillale@gmail.com"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="p-2 rounded-lg bg-[#141d2f] text-[#06b6d4] hover:bg-[#06b6d4] hover:text-[#090d16] transition-colors cursor-pointer"
          title="Email Raghavendra"
          onClick={() => onShowToast('Launching email client...')}
        >
          <span className="material-symbols-outlined text-[18px]">mail</span>
        </motion.a>
      </div>
    </header>
  );
};
