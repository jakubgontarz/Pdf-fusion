import { useState, useRef, useEffect } from 'react';
import appIcon from '../pdf_fusion_icon.png';
import { Moon, Sun, Globe, Check, Info } from 'lucide-react';
import { type Language, availableLanguages, type Translations } from '../i18n/translations';
import { AboutModal } from './AboutModal';

interface HeaderProps {
  t: Translations;
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export function Header({
  t,
  currentLang,
  onLanguageChange,
  theme,
  onToggleTheme,
}: HeaderProps) {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 sticky top-0 z-30 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <img
            src={appIcon}
            alt="PDF Fusion"
            className="w-8 h-8 rounded-lg object-contain shadow-xs"
          />
          <span className="text-base font-bold tracking-tight text-neutral-900 dark:text-white">
            {t.appName}
          </span>
          <button
            type="button"
            onClick={() => setIsAboutOpen(true)}
            aria-label={t.aboutApp}
            title={t.aboutApp}
            className="w-7 h-7 rounded-full flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer ml-0.5"
          >
            <Info className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Right zone: Language picker, Theme toggle */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Language selector dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              aria-label={t.language}
              aria-expanded={langMenuOpen}
            >
              <Globe className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
              <span className="uppercase font-mono text-2xs font-semibold">{currentLang}</span>
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-36 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-lg py-1 z-50 animate-in fade-in zoom-in-95">
                {availableLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      onLanguageChange(lang.code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full px-3 py-1.5 text-xs text-left flex items-center justify-between transition-colors cursor-pointer ${
                      currentLang === lang.code
                        ? 'font-semibold text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-700/60'
                        : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700/30'
                    }`}
                  >
                    <span>{lang.label}</span>
                    {currentLang === lang.code && (
                      <Check className="w-3.5 h-3.5 text-neutral-900 dark:text-white" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dark / Light mode toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
            aria-label={t.themeToggle}
            title={theme === 'dark' ? t.lightMode : t.darkMode}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-neutral-600" />
            )}
          </button>
        </div>
      </div>

      <AboutModal
        t={t}
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
    </header>
  );
}
