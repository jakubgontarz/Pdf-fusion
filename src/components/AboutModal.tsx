import React, { useEffect, useState } from 'react';
import {
  X,
  Info,
  User,
  Mail,
  Github,
  Scale,
  ShieldCheck,
  Check,
  Copy,
  ExternalLink,
  Cpu,
  Layers,
} from 'lucide-react';
import appIcon from '../pdf_fusion_icon.png';
import type { Translations } from '../i18n/translations';

interface AboutModalProps {
  t: Translations;
  isOpen: boolean;
  onClose: () => void;
}

export function AboutModal({ t, isOpen, onClose }: AboutModalProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText('jakubgontarz89@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 select-text"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-3 bg-neutral-50/50 dark:bg-neutral-900/50">
          <div className="flex items-center gap-2.5">
            <img
              src={appIcon}
              alt="PDF Fusion"
              className="w-7 h-7 rounded-lg object-contain shadow-2xs"
            />
            <div>
              <h2
                id="about-dialog-title"
                className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2"
              >
                <span>{t.aboutModalTitle}</span>
                <span className="text-2xs font-semibold px-1.5 py-0.5 rounded-md bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                  v1.2.0
                </span>
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t.closeBtn}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-neutral-700 dark:text-neutral-300">
          {/* Summary Banner */}
          <div className="p-3.5 rounded-xl bg-neutral-100/70 dark:bg-neutral-800/60 border border-neutral-200/70 dark:border-neutral-700/60 space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-neutral-900 dark:text-white text-xs">
              <Info className="w-4 h-4 text-neutral-600 dark:text-neutral-300 shrink-0" />
              <span>PDF Fusion</span>
            </div>
            <p className="text-2xs sm:text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {t.aboutSummary}
            </p>
          </div>

          {/* Author & Links */}
          <div className="space-y-2">
            <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 space-y-2.5">
              {/* Author */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
                  <User className="w-3.5 h-3.5" />
                  <span className="font-medium">{t.authorLabel}</span>
                </div>
                <span className="font-semibold text-neutral-900 dark:text-white">
                  Jakub Gontarz
                </span>
              </div>

              {/* Email */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
                  <Mail className="w-3.5 h-3.5" />
                  <span className="font-medium">{t.authorEmailLabel}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <a
                    href="mailto:jakubgontarz89@gmail.com"
                    className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    jakubgontarz89@gmail.com
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    title={t.copyEmailTooltip}
                    aria-label={t.copyEmailTooltip}
                    className="p-1 rounded text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    {copiedEmail ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* GitHub */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
                  <Github className="w-3.5 h-3.5" />
                  <span className="font-medium">{t.repoLabel}</span>
                </div>
                <a
                  href="https://github.com/jakubgontarz/Pdf-fusion"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <span>github.com/jakubgontarz/Pdf-fusion</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* License */}
          <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-neutral-900 dark:text-white">
              <Scale className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span>{t.licenseLabel} MIT</span>
            </div>
            <p className="text-2xs sm:text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {t.licenseText}
            </p>
          </div>

          {/* Local processing / Privacy */}
          <div className="p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-emerald-900 dark:text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{t.privacyTitle}</span>
            </div>
            <p className="text-2xs sm:text-xs text-emerald-800/90 dark:text-emerald-300/90 leading-relaxed">
              {t.privacyDetail}
            </p>
          </div>

          {/* Features list */}
          <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-neutral-900 dark:text-white">
              <Layers className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
              <span>{t.featuresTitle}</span>
            </div>
            <ul className="grid grid-cols-1 gap-1.5 text-2xs sm:text-xs text-neutral-600 dark:text-neutral-400 list-disc list-inside">
              {t.aboutFeatures.map((feat, idx) => (
                <li key={idx}>{feat}</li>
              ))}
            </ul>
          </div>

          {/* Technologies used */}
          <div className="flex items-center justify-between text-2xs text-neutral-400 dark:text-neutral-500 px-1 pt-1">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3 h-3" />
              {t.aboutEngine}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-neutral-100 dark:border-neutral-800 flex justify-end bg-neutral-50/50 dark:bg-neutral-900/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            {t.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
