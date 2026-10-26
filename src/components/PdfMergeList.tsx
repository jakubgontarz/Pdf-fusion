import { ArrowUp, ArrowDown, RotateCw, Trash2, FileText, Image as ImageIcon, SlidersHorizontal } from 'lucide-react';
import type { MergeQueueItem } from '../types';
import { formatBytes } from '../utils/pdfOperations';

interface PdfMergeListProps {
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
      <div className="flex items-center justify-between pb-1.5 border-b border-neutral-200">
        <div className="flex items-center gap-2 text-xs text-neutral-600">
          <span className="font-semibold text-neutral-900">
            {items.length} {items.length === 1 ? 'plik' : items.length < 5 ? 'pliki' : 'plików'}
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums">
            {totalPages} {totalPages === 1 ? 'strona' : 'stron'}
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums">{formatBytes(totalBytes)}</span>
        </div>

        <button
          type="button"
          onClick={onClearAll}
          className="text-xs text-neutral-500 hover:text-red-600 transition-colors cursor-pointer"
        >
          Wyczyść listę
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
              className="bg-white rounded-xl border border-neutral-200 p-3 flex flex-col gap-2.5 shadow-2xs hover:border-neutral-300 transition-colors"
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
                      className="w-9 h-9 rounded-md object-cover border border-neutral-200 bg-neutral-100 shrink-0"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-md bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-700 shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-neutral-900 truncate" title={item.name}>
                      {item.name}
                    </p>
                    <div className="flex items-center gap-2 text-2xs text-neutral-500">
                      <span className="font-mono tabular-nums">
                        {item.pageCount} {item.pageCount === 1 ? 'strona' : 'stron'}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{formatBytes(item.size)}</span>
                      {item.rotation !== 0 && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-amber-700 font-mono">Obrót: {item.rotation}°</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* For PDF: Page range */}
                  {!isImage && (
                    <div className="flex items-center gap-1 text-xs text-neutral-500">
                      <label htmlFor={`range-${item.id}`} className="hidden sm:inline">
                        Strony:
                      </label>
                      <input
                        id={`range-${item.id}`}
                        type="text"
                        value={item.pageRange}
                        onChange={(e) => onUpdateRange(item.id, e.target.value)}
                        placeholder="all"
                        title="Zakres stron, np. all, 1-3 lub 1, 4"
                        className="w-16 sm:w-20 px-1.5 py-1 text-xs font-mono bg-neutral-50 border border-neutral-200 rounded-md focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-neutral-900 text-center"
                      />
                    </div>
                  )}

                  {/* Rotate button */}
                  <button
                    type="button"
                    onClick={() => onRotate(item.id)}
                    title={`Obróć o 90° (${item.rotation}°)`}
                    className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors cursor-pointer"
                    aria-label={`Obróć ${item.name}`}
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>

                  {/* Move Up / Down */}
                  <div className="flex items-center bg-neutral-100 rounded-md p-0.5">
                    <button
                      type="button"
                      onClick={() => onMoveUp(index)}
                      disabled={isFirst}
                      className="p-1 text-neutral-600 hover:text-neutral-900 disabled:opacity-30 rounded cursor-pointer"
                      aria-label="W górę"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onMoveDown(index)}
                      disabled={isLast}
                      className="p-1 text-neutral-600 hover:text-neutral-900 disabled:opacity-30 rounded cursor-pointer"
                      aria-label="W dół"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => onRemove(item.id)}
                    className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                    aria-label={`Usuń ${item.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Image specific layout controls */}
              {isImage && (
                <div className="pl-8 pt-2 border-t border-neutral-100 flex flex-wrap items-center gap-3 text-xs text-neutral-600">
                  <div className="flex items-center gap-1.5">
                    <span className="text-neutral-400">Format:</span>
                    <select
                      value={item.imagePageSize}
                      onChange={(e) =>
                        onUpdateImageOption(item.id, { imagePageSize: e.target.value as any })
                      }
                      className="px-2 py-0.5 text-xs bg-neutral-50 border border-neutral-200 rounded-md focus:outline-hidden"
                    >
                      <option value="a4">Strona A4</option>
                      <option value="fit">Dopasuj do zdjęcia</option>
                    </select>
                  </div>

                  {item.imagePageSize !== 'fit' && (
                    <>
                      <div className="flex items-center gap-1.5">
                        <span className="text-neutral-400">Orientacja:</span>
                        <select
                          value={item.imageOrientation}
                          onChange={(e) =>
                            onUpdateImageOption(item.id, { imageOrientation: e.target.value as any })
                          }
                          className="px-2 py-0.5 text-xs bg-neutral-50 border border-neutral-200 rounded-md focus:outline-hidden"
                        >
                          <option value="portrait">Pionowa</option>
                          <option value="landscape">Pozioma</option>
                          <option value="auto">Auto</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-neutral-400">Margines:</span>
                        <select
                          value={item.imageMargin}
                          onChange={(e) =>
                            onUpdateImageOption(item.id, { imageMargin: e.target.value as any })
                          }
                          className="px-2 py-0.5 text-xs bg-neutral-50 border border-neutral-200 rounded-md focus:outline-hidden"
                        >
                          <option value="none">Brak</option>
                          <option value="small">Mały</option>
                          <option value="normal">Standardowy</option>
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
