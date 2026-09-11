import React, { useState } from 'react';
import { CODING_PROFILES } from '../data/workstationData';

interface ContactProps {
  onCopy: (text: string, label: string) => void;
  onShowToast: (msg: string) => void;
}

export const ContactSection: React.FC<ContactProps> = ({ onCopy, onShowToast }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Full-Time Engineering Role (Applied AI / Backend Systems)');
  const [message, setMessage] = useState('');
  const [dispatchReady, setDispatchReady] = useState(false);
  const [gmailComposeUrl, setGmailComposeUrl] = useState('');
  const [mailtoUrl, setMailtoUrl] = useState('');
  const [fullDraftText, setFullDraftText] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      onShowToast('Please fill out all required fields');
      return;
    }

    const emailBody = `From: ${name} <${email}>\nSubject: ${subject}\nRecipient: raghavendraillale@gmail.com\n\n${message}\n\n---\nSent via Raghavendra Illale Workstation Console`;
    const fullDraft = `To: raghavendraillale@gmail.com\nSubject: ${subject}\n\n${emailBody}`;

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=raghavendraillale@gmail.com&su=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(emailBody)}`;
    const mailtoLink = `mailto:raghavendraillale@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(emailBody)}`;

    setGmailComposeUrl(gmailUrl);
    setMailtoUrl(mailtoLink);
    setFullDraftText(fullDraft);
    setDispatchReady(true);

    onShowToast('Dispatch prepared! Launching mail composer...');

    // Attempt to trigger web Gmail compose in new window
    try {
      window.open(gmailUrl, '_blank');
    } catch {
      window.location.href = mailtoLink;
    }
  };

  return (
    <section
      id="contact"
      className="w-full glass-card rounded-2xl p-6 sm:p-8 border border-[#1e293b] shadow-2xl flex flex-col gap-6 scroll-mt-24"
    >
      <div className="flex justify-between items-center pb-3 border-b border-[#1e293b]">
        <div>
          <h2 className="font-display text-xl font-bold text-[#f1f5f9] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#06b6d4] text-[22px]">
              send
            </span>
            Encrypted Transmission Console
          </h2>
          <p className="font-mono text-xs text-[#64748b] mt-0.5">
            Send a direct transmission straight to Raghavendra's personal inbox
          </p>
        </div>
        <span className="px-2 py-0.5 rounded bg-[#10b981]/15 text-[#10b981] font-mono text-xs font-semibold border border-[#10b981]/30">
          DISPATCH_PORT_25: OPEN
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Direct Coordinates & Clear Instruction */}
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="font-display text-sm font-bold text-[#f1f5f9]">
              Direct Engineering Coordinates
            </h3>
            <p className="font-body text-xs text-[#94a3b8] leading-relaxed mt-1">
              Available for high-impact opportunities in Applied AI Engineering, Backend Distributed Systems, and Deterministic Aerospace Tooling. Based in Bangalore, India.
            </p>
          </div>

          {/* Direct Email Link Card */}
          <div className="p-3.5 rounded-xl bg-[#1b273e]/80 border border-[#06b6d4]/40 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[#06b6d4] font-mono text-xs font-bold">
              <span className="material-symbols-outlined text-[18px]">alternate_email</span>
              <span>Prefer direct contact?</span>
            </div>
            <p className="font-body text-xs text-[#94a3b8]">
              Simply send an email directly to{' '}
              <a
                className="text-[#06b6d4] font-bold hover:underline"
                href="mailto:raghavendraillale@gmail.com"
              >
                raghavendraillale@gmail.com
              </a>{' '}
              or use the instant buttons below:
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <a
                className="px-3 py-1.5 rounded-lg bg-[#06b6d4] text-[#090d16] font-mono text-xs font-bold hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                href="mailto:raghavendraillale@gmail.com"
                onClick={() => onShowToast('Opening default mail client...')}
              >
                <span className="material-symbols-outlined text-[15px]">mail</span> Email Direct
              </a>
              <button
                className="px-3 py-1.5 rounded-lg bg-[#141d2f] border border-[#1e293b] hover:border-[#06b6d4] text-[#f1f5f9] font-mono text-xs flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                onClick={() => onCopy('raghavendraillale@gmail.com', 'Email Address')}
                type="button"
              >
                <span className="material-symbols-outlined text-[15px] text-[#06b6d4]">
                  content_copy
                </span>{' '}
                Copy Email
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2 font-mono text-xs">
            <div
              className="p-3 rounded-xl bg-[#141d2f] border border-[#1e293b]/60 flex items-center justify-between holo-card cursor-pointer"
              onClick={() => onCopy('raghavendraillale@gmail.com', 'Email Address')}
            >
              <div>
                <div className="text-[10px] text-[#64748b]">PRIMARY COMM CHANNEL</div>
                <div className="text-[#06b6d4] font-bold flex items-center gap-1.5">
                  raghavendraillale@gmail.com
                  <span className="material-symbols-outlined text-[14px]">content_copy</span>
                </div>
              </div>
              <button
                className="p-1.5 rounded-lg bg-[#1b273e] text-[#06b6d4] hover:bg-[#06b6d4] hover:text-[#090d16] active:scale-90 transition-all cursor-pointer"
                title="Copy email"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">content_copy</span>
              </button>
            </div>

            <div
              className="p-3 rounded-xl bg-[#141d2f] border border-[#1e293b]/60 flex items-center justify-between holo-card cursor-pointer"
              onClick={() => onCopy('+917899911238', 'Phone Number')}
            >
              <div>
                <div className="text-[10px] text-[#64748b]">PHONE RELAY</div>
                <div className="text-[#10b981] font-bold flex items-center gap-1.5">
                  +91 7899911238
                  <span className="material-symbols-outlined text-[14px]">content_copy</span>
                </div>
              </div>
              <button
                className="p-1.5 rounded-lg bg-[#1b273e] text-[#10b981] hover:bg-[#10b981] hover:text-[#090d16] active:scale-90 transition-all cursor-pointer"
                title="Copy phone"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">content_copy</span>
              </button>
            </div>
          </div>

          {/* All Coding Platforms Matrix In Contact Section */}
          <div className="p-3 rounded-xl bg-[#141d2f] border border-[#1e293b]/60 flex flex-col gap-2">
            <div className="text-[10px] font-mono text-[#64748b] font-semibold uppercase">
              VERIFIED PROFILES &amp; REPOSITORIES
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-xs">
              <a
                className="p-2 rounded bg-[#1b273e] hover:border-[#06b6d4] border border-transparent flex items-center gap-1.5 text-[#f1f5f9] hover:text-[#06b6d4] transition-all"
                href="https://github.com/raghavendraillale"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onShowToast('Opening GitHub...')}
              >
                <span className="font-bold text-[#06b6d4]">GH</span> GitHub ↗
              </a>
              <a
                className="p-2 rounded bg-[#1b273e] hover:border-[#10b981] border border-transparent flex items-center gap-1.5 text-[#f1f5f9] hover:text-[#10b981] transition-all"
                href="https://www.linkedin.com/in/raghavendra-illale-93a325224/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onShowToast('Opening LinkedIn...')}
              >
                <span className="font-bold text-[#10b981]">IN</span> LinkedIn ↗
              </a>
              {CODING_PROFILES.map((p) => (
                <a
                  key={p.name}
                  className={`p-2 rounded bg-[#1b273e] border border-transparent flex items-center gap-1.5 text-[#f1f5f9] hover:${p.color} transition-all`}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => onShowToast(`Opening ${p.name}...`)}
                >
                  <span className={`font-bold ${p.color}`}>{p.label}</span> {p.name} ↗
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Direct Mail Transmission Form */}
        <div className="flex flex-col gap-3">
          <form
            className="p-4 rounded-xl bg-[#141d2f] border border-[#1e293b]/60 flex flex-col gap-3 font-mono text-xs holo-card"
            onSubmit={handleFormSubmit}
          >
            <div className="flex justify-between items-center text-[10px] text-[#64748b] pb-1 border-b border-[#1e293b]/40">
              <span>RFC 5322 PAYLOAD DISPATCH CONSOLE</span>
              <span className="text-[#06b6d4] font-bold">raghavendraillale@gmail.com</span>
            </div>

            <div>
              <label className="text-[10px] text-[#64748b] block mb-1">
                SENDER NAME / ORGANIZATION *
              </label>
              <input
                className="w-full bg-[#070a12] border border-[#1e293b] rounded-lg p-2 text-[#f1f5f9] focus:outline-none focus:border-[#06b6d4] transition-colors font-body text-xs"
                placeholder="e.g. Sarah Connor, Lead Architect"
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-[10px] text-[#64748b] block mb-1">
                SENDER EMAIL / CONTACT *
              </label>
              <input
                className="w-full bg-[#070a12] border border-[#1e293b] rounded-lg p-2 text-[#f1f5f9] focus:outline-none focus:border-[#06b6d4] transition-colors font-body text-xs"
                placeholder="e.g. sarah.connor@organization.com"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="text-[10px] text-[#64748b] block mb-1">
                SUBJECT / OPPORTUNITY *
              </label>
              <select
                className="w-full bg-[#070a12] border border-[#1e293b] rounded-lg p-2 text-[#f1f5f9] focus:outline-none focus:border-[#06b6d4] transition-colors font-body text-xs"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              >
                <option value="Full-Time Engineering Role (Applied AI / Backend Systems)">
                  Full-Time Engineering Role (Applied AI / Backend Systems)
                </option>
                <option value="Mission-Critical Aerospace / DRDO Collaboration">
                  Mission-Critical Aerospace / DRDO Collaboration
                </option>
                <option value="Enterprise GenAI / RAG Advisory">
                  Enterprise GenAI / RAG Advisory
                </option>
                <option value="Direct Technical Consultation & Inquiry">
                  Direct Technical Consultation &amp; Inquiry
                </option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-[#64748b] block mb-1">
                MESSAGE PAYLOAD *
              </label>
              <textarea
                className="w-full bg-[#070a12] border border-[#1e293b] rounded-lg p-2 text-[#f1f5f9] focus:outline-none focus:border-[#06b6d4] transition-colors font-body text-xs"
                placeholder="Provide project scope, tech stack requirements, or role specifications..."
                required
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <button
              className="w-full py-2.5 rounded-xl bg-[#06b6d4] text-[#090d16] font-bold hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#06b6d4]/25 font-mono text-xs cursor-pointer"
              type="submit"
            >
              <span className="material-symbols-outlined text-[17px]">outgoing_mail</span>
              Send Message / Dispatch Email
            </button>

            <p className="text-[11px] text-[#64748b] font-body leading-relaxed text-center">
              Automatically launches Gmail Web Compose &amp; mail clients pre-filled directly to{' '}
              <span className="text-[#06b6d4] font-mono">raghavendraillale@gmail.com</span>.
            </p>
          </form>

          {/* Dispatch Modal / Alert Card Right Over Form on Dispatch */}
          {dispatchReady && (
            <div className="p-4 rounded-xl bg-[#1b273e] border-2 border-[#10b981]/80 flex flex-col gap-3 shadow-2xl transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#10b981] font-bold text-sm">
                  <span className="material-symbols-outlined text-[20px] text-[#10b981]">
                    verified
                  </span>
                  <span>✅ Ready to Send to Raghavendra</span>
                </div>
                <button
                  className="text-[#64748b] hover:text-[#f1f5f9] cursor-pointer"
                  onClick={() => setDispatchReady(false)}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              <p className="font-body text-xs text-[#94a3b8] leading-relaxed">
                Select your preferred mail channel below to transmit directly to{' '}
                <strong className="text-[#f1f5f9]">raghavendraillale@gmail.com</strong>:
              </p>

              <div className="flex flex-col gap-2">
                <a
                  className="w-full py-2 px-3 rounded-lg bg-[#06b6d4] text-[#090d16] font-mono text-xs font-bold flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-md shadow-[#06b6d4]/20"
                  href={gmailComposeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => onShowToast('Opening Gmail Web Compose...')}
                >
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  Send via Gmail (Web)
                </a>

                <a
                  className="w-full py-2 px-3 rounded-lg bg-[#243350] hover:bg-[#1b273e] text-[#f1f5f9] border border-[#1e293b] font-mono text-xs font-semibold flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
                  href={mailtoUrl}
                  onClick={() => onShowToast('Opening local mail client...')}
                >
                  <span className="material-symbols-outlined text-[16px] text-[#10b981]">mail</span>
                  Default Email App (Outlook / Apple Mail)
                </a>

                <button
                  className="w-full py-2 px-3 rounded-lg bg-[#243350] hover:bg-[#10b981] hover:text-[#090d16] text-[#10b981] border border-[#10b981]/40 font-mono text-xs font-semibold flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
                  onClick={() => onCopy(fullDraftText, 'Full Email Message Draft')}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">content_copy</span>
                  Copy Full Message Draft
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
