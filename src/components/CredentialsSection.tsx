import React from 'react';
import { CREDENTIALS } from '../data/workstationData';

export const CredentialsSection: React.FC = () => {
  return (
    <section
      id="credentials"
      className="w-full glass-card rounded-2xl p-6 sm:p-8 border border-[#1e293b] shadow-xl flex flex-col gap-5 scroll-mt-24"
    >
      <div className="flex justify-between items-center pb-3 border-b border-[#1e293b]">
        <h2 className="font-display text-xl font-bold text-[#f1f5f9] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#06b6d4] text-[22px]">
            verified
          </span>
          Accredited Specializations &amp; Honors
        </h2>
        <span className="font-mono text-xs text-[#10b981] font-semibold">
          TAMPER-PROOF VERIFIED
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CREDENTIALS.map((cred) => (
          <div
            key={cred.id}
            className="p-4 rounded-xl bg-[#141d2f] border border-[#1e293b]/60 flex flex-col justify-between holo-card"
          >
            <div>
              <span
                className={`material-symbols-outlined text-[24px] ${
                  cred.id === 'azure-ml'
                    ? 'text-[#06b6d4]'
                    : cred.id === 'amazon-ml'
                    ? 'text-[#10b981]'
                    : cred.id === 'cognitive-class'
                    ? 'text-[#8b5cf6]'
                    : 'text-emerald-400'
                }`}
              >
                {cred.icon}
              </span>
              <h3 className="font-display text-sm font-bold text-[#f1f5f9] mt-1">
                {cred.institution}
              </h3>
              <p
                className={`font-mono text-xs font-semibold ${
                  cred.id === 'azure-ml'
                    ? 'text-[#06b6d4]'
                    : cred.id === 'amazon-ml'
                    ? 'text-[#10b981]'
                    : cred.id === 'cognitive-class'
                    ? 'text-[#8b5cf6]'
                    : 'text-emerald-400'
                }`}
              >
                {cred.title}
              </p>
              <p className="font-body text-xs text-[#94a3b8] mt-1">
                {cred.description}
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#1e293b]/40 font-mono text-[10px] text-[#10b981]">
              {cred.badge}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
