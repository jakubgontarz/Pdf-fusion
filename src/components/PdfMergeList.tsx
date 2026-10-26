import { ArrowUp, ArrowDown, RotateCw, Trash2, FileText } from 'lucide-react';
import type { MergeQueueItem } from '../types';
import { formatBytes } from '../utils/pdfOperations';
import { type Translations, type Language, formatFilesCount, formatPagesCount } from '../i18n/translations';

interface PdfMergeListProps {
  t: Translations;
  currentLang: Language;
  items: MergeQueueItem[];
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onRotate: (id: string) => void;
  onRemove: (id: string) => void;
  onUpdateRange: (id: string, range: string) => void;
  onUpdateImageOption: (id: string, partial: Partial<MergeQueueItem>) => void;
  onClearAll: () => void;
}

export function PdfMergeList({
  t,
  currentLang,
  items,
  onMoveUp,
  onMoveDown,
  onRotate,
  onRemove,
  onUpdateRange,
  onUpdateImageOption,
  onClearAll,
}: PdfMergeListProps) {
  const totalPages = items.reduce((acc, curr) => acc + curr.pageCount, 0);
  const totalBytes = items.reduce((acc, curr) => acc + curr.size, 0);

  return (
    <div className="space-y-3">
      {/* List header info */}
      <div className="flex items-center justify-between pb-1.5 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
          <span className="font-semibold text-neutral-900 dark:text-white">
            {formatFilesCount(items.length, currentLang)}
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums">
            {formatPagesCount(totalPages, currentLang)}
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums">{formatBytes(totalBytes)}</span>
        </div>

        <button
          type="button"
          onClick={onClearAll}
          className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
        >
          {t.clearList}
        </button>
      </div>

      {/* Items */}
      <div className="space-y-2">
        {items.map((item, index) => {
          const isFirst = index === 0;
          const isLast = index === items.length - 1;
          const isImage = item.type === 'image';

          return (
            <div
              key={item.id}
              className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-3 flex flex-col gap-2.5 shadow-2xs hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
            >
              <div className="flex items-center justify-between gap-3">
                {/* Left: Index, Icon/Thumb & Details */}
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-5 text-center text-xs font-mono text-neutral-400 select-none">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  {isImage && item.dataUrl ? (
                    <img
                      src={item.dataUrl}
                      alt={item.name}
                      className="w-9 h-9 rounded-md object-cover border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 shrink-0"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-700 dark:text-neutral-300 shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-white truncate" title={item.name}>
                      {item.name}
                    </p>
                    <div className="flex items-center gap-2 text-2xs text-neutral-500 dark:text-neutral-400">
                      <span className="font-mono tabular-nums">
                        {formatPagesCount(item.pageCount, currentLang)}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{formatBytes(item.size)}</span>
                      {item.rotation !== 0 && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-amber-600 dark:text-amber-400 font-mono">
                            {t.rotationLabel} {item.rotation}°
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* For PDF: Page range */}
                  {!isImage && (
                    <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                      <label htmlFor={`range-${item.id}`} className="hidden sm:inline">
                        {t.pages}
                      </label>
                      <input
                        id={`range-${item.id}`}
                        type="text"
                        value={item.pageRange}
                        onChange={(e) => onUpdateRange(item.id, e.target.value)}
                        placeholder={t.pagesPlaceholder}
                        title={t.pages}
                        className="w-16 sm:w-20 px-1.5 py-1 text-xs font-mono bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white rounded-md focus:bg-white dark:focus:bg-neutral-900 focus:outline-hidden focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white text-center"
                      />
                    </div>
                  )}

                  {/* Rotate button */}
                  <button
                    type="button"
                    onClick={() => onRotate(item.id)}
                    title={`${t.rotate} (${item.rotation}°)`}
                    className="p-1.5 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors cursor-pointer"
                    aria-label={`${t.rotate} ${item.name}`}
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>

                  {/* Move Up / Down */}
                  <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 rounded-md p-0.5">
                    <button
                      type="button"
                      onClick={() => onMoveUp(index)}
                      disabled={isFirst}
                      className="p-1 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white disabled:opacity-30 rounded cursor-pointer"
                      aria-label={`${t.moveUp} ${item.name}`}
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onMoveDown(index)}
                      disabled={isLast}
                      className="p-1 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white disabled:opacity-30 rounded cursor-pointer"
                      aria-label={`${t.moveDown} ${item.name}`}
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => onRemove(item.id)}
                    className="p-1.5 text-neutral-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors cursor-pointer"
                    aria-label={`${t.remove} ${item.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Image specific layout controls */}
              {isImage && (
                <div className="pl-8 pt-2 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap items-center gap-3 text-xs text-neutral-600 dark:text-neutral-300">
                  <div className="flex items-center gap-1.5">
                    <span className="text-neutral-400">{t.imageFormat}</span>
                    <select
                      value={item.imagePageSize}
                      onChange={(e) =>
                        onUpdateImageOption(item.id, { imagePageSize: e.target.value as any })
                      }
                      className="px-2 py-0.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md text-neutral-800 dark:text-neutral-200 focus:outline-hidden"
                    >
                      <option value="a4">{t.imageFormatA4}</option>
                      <option value="fit">{t.imageFormatFit}</option>
                    </select>
                  </div>

                  {item.imagePageSize !== 'fit' && (
                    <>
                      <div className="flex items-center gap-1.5">
                        <span className="text-neutral-400">{t.orientation}</span>
                        <select
                          value={item.imageOrientation}
                          onChange={(e) =>
                            onUpdateImageOption(item.id, { imageOrientation: e.target.value as any })
                          }
                          className="px-2 py-0.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md text-neutral-800 dark:text-neutral-200 focus:outline-hidden"
                        >
                          <option value="portrait">{t.orientationPortrait}</option>
                          <option value="landscape">{t.orientationLandscape}</option>
                          <option value="auto">{t.orientationAuto}</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-neutral-400">{t.margin}</span>
                        <select
                          value={item.imageMargin}
                          onChange={(e) =>
                            onUpdateImageOption(item.id, { imageMargin: e.target.value as any })
                          }
                          className="px-2 py-0.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md text-neutral-800 dark:text-neutral-200 focus:outline-hidden"
                        >
                          <option value="none">{t.marginNone}</option>
                          <option value="small">{t.marginSmall}</option>
                          <option value="normal">{t.marginNormal}</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
