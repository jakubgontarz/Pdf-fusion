import type { ActiveTool } from '../types';
import { ShieldCheck } from 'lucide-react';

interface HeaderProps {
  activeTool: ActiveTool;
  onSelectTool: (tool: ActiveTool) => void;
}

export function Header({ activeTool, onSelectTool }: HeaderProps) {
  return (
    <header className="border-b border-neutral-200 bg-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-xs">
            PDF
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-neutral-900 whitespace-nowrap">
              PDF Fusion
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Single-Line Interactive Tabs) */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1">
          <button
            type="button"
            onClick={() => onSelectTool('merge')}
            className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTool === 'merge'
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            Łączenie PDF
          </button>
          <button
            type="button"
            onClick={() => onSelectTool('image-to-pdf')}
            className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTool === 'image-to-pdf'
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            JPG / PNG do PDF
          </button>
          <button
            type="button"
            onClick={() => onSelectTool('compress')}
            className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTool === 'compress'
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            Kompresja PDF
          </button>
          <button
            type="button"
            onClick={() => onSelectTool('split')}
            className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTool === 'split'
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            Rozdzielanie stron
          </button>
        </nav>

        {/* Zone 3: Privacy Assurance Action */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-neutral-100 text-xs font-medium text-neutral-700">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
            <span className="whitespace-nowrap">Przetwarzanie 100% lokalne</span>
          </div>
        </div>
      </div>
    </header>
  );
}
