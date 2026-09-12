import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ThemeMode } from '../hooks/useTheme';
import { PresenceState } from '../hooks/usePresenceStatus';

interface HeaderProps {
  activeSection: string;
  onToggleSidebar: () => void;
  onShowToast: (msg: string) => void;
  atmosphereMode?: 'circuits' | 'radar' | 'sky' | 'aurora';
  onCycleAtmosphere?: () => void;
  theme?: ThemeMode;
  onThemeChange?: (mode: ThemeMode) => void;
  presence?: PresenceState;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
}

export const WorkstationHeader: React.FC<HeaderProps> = ({
  activeSection,
  onToggleSidebar,
  onShowToast,
  atmosphereMode = 'circuits',
  onCycleAtmosphere,
  theme = 'system',
  onThemeChange,
  presence,
  soundEnabled = true,
  onToggleSound,
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
    <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-[#070a12]/95 backdrop-blur-xl z-30 px-3 sm:px-6 md:px-8 border-b border-[#1e293b] flex items-center justify-between gap-2 sm:gap-4 shadow-lg">
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

      {/* Live Presence Status Node */}
      <div
        className={`hidden md:flex items-center gap-2 px-3 py-1 rounded-full font-mono text-xs border transition-colors ${
          presence?.status === 'online'
            ? 'bg-[#141d2f]/70 border-[#10b981]/40 text-[#10b981]'
            : presence?.status === 'idle'
            ? 'bg-[#141d2f]/70 border-[#f59e0b]/40 text-[#f59e0b]'
            : 'bg-[#141d2f]/70 border-[#ef4444]/40 text-[#ef4444]'
        }`}
        title={presence?.statusDetail || 'Status Online'}
      >
        <span className="relative flex h-2 w-2">
          {presence?.status === 'online' && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75" />
          )}
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              presence?.status === 'online'
                ? 'bg-[#10b981]'
                : presence?.status === 'idle'
                ? 'bg-[#f59e0b]'
                : 'bg-[#ef4444]'
            }`}
          />
        </span>
        <span className="font-bold">
          {presence?.statusLabel || 'ONLINE NOW'}
        </span>
        {presence?.pingMs && (
          <span className="text-[10px] opacity-75 hidden lg:inline">
            • {presence.pingMs}ms
          </span>
        )}
      </div>

      {/* Quick Action Badges, Theme Switcher, Sound & Clock */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Theme Mode Selector (Dark / Light / Default) */}
        {onThemeChange && (
          <div className="flex items-center p-0.5 rounded-full bg-[#141d2f] border border-[#1e293b]/60 font-mono text-[11px]">
            <button
              type="button"
              onClick={() => {
                onThemeChange('dark');
                onShowToast('Theme set to Dark Mode');
              }}
              className={`p-1 px-2 rounded-full flex items-center gap-1 transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-[#06b6d4] text-[#090d16] font-bold shadow-sm'
                  : 'text-[#94a3b8] hover:text-[#f1f5f9]'
              }`}
              title="Dark Cyberpunk Theme"
            >
              <span className="material-symbols-outlined text-[14px]">dark_mode</span>
              <span className="hidden xl:inline text-[10px]">Dark</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onThemeChange('light');
                onShowToast('Theme set to Luminous Light Mode');
              }}
              className={`p-1 px-2 rounded-full flex items-center gap-1 transition-all cursor-pointer ${
                theme === 'light'
                  ? 'bg-[#06b6d4] text-[#090d16] font-bold shadow-sm'
                  : 'text-[#94a3b8] hover:text-[#f1f5f9]'
              }`}
              title="Crazy Attractive Light Mode"
            >
              <span className="material-symbols-outlined text-[14px]">light_mode</span>
              <span className="hidden xl:inline text-[10px]">Light</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onThemeChange('system');
                onShowToast('Theme set to Default (System)');
              }}
              className={`p-1 px-2 rounded-full flex items-center gap-1 transition-all cursor-pointer ${
                theme === 'system'
                  ? 'bg-[#06b6d4] text-[#090d16] font-bold shadow-sm'
                  : 'text-[#94a3b8] hover:text-[#f1f5f9]'
              }`}
              title="Default (Follow OS System)"
            >
              <span className="material-symbols-outlined text-[14px]">devices</span>
              <span className="hidden xl:inline text-[10px]">Default</span>
            </button>
          </div>
        )}

        {/* Audio FX Sound Toggle */}
        {onToggleSound && (
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.15 }}
            onClick={onToggleSound}
            className={`p-1.5 sm:p-2 rounded-lg border transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-[#141d2f] text-[#06b6d4] border-[#06b6d4]/40 hover:bg-[#06b6d4]/15'
                : 'bg-[#141d2f] text-[#64748b] border-[#1e293b]/60 hover:text-[#94a3b8]'
            }`}
            title={
              soundEnabled
                ? 'Acoustic Sound FX: ON (Click to Mute)'
                : 'Acoustic Sound FX: MUTED (Click to Enable)'
            }
          >
            <span className="material-symbols-outlined text-[17px]">
              {soundEnabled ? 'volume_up' : 'volume_off'}
            </span>
          </motion.button>
        )}

        {/* Technical Animation Mode Switcher */}
        {onCycleAtmosphere && (
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.15 }}
            onClick={onCycleAtmosphere}
            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-full bg-[#141d2f] border border-[#06b6d4]/50 font-mono text-[11px] text-[#06b6d4] hover:bg-[#06b6d4]/10 transition-all cursor-pointer shadow-sm shadow-[#06b6d4]/15"
            title={`Current Atmosphere FX: ${atmosphereMode?.toUpperCase()}. Click to switch between Circuits, Radar, Deep Sky, and Aurora Waves!`}
          >
            <span className="material-symbols-outlined text-[15px]">
              {atmosphereMode === 'circuits'
                ? 'hub'
                : atmosphereMode === 'radar'
                ? 'radar'
                : atmosphereMode === 'sky'
                ? 'nights_stay'
                : 'waves'}
            </span>
            <span className="hidden md:inline font-bold capitalize">{atmosphereMode} FX</span>
          </motion.button>
        )}

        {/* Active Live Ticking Digital Clock */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          transition={{ duration: 0.15 }}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#141d2f] border border-[#1e293b]/60 font-mono text-[11px] text-[#10b981] hover:border-[#10b981] transition-colors cursor-pointer"
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
          className="p-1.5 sm:p-2 rounded-lg bg-[#141d2f] text-[#06b6d4] hover:bg-[#06b6d4] hover:text-[#090d16] transition-colors cursor-pointer"
          title="Email Raghavendra"
          onClick={() => onShowToast('Launching email client...')}
        >
          <span className="material-symbols-outlined text-[17px]">mail</span>
        </motion.a>
      </div>
    </header>
  );
};

