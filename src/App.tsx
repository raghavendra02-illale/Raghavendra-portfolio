/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { WorkstationSidebar } from './components/WorkstationSidebar';
import { WorkstationHeader } from './components/WorkstationHeader';
import { AboutSection } from './components/AboutSection';
import { DefenseSection } from './components/DefenseSection';
import { ProjectsSection } from './components/ProjectsSection';
import { SkillsSection } from './components/SkillsSection';
import { CredentialsSection } from './components/CredentialsSection';
import { ContactSection } from './components/ContactSection';
import { StatusFooter } from './components/StatusFooter';
import { Toast } from './components/Toast';
import { InteractiveAtmosphere, AtmosphereMode } from './components/InteractiveAtmosphere';
import { useTheme } from './hooks/useTheme';
import { usePresenceStatus } from './hooks/usePresenceStatus';
import {
  isSoundEnabled,
  setSoundEnabled,
  playClickSound,
  playSuccessSound,
} from './utils/audioFx';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('about');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastVisible, setToastVisible] = useState<boolean>(false);
  const [atmosphereMode, setAtmosphereMode] = useState<AtmosphereMode>('circuits');
  const [soundActive, setSoundActive] = useState<boolean>(() => isSoundEnabled());

  // Theme & Live Presence hooks
  const { theme, setTheme } = useTheme();
  const presence = usePresenceStatus();

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
    clearTimeout((window as unknown as { _toastTimeout?: number })._toastTimeout);
    (window as unknown as { _toastTimeout?: number })._toastTimeout = window.setTimeout(() => {
      setToastVisible(false);
    }, 3200);
  }, []);

  const toggleSound = useCallback(() => {
    setSoundActive((prev) => {
      const next = !prev;
      setSoundEnabled(next);
      if (next) {
        playSuccessSound();
      }
      showToast(next ? 'Acoustic Sound FX: Enabled' : 'Acoustic Sound FX: Muted');
      return next;
    });
  }, [showToast]);

  const cycleAtmosphere = useCallback(() => {
    setAtmosphereMode((prev) => {
      const modes: AtmosphereMode[] = ['circuits', 'radar', 'sky', 'aurora'];
      const curIdx = modes.indexOf(prev);
      const next: AtmosphereMode = modes[(curIdx + 1) % modes.length];
      const labels: Record<AtmosphereMode, string> = {
        circuits: 'CYBER CIRCUITS',
        radar: 'TACTICAL RADAR',
        sky: 'DEEP SKY CONSTELLATIONS',
        aurora: 'AURORA HARMONIC WAVES',
      };
      showToast(`Atmosphere FX switched to: ${labels[next]}`);
      return next;
    });
  }, [showToast]);

  // Global tactile sound on any clickable UI elements (buttons, nav, cards, tabs)
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const isInteractive = target.closest(
        'button, a, [role="button"], input[type="submit"], input[type="checkbox"], select, .holo-card'
      );
      if (isInteractive) {
        playClickSound();
      }
    };
    document.addEventListener('click', handleGlobalClick, { capture: true });
    return () => document.removeEventListener('click', handleGlobalClick, { capture: true });
  }, []);

  const copyToClipboard = useCallback(
    (text: string, label: string) => {
      playSuccessSound();
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard
          .writeText(text)
          .then(() => showToast(`Copied ${label || text} to clipboard!`))
          .catch(() => fallbackCopy(text, label));
      } else {
        fallbackCopy(text, label);
      }

      function fallbackCopy(val: string, itemLabel: string) {
        try {
          const ta = document.createElement('textarea');
          ta.value = val;
          ta.style.position = 'fixed';
          ta.style.left = '-9999px';
          ta.style.top = '-9999px';
          document.body.appendChild(ta);
          ta.focus();
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          showToast(`Copied ${itemLabel || val} to clipboard!`);
        } catch {
          window.prompt('Copy to clipboard:', val);
        }
      }
    },
    [showToast]
  );

  const scrollToSection = useCallback(
    (sectionId: string) => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveSection(sectionId);
        showToast(`Navigated to #${sectionId}.py`);
      }
      setSidebarOpen(false);
    },
    [showToast]
  );

  // Active section detection via scroll position
  useEffect(() => {
    const sections = ['about', 'defense', 'projects', 'arsenal', 'credentials', 'contact'];
    const handleScroll = () => {
      const scrollY = window.scrollY + 140;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollY) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcut listener (Cmd/Ctrl + 1..6)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey && !e.altKey) {
        const sections = ['about', 'defense', 'projects', 'arsenal', 'credentials', 'contact'];
        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= 6) {
          e.preventDefault();
          scrollToSection(sections[num - 1]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scrollToSection]);

  return (
    <div className="font-body antialiased min-h-screen bg-[#090d16] text-[#f1f5f9] relative">
      {/* Ambient Workstation Background Visual Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-25" />
        <div className="absolute -top-32 right-0 w-[500px] h-[500px] rounded-full bg-[#06b6d4]/8 blur-[120px] ambient-glow-1" />
        <div className="absolute top-[40%] -left-32 w-[450px] h-[450px] rounded-full bg-[#10b981]/7 blur-[130px] ambient-glow-2" />
        <div className="absolute -bottom-32 right-[10%] w-[550px] h-[550px] rounded-full bg-[#8b5cf6]/7 blur-[140px] ambient-glow-1" />
      </div>

      {/* Interactive Technical Canvas (Circuit Mesh, Tactical Radar, Deep Sky, Live Coding) */}
      <InteractiveAtmosphere
        mode={atmosphereMode}
        onModeChange={setAtmosphereMode}
        isLight={
          theme === 'light' ||
          (theme === 'system' &&
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-color-scheme: light)').matches)
        }
      />

      {/* Global Toast Component */}
      <Toast message={toastMessage} visible={toastVisible} />

      {/* Persistent Left Sidebar */}
      <WorkstationSidebar
        activeSection={activeSection}
        onNavigate={scrollToSection}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onShowToast={showToast}
        presence={presence}
        theme={theme}
        onThemeChange={setTheme}
      />

      {/* Main Container Wrapper */}
      <div className="lg:pl-72 flex flex-col min-h-screen w-full">
        {/* Top Fixed Omnibar Header */}
        <WorkstationHeader
          activeSection={activeSection}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          onShowToast={showToast}
          atmosphereMode={atmosphereMode}
          onCycleAtmosphere={cycleAtmosphere}
          theme={theme}
          onThemeChange={setTheme}
          presence={presence}
          soundEnabled={soundActive}
          onToggleSound={toggleSound}
        />

        {/* Content Scroll View */}
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-28 flex flex-col gap-10">
          <AboutSection
            onNavigate={scrollToSection}
            onCopy={copyToClipboard}
            onShowToast={showToast}
          />

          <DefenseSection
            onCopy={copyToClipboard}
            onShowToast={showToast}
          />

          <ProjectsSection onShowToast={showToast} />

          <SkillsSection />

          <CredentialsSection />

          <ContactSection
            onCopy={copyToClipboard}
            onShowToast={showToast}
          />
        </main>

        {/* Fixed Status Footer */}
        <StatusFooter presence={presence} />
      </div>
    </div>
  );
}
