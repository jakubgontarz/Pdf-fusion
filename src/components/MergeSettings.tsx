import React from 'react';
import type { MergeOptions, CompressionPreset } from '../types';
import { Sliders, Zap } from 'lucide-react';

interface MergeSettingsProps {
  options: MergeOptions;
  onChange: (updated: MergeOptions) => void;
}

export function MergeSettings({ options, onChange }: MergeSettingsProps) {
  const update = (partial: Partial<MergeOptions>) => {
    onChange({ ...options, ...partial });
  };

  const handlePresetChange = (preset: CompressionPreset) => {
    let quality = 65;
    let maxDim = 1600;
    if (preset === 'strong') {
      quality = 40;
      maxDim = 1200;
    } else if (preset === 'light') {
      quality = 85;
      maxDim = 2200;
    }
    update({
      compressionPreset: preset,
      compressionQuality: quality,
      maxImageDimension: maxDim,
    });
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-4 sm:p-5 space-y-4 shadow-2xs">
      <div className="flex items-center gap-2 pb-2 border-b border-neutral-200">
        <Sliders className="w-4 h-4 text-neutral-700" />
        <h4 className="text-xs sm:text-sm font-semibold text-neutral-900">Ustawienia</h4>
      </div>

      {/* Output File Name */}
      <div>
        <label htmlFor="output-filename" className="block text-xs font-medium text-neutral-700 mb-1">
          Nazwa pliku wynikowego
        </label>
        <input
          id="output-filename"
          type="text"
          value={options.outputFileName}
          onChange={(e) => update({ outputFileName: e.target.value })}
          placeholder="scalony_dokument.pdf"
          className="w-full px-3 py-1.5 text-xs sm:text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
        />
      </div>

      {/* Page Numbering Checkbox */}
      <div className="pt-1">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={options.addPageNumbers}
            onChange={(e) => update({ addPageNumbers: e.target.checked })}
            className="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 cursor-pointer"
          />
          <span className="text-xs sm:text-sm text-neutral-800 font-medium">
            Wstaw numerację stron
          </span>
        </label>

        {options.addPageNumbers && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2.5 pl-6">
            <div>
              <span className="block text-2xs text-neutral-500 mb-0.5">Format</span>
              <select
                value={options.pageNumberFormat}
                onChange={(e) => update({ pageNumberFormat: e.target.value as any })}
                className="w-full px-2 py-1 text-xs bg-neutral-50 border border-neutral-200 rounded-md focus:outline-hidden"
              >
                <option value="strona-x-z-y">Strona X z Y</option>
                <option value="x-of-y">X / Y</option>
                <option value="tylko-x">Tylko numer</option>
              </select>
            </div>

            <div>
              <span className="block text-2xs text-neutral-500 mb-0.5">Pozycja</span>
              <select
                value={options.pageNumberPosition}
                onChange={(e) => update({ pageNumberPosition: e.target.value as any })}
                className="w-full px-2 py-1 text-xs bg-neutral-50 border border-neutral-200 rounded-md focus:outline-hidden"
              >
                <option value="bottom-center">Dół, środek</option>
                <option value="bottom-right">Dół, prawo</option>
                <option value="top-right">Góra, prawo</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Compression Checkbox & Expandable Panel */}
      <div className="pt-2 border-t border-neutral-100">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={options.compress}
            onChange={(e) => update({ compress: e.target.checked })}
            className="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 cursor-pointer"
          />
          <div className="flex items-center gap-1.5">
            <span className="text-xs sm:text-sm text-neutral-800 font-medium">
              Kompresuj plik wynikowy
            </span>
            <Zap className={`w-3.5 h-3.5 ${options.compress ? 'text-amber-500' : 'text-neutral-400'}`} />
          </div>
        </label>

        {/* Expanded Compression Options */}
        {options.compress && (
          <div className="mt-3 pl-6 space-y-3.5 border-l-2 border-neutral-200 ml-2 py-1">
            {/* Presets */}
            <div>
              <span className="block text-2xs font-semibold text-neutral-600 uppercase tracking-wider mb-1.5">
                Poziom kompresji
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => handlePresetChange('strong')}
                  className={`px-2 py-1.5 text-xs rounded-md border text-center transition-colors cursor-pointer ${
                    options.compressionPreset === 'strong'
                      ? 'bg-neutral-900 text-white border-neutral-900 font-medium'
                      : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  Mocna
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetChange('balanced')}
                  className={`px-2 py-1.5 text-xs rounded-md border text-center transition-colors cursor-pointer ${
                    options.compressionPreset === 'balanced'
                      ? 'bg-neutral-900 text-white border-neutral-900 font-medium'
                      : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  Zrównoważona
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetChange('light')}
                  className={`px-2 py-1.5 text-xs rounded-md border text-center transition-colors cursor-pointer ${
                    options.compressionPreset === 'light'
                      ? 'bg-neutral-900 text-white border-neutral-900 font-medium'
                      : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  Lekka
                </button>
              </div>
            </div>

            {/* Quality Slider */}
            <div>
              <div className="flex items-center justify-between text-xs text-neutral-700 mb-1">
                <span>Jakość obrazów:</span>
                <span className="font-mono tabular-nums font-semibold text-neutral-900">
                  {options.compressionQuality}%
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="95"
                step="5"
                value={options.compressionQuality}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  update({ compressionQuality: val });
                }}
                className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-neutral-900"
              />
              <div className="flex justify-between text-3xs text-neutral-400 mt-0.5">
                <span>Mniejszy plik</span>
                <span>Wyższa jakość</span>
              </div>
            </div>

            {/* Remove metadata */}
            <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-700">
              <input
                type="checkbox"
                checked={options.removeMetadata}
                onChange={(e) => update({ removeMetadata: e.target.checked })}
                className="w-3.5 h-3.5 rounded border-neutral-300 text-neutral-900"
              />
              <span>Usuń zbędne metadane dokumentu</span>
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
