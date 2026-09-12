import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CODING_PROFILES } from '../data/workstationData';
import { playClickSound, playSuccessSound } from '../utils/audioFx';

interface ContactProps {
  onCopy: (text: string, label: string) => void;
  onShowToast: (msg: string) => void;
}

export const ContactSection: React.FC<ContactProps> = ({ onCopy, onShowToast }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Full-Time Engineering Role (Applied AI / Backend Systems)');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'warning' | 'error';
    text: string;
    detail?: string;
  } | null>(null);

  const emailBody = `From: ${name || 'Prospective Collaborator'} <${email || 'contact@domain.com'}>\nSubject: ${subject}\n\n${message}\n\n---\nTransmitted to Raghavendra Illale (raghavendraillale@gmail.com)`;
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=raghavendraillale@gmail.com&su=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(emailBody)}`;
  const mailtoLink = `mailto:raghavendraillale@gmail.com?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(emailBody)}`;

  const handleCopyAction = (val: string, label: string) => {
    playSuccessSound();
    onCopy(val, label);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();

    if (!name.trim() || !email.trim() || !message.trim()) {
      onShowToast('Please fill out all required fields');
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);
    onShowToast('Transmitting message to raghavendraillale@gmail.com...');

    try {
      const response = await fetch('https://formspree.io/f/xyzyqobk', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          recipient: 'raghavendraillale@gmail.com',
          timestamp: new Date().toISOString(),
          system: 'Raghavendra Workstation Direct Relay',
        }),
      });

      if (response.ok) {
        playSuccessSound();
        setStatusMessage({
          type: 'success',
          text: 'Transmission Dispatched Successfully',
          detail: 'Your message has been routed to raghavendraillale@gmail.com. Raghavendra will reply promptly.',
        });
        onShowToast('Message transmitted successfully!');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        // Fallback to client mail dispatch
        playSuccessSound();
        setStatusMessage({
          type: 'warning',
          text: 'Opening Direct Email Client Fallback',
          detail: 'Opening your default mail client with pre-formatted payload to ensure immediate transmission.',
        });
        window.open(gmailUrl, '_blank');
      }
    } catch {
      // Network or sandbox failure fallback
      playSuccessSound();
      setStatusMessage({
        type: 'warning',
        text: 'Opening Mail Client Direct Link',
        detail: 'Connecting via pre-configured Gmail compose window to raghavendraillale@gmail.com.',
      });
      window.open(gmailUrl, '_blank');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.section
      id="contact"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
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
                className="px-3.5 py-1.5 rounded-lg bg-[#06b6d4] text-[#090d16] font-mono text-xs font-bold hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                href="mailto:raghavendraillale@gmail.com"
                onClick={() => onShowToast('Opening default mail client...')}
              >
                <span className="material-symbols-outlined text-[15px]">mail</span> Open Mail Client
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-2 font-mono text-xs">
            <div
              className="p-3 rounded-xl bg-[#141d2f] border border-[#1e293b]/60 flex items-center justify-between holo-card cursor-pointer group"
              onClick={() => handleCopyAction('raghavendraillale@gmail.com', 'Email Address')}
            >
              <div>
                <div className="text-[10px] text-[#64748b]">PRIMARY COMM CHANNEL</div>
                <div className="text-[#06b6d4] font-bold">
                  raghavendraillale@gmail.com
                </div>
              </div>
              <button
                className="p-1.5 rounded-lg bg-[#1b273e] text-[#06b6d4] hover:bg-[#06b6d4] hover:text-[#090d16] active:scale-90 transition-all cursor-pointer"
                title="Copy email"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopyAction('raghavendraillale@gmail.com', 'Email Address');
                }}
              >
                <span className="material-symbols-outlined text-[16px]">content_copy</span>
              </button>
            </div>

            <div
              className="p-3 rounded-xl bg-[#141d2f] border border-[#1e293b]/60 flex items-center justify-between holo-card cursor-pointer group"
              onClick={() => handleCopyAction('+917899911238', 'Phone Number')}
            >
              <div>
                <div className="text-[10px] text-[#64748b]">PHONE RELAY</div>
                <div className="text-[#10b981] font-bold">
                  +91 7899911238
                </div>
              </div>
              <button
                className="p-1.5 rounded-lg bg-[#1b273e] text-[#10b981] hover:bg-[#10b981] hover:text-[#090d16] active:scale-90 transition-all cursor-pointer"
                title="Copy phone"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopyAction('+917899911238', 'Phone Number');
                }}
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
                href="https://github.com/raghavendra02-illale"
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
            <div className="flex justify-between items-center text-xs pb-1.5 border-b border-[#1e293b]/40">
              <span className="font-semibold text-[#f1f5f9] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#06b6d4]">send</span>
                Direct Message Console
              </span>
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
                <option value="Mission-Critical LTTS Systems Collaboration">
                  Mission-Critical LTTS Systems Collaboration
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

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className={`w-full py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg font-mono text-xs cursor-pointer ${
                isSubmitting
                  ? 'bg-[#1e293b] text-[#94a3b8] cursor-not-allowed opacity-80'
                  : 'bg-[#06b6d4] text-[#090d16] hover:brightness-110 shadow-[#06b6d4]/25'
              }`}
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined text-[17px] animate-spin">
                    sync
                  </span>
                  Transmitting Payload to raghavendraillale@gmail.com...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[17px]">outgoing_mail</span>
                  Send Message / Dispatch Email Directly
                </>
              )}
            </motion.button>

            {/* In-Place Status Banner */}
            <AnimatePresence>
              {statusMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                  className={`p-3 rounded-xl border flex flex-col gap-1 transition-all ${
                    statusMessage.type === 'success'
                      ? 'bg-[#10b981]/10 border-[#10b981]/40 text-[#10b981]'
                      : statusMessage.type === 'warning'
                      ? 'bg-[#f59e0b]/10 border-[#f59e0b]/40 text-[#f59e0b]'
                      : 'bg-[#ef4444]/10 border-[#ef4444]/40 text-[#ef4444]'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5 text-xs">
                    <span className="material-symbols-outlined text-[16px]">
                      {statusMessage.type === 'success' ? 'verified' : 'info'}
                    </span>
                    <span>{statusMessage.text}</span>
                  </div>
                  {statusMessage.detail && (
                    <p className="font-body text-[11px] text-[#cbd5e1] leading-relaxed">
                      {statusMessage.detail}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Direct Fallback Channel Row */}
            <div className="flex items-center justify-between pt-2 border-t border-[#1e293b]/40 font-mono text-[11px] text-[#64748b]">
              <span>Direct Composing Channels:</span>
              <div className="flex items-center gap-2.5">
                <a
                  href={gmailUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#06b6d4] hover:underline flex items-center gap-1 font-semibold"
                  onClick={() => onShowToast('Launching Gmail web composer...')}
                  title="Open pre-addressed compose window in Gmail"
                >
                  <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                  Gmail Web ↗
                </a>
                <span className="text-[#334155]">|</span>
                <a
                  href={mailtoLink}
                  className="text-[#10b981] hover:underline flex items-center gap-1 font-semibold"
                  onClick={() => onShowToast('Opening local mail client...')}
                  title="Open default email application"
                >
                  <span className="material-symbols-outlined text-[13px]">mail</span>
                  Mail App ↗
                </a>
              </div>
            </div>

            <p className="text-[11px] text-[#64748b] font-body leading-relaxed text-center">
              Transmits directly via secure HTTP endpoint to{' '}
              <span className="text-[#06b6d4] font-mono">raghavendraillale@gmail.com</span> with zero redirects or secondary dialogs.
            </p>
          </form>
        </div>
      </div>
    </motion.section>
  );
};
