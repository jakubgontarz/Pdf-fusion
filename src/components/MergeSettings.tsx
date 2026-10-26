import React from 'react';
import type { MergeOptions, CompressionPreset } from '../types';
import type { Translations } from '../i18n/translations';
import { Sliders, Zap } from 'lucide-react';

interface MergeSettingsProps {
  t: Translations;
  options: MergeOptions;
  onChange: (updated: MergeOptions) => void;
}

export function MergeSettings({ t, options, onChange }: MergeSettingsProps) {
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
    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6 space-y-4 shadow-2xs transition-colors">
      <div className="flex items-center gap-2 pb-2.5 border-b border-neutral-200 dark:border-neutral-800">
        <Sliders className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
        <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
          {t.settings}
        </h4>
      </div>

      {/* Output File Name */}
      <div>
        <label htmlFor="output-filename" className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          {t.outputFileName}
        </label>
        <input
          id="output-filename"
          type="text"
          value={options.outputFileName}
          onChange={(e) => update({ outputFileName: e.target.value })}
          placeholder="scalony_dokument.pdf"
          className="w-full px-3 py-2 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white rounded-lg focus:bg-white dark:focus:bg-neutral-900 focus:outline-hidden focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white transition-colors select-text cursor-text"
        />
      </div>

      {/* Page Numbering Checkbox */}
      <div className="pt-1">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={options.addPageNumbers}
            onChange={(e) => update({ addPageNumbers: e.target.checked })}
            className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-600 text-neutral-900 focus:ring-neutral-900 cursor-pointer"
          />
          <span className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 font-medium">
            {t.addPageNumbers}
          </span>
        </label>

        {options.addPageNumbers && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mt-3 pl-2 sm:pl-6">
            <div>
              <span className="block text-2xs text-neutral-500 dark:text-neutral-400 mb-1">
                {t.format}
              </span>
              <select
                value={options.pageNumberFormat}
                onChange={(e) => update({ pageNumberFormat: e.target.value as any })}
                className="w-full px-2.5 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-md focus:outline-hidden"
              >
                <option value="strona-x-z-y">{t.pageFormatStrXofY}</option>
                <option value="x-of-y">{t.pageFormatXofY}</option>
                <option value="tylko-x">{t.pageFormatOnlyX}</option>
              </select>
            </div>

            <div>
              <span className="block text-2xs text-neutral-500 dark:text-neutral-400 mb-1">
                {t.position}
              </span>
              <select
                value={options.pageNumberPosition}
                onChange={(e) => update({ pageNumberPosition: e.target.value as any })}
                className="w-full px-2.5 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-md focus:outline-hidden"
              >
                <option value="bottom-center">{t.posBottomCenter}</option>
                <option value="bottom-right">{t.posBottomRight}</option>
                <option value="top-right">{t.posTopRight}</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Compression Checkbox & Expandable Panel */}
      <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={options.compress}
            onChange={(e) => update({ compress: e.target.checked })}
            className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-600 text-neutral-900 focus:ring-neutral-900 cursor-pointer"
          />
          <div className="flex items-center gap-1.5">
            <span className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 font-medium">
              {t.compressCheckbox}
            </span>
            <Zap className={`w-3.5 h-3.5 ${options.compress ? 'text-amber-500' : 'text-neutral-400'}`} />
          </div>
        </label>

        {/* Expanded Compression Options */}
        {options.compress && (
          <div className="mt-3.5 pl-3 sm:pl-6 space-y-4 border-l-2 border-neutral-200 dark:border-neutral-700 ml-1 sm:ml-2 py-1">
            {/* Presets with generous width and padding */}
            <div>
              <span className="block text-2xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-2">
                {t.compressionLevel}
              </span>
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={() => handlePresetChange('strong')}
                  title={t.presetStrong}
                  className={`px-1 sm:px-2.5 py-2 text-2xs sm:text-xs rounded-lg border text-center transition-all cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis ${
                    options.compressionPreset === 'strong'
                      ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white font-semibold shadow-xs'
                      : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                  }`}
                >
                  {t.presetStrong}
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetChange('balanced')}
                  title={t.presetBalanced}
                  className={`px-1 sm:px-2.5 py-2 text-2xs sm:text-xs rounded-lg border text-center transition-all cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis ${
                    options.compressionPreset === 'balanced'
                      ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white font-semibold shadow-xs'
                      : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                  }`}
                >
                  {t.presetBalanced}
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetChange('light')}
                  title={t.presetLight}
                  className={`px-1 sm:px-2.5 py-2 text-2xs sm:text-xs rounded-lg border text-center transition-all cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis ${
                    options.compressionPreset === 'light'
                      ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white font-semibold shadow-xs'
                      : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                  }`}
                >
                  {t.presetLight}
                </button>
              </div>
            </div>

            {/* Quality Slider */}
            <div>
              <div className="flex items-center justify-between text-xs text-neutral-700 dark:text-neutral-300 mb-1.5">
                <span>{t.imageQuality}</span>
                <span className="font-mono tabular-nums font-semibold text-neutral-900 dark:text-white">
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
                className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-neutral-900 dark:accent-white"
              />
              <div className="flex justify-between text-3xs text-neutral-400 dark:text-neutral-500 mt-1">
                <span>{t.smallerFile}</span>
                <span>{t.higherQuality}</span>
              </div>
            </div>

            {/* Remove metadata */}
            <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-700 dark:text-neutral-300 pt-1">
              <input
                type="checkbox"
                checked={options.removeMetadata}
                onChange={(e) => update({ removeMetadata: e.target.checked })}
                className="w-3.5 h-3.5 rounded border-neutral-300 dark:border-neutral-600 text-neutral-900"
              />
              <span>{t.removeMetadata}</span>
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
