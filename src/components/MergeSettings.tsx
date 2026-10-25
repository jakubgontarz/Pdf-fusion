import React from 'react';
import type { MergeOptions } from '../types';
import { Sliders } from 'lucide-react';

interface MergeSettingsProps {
  options: MergeOptions;
  onChange: (updated: MergeOptions) => void;
}

export function MergeSettings({ options, onChange }: MergeSettingsProps) {
  const update = (partial: Partial<MergeOptions>) => {
    onChange({ ...options, ...partial });
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-5 space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-neutral-200">
        <Sliders className="w-4 h-4 text-neutral-700" />
        <h4 className="text-sm font-semibold text-neutral-900">Ustawienia scalania</h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            className="w-full px-3 py-2 text-xs sm:text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
          />
        </div>

        {/* Document Title metadata */}
        <div>
          <label htmlFor="doc-title" className="block text-xs font-medium text-neutral-700 mb-1">
            Tytuł dokumentu (metadane)
          </label>
          <input
            id="doc-title"
            type="text"
            value={options.title || ''}
            onChange={(e) => update({ title: e.target.value })}
            placeholder="np. Komplet dokumentów 2024"
            className="w-full px-3 py-2 text-xs sm:text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
          />
        </div>
      </div>

      {/* Page Numbering Option */}
      <div className="pt-2 border-t border-neutral-100">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={options.addPageNumbers}
            onChange={(e) => update({ addPageNumbers: e.target.checked })}
            className="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 cursor-pointer"
          />
          <span className="text-xs sm:text-sm font-medium text-neutral-800">
            Wstaw numerację stron w scalonym dokumencie
          </span>
        </label>

        {options.addPageNumbers && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pl-6">
            <div>
              <label htmlFor="page-format" className="block text-xs text-neutral-500 mb-1">
                Format numeracji
              </label>
              <select
                id="page-format"
                value={options.pageNumberFormat}
                onChange={(e) => update({ pageNumberFormat: e.target.value as any })}
                className="w-full px-2.5 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-md focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
              >
                <option value="strona-x-z-y">Strona X z Y (np. Strona 1 z 12)</option>
                <option value="x-of-y">X / Y (np. 1 / 12)</option>
                <option value="tylko-x">Tylko numer (np. 1)</option>
              </select>
            </div>

            <div>
              <label htmlFor="page-position" className="block text-xs text-neutral-500 mb-1">
                Położenie numeru
              </label>
              <select
                id="page-position"
                value={options.pageNumberPosition}
                onChange={(e) => update({ pageNumberPosition: e.target.value as any })}
                className="w-full px-2.5 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-md focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
              >
                <option value="bottom-center">Na dole, pośrodku</option>
                <option value="bottom-right">Na dole, po prawej</option>
                <option value="top-right">Na górze, po prawej</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
