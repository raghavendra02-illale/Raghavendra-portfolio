import React from 'react';
import { PresenceState } from '../hooks/usePresenceStatus';

interface StatusFooterProps {
  presence?: PresenceState;
}

export const StatusFooter: React.FC<StatusFooterProps> = ({ presence }) => {
  const isOnline = presence ? presence.status === 'online' : true;
  const isIdle = presence ? presence.status === 'idle' : false;

  return (
    <footer className="fixed bottom-0 left-0 lg:left-72 right-0 h-8 bg-[#05080e]/95 backdrop-blur-xl z-20 px-4 md:px-8 border-t border-[#1e293b] flex items-center justify-between font-mono text-[11px] text-[#64748b]">
      <div className="flex items-center gap-3 truncate">
        <span className="text-[#06b6d4] flex items-center gap-1">
          <span className="material-symbols-outlined text-[13px]">fork_right</span>
          git:main (#a89ef2c)
        </span>
        <span className="hidden sm:inline text-[#94a3b8]">
          C99 / Python 3.11 / PyTorch
        </span>
        <span className="hidden md:inline text-emerald-400">Docker 26.0</span>
      </div>

      <div className="flex items-center gap-3">
        <div
          className={`flex items-center gap-2 font-semibold ${
            isOnline
              ? 'text-[#10b981]'
              : isIdle
              ? 'text-[#f59e0b]'
              : 'text-[#ef4444]'
          }`}
          title={presence?.statusDetail || 'Systems connected'}
        >
          <span className="relative flex h-2 w-2">
            {isOnline && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75" />
            )}
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isOnline
                  ? 'bg-[#10b981]'
                  : isIdle
                  ? 'bg-[#f59e0b]'
                  : 'bg-[#ef4444]'
              }`}
            />
          </span>
          <span>
            {presence
              ? `RAGHAVENDRA: ${presence.statusLabel} • ${presence.pingMs}ms`
              : 'All Systems Operational'}
          </span>
        </div>
      </div>
    </footer>
  );
};

