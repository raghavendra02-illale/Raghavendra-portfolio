import React from 'react';
import { motion } from 'motion/react';
import { NAV_ITEMS, CODING_PROFILES } from '../data/workstationData';

interface SidebarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const WorkstationSidebar: React.FC<SidebarProps> = ({
  activeSection,
  onNavigate,
  isOpen,
  onClose,
  onShowToast,
}) => {
  const handleFullscreenToggle = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      onShowToast('Entered Fullscreen Mode');
    } else {
      document.exitFullscreen().catch(() => {});
      onShowToast('Exited Fullscreen Mode');
    }
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      <div
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Persistent Left Sidebar */}
      <aside
        className={`fixed left-0 top-0 bottom-0 w-72 bg-[#05080e]/95 backdrop-blur-2xl z-40 flex flex-col justify-between border-r border-[#1e293b] transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col p-4 overflow-y-auto">
          {/* Window Controls */}
          <div className="flex items-center justify-between pb-4 border-b border-[#1e293b]/60">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="w-3 h-3 rounded-full bg-red-500/90 cursor-pointer hover:opacity-80 active:scale-90 transition-transform"
                onClick={() => onShowToast('Workstation active (cannot close root)')}
                title="Close"
              />
              <button
                type="button"
                className="w-3 h-3 rounded-full bg-yellow-500/90 cursor-pointer hover:opacity-80 active:scale-90 transition-transform"
                onClick={() => onShowToast('Workspace minimized to dock')}
                title="Minimize"
              />
              <button
                type="button"
                className="w-3 h-3 rounded-full bg-green-500/90 cursor-pointer hover:opacity-80 active:scale-90 transition-transform"
                onClick={handleFullscreenToggle}
                title="Fullscreen"
              />
            </div>
            <span className="font-mono text-[11px] text-[#64748b] font-semibold tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#06b6d4] animate-ping" />
              NODE: RAGHAV-01
            </span>
            <button
              type="button"
              className="lg:hidden text-[#64748b] hover:text-[#f1f5f9] p-1"
              onClick={onClose}
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {/* Identity Profile */}
          <div className="my-4 p-3 rounded-xl bg-[#0f1624] border border-[#1e293b]/60 holo-card">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#06b6d4] to-[#8b5cf6] flex items-center justify-center font-display font-black text-sm text-[#090d16] shadow-md ring-1 ring-white/20">
                  RI
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#10b981] absolute -bottom-0.5 -right-0.5 ring-2 ring-[#090d16] status-radar" />
              </div>
              <div className="overflow-hidden">
                <div className="font-mono text-xs text-[#06b6d4] font-bold truncate">
                  raghavendra.eng
                </div>
                <div className="font-mono text-[10px] text-[#94a3b8] truncate">
                  Applied AI &amp; Backend
                </div>
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-[#1e293b]/40 flex items-center justify-between font-mono text-[10px] text-[#64748b]">
              <span className="truncate">ORGANIZATION: LTTS</span>
              <span className="text-[#10b981] font-bold flex items-center gap-1.5 shrink-0">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]" />
                </span>
                ONLINE
              </span>
            </div>
          </div>

          {/* Workstation Spaces / Nav Tabs */}
          <div className="text-[10px] font-mono text-[#64748b] uppercase tracking-wider font-semibold mb-2 px-1 flex items-center justify-between">
            <span>WORKSTATION SPACES</span>
            <span className="text-[9px] text-[#06b6d4]/80 font-mono">SYS//NAV</span>
          </div>

          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <motion.button
                  key={item.id}
                  type="button"
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => {
                    onNavigate(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono transition-colors text-left cursor-pointer ${
                    isActive
                      ? 'text-[#06b6d4] bg-[#141d2f] border border-[#06b6d4]/30 shadow-sm'
                      : 'text-[#94a3b8] hover:text-[#06b6d4] hover:bg-[#141d2f]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className={`material-symbols-outlined text-[17px] ${item.color || 'text-[#06b6d4]'}`}>
                      {item.icon}
                    </span>
                    {item.num}// {item.name}
                  </span>
                  <span className="text-[10px] opacity-60">{item.shortcut}</span>
                </motion.button>
              );
            })}
          </nav>

          {/* Live Profiles In Sidebar */}
          <div className="mt-5 pt-3 border-t border-[#1e293b]/60">
            <div className="text-[10px] font-mono text-[#64748b] uppercase tracking-wider font-semibold mb-2 px-1">
              CODING PROFILES
            </div>
            <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px]">
              {CODING_PROFILES.map((profile) => (
                <motion.a
                  key={profile.name}
                  href={profile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className={`p-1.5 rounded bg-[#0f1624] border border-[#1e293b]/40 ${profile.border} ${profile.color} flex items-center gap-1.5 transition-colors`}
                  onClick={() => onShowToast(`Opening ${profile.name} profile...`)}
                >
                  <span className="font-bold text-[10px]">{profile.label}</span> {profile.name} ↗
                </motion.a>
              ))}
            </div>
          </div>

          {/* Live Daemons Telemetry Box */}
          <div className="mt-4 pt-3 border-t border-[#1e293b]/60">
            <div className="flex items-center justify-between text-[10px] font-mono text-[#64748b] font-semibold mb-2">
              <span>ACTIVE DAEMONS</span>
              <span className="text-[#10b981] flex items-center gap-1.5 font-bold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]" />
                </span>
                4 HEALTHY
              </span>
            </div>
            <div className="flex flex-col gap-1.5 font-mono text-[11px]">
              <div className="p-2 rounded bg-[#0f1624] border border-[#1e293b]/40 flex justify-between hover:border-[#64748b] transition-colors">
                <span className="text-[#94a3b8]">C Tools Validator</span>
                <span className="text-[#10b981] font-bold">15K LOC</span>
              </div>
              <div className="p-2 rounded bg-[#0f1624] border border-[#1e293b]/40 flex justify-between hover:border-[#64748b] transition-colors">
                <span className="text-[#94a3b8]">Python NRT Suite</span>
                <span className="text-[#06b6d4] font-bold">PASSED</span>
              </div>
              <div className="p-2 rounded bg-[#0f1624] border border-[#1e293b]/40 flex justify-between hover:border-[#64748b] transition-colors">
                <span className="text-[#94a3b8]">SHA-256 Checksum</span>
                <span className="text-emerald-400 font-bold">MATCHED</span>
              </div>
              <div className="p-2 rounded bg-[#0f1624] border border-[#1e293b]/40 flex justify-between hover:border-[#8b5cf6] transition-colors">
                <span className="text-[#8b5cf6] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6] animate-pulse" />
                  Chroma Vector
                </span>
                <span className="text-[#8b5cf6] font-bold">1536-dim</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Bottom Status */}
        <div className="p-3 bg-[#0f1624] border-t border-[#1e293b]/60 flex flex-col gap-1 font-mono text-[11px]">
          <div className="flex justify-between text-[#94a3b8]">
            <span>RAM: 14.8 / 64 GB</span>
            <span className="text-[#10b981] font-bold">23%</span>
          </div>
          <div className="w-full bg-[#141d2f] rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#06b6d4] to-[#10b981] h-full rounded-full transition-all duration-500"
              style={{ width: '23%' }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-[#64748b] pt-1">
            <span>BATTERY: 100% ⚡</span>
            <span className="text-[#10b981] font-semibold flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-[#10b981] animate-ping" />
              LTTS LINK: NOMINAL
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
