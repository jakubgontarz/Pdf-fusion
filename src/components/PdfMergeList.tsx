import { ArrowUp, ArrowDown, RotateCw, Trash2, ArrowUpDown, FileText } from 'lucide-react';
import type { PdfMergeItem } from '../types';
import { formatBytes } from '../utils/pdfOperations';

interface PdfMergeListProps {
  items: PdfMergeItem[];
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onRotate: (id: string) => void;
  onRemove: (id: string) => void;
  onUpdateRange: (id: string, range: string) => void;
  onReverseOrder: () => void;
  onClearAll: () => void;
}

export function PdfMergeList({
  items,
  onMoveUp,
  onMoveDown,
  onRotate,
  onRemove,
  onUpdateRange,
  onReverseOrder,
  onClearAll,
}: PdfMergeListProps) {
  const totalPages = items.reduce((acc, curr) => acc + curr.pageCount, 0);
  const totalBytes = items.reduce((acc, curr) => acc + curr.size, 0);

  return (
    <div className="space-y-4">
      {/* Batch toolbar */}
      <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-600">
          <span className="font-semibold text-neutral-900">{items.length} {items.length === 1 ? 'plik' : items.length < 5 ? 'pliki' : 'plików'}</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums font-mono text-xs">{totalPages} {totalPages === 1 ? 'strona' : 'stron łącznie'}</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums font-mono text-xs">{formatBytes(totalBytes)}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReverseOrder}
            className="px-2.5 py-1 text-xs font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Odwróć kolejność plików na liście"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Odwróć kolejność</span>
          </button>
          <button
            type="button"
            onClick={onClearAll}
            className="px-2.5 py-1 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
          >
            Wyczyść
          </button>
        </div>
      </div>

      {/* Items list */}
      <div className="space-y-2.5">
        {items.map((item, index) => {
          const isFirst = index === 0;
          const isLast = index === items.length - 1;

          return (
            <div
              key={item.id}
              className="group bg-white rounded-xl border border-neutral-200 hover:border-neutral-300 transition-all p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
            >
              {/* Left Zone: Index, Icon & Metadata */}
              <div className="flex items-center gap-3.5 min-w-0">
                <span className="w-6 text-center text-xs font-mono font-medium text-neutral-400 select-none">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div className="w-10 h-10 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-700 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-neutral-900 truncate" title={item.name}>
                    {item.name}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-neutral-500 mt-0.5">
                    <span className="tabular-nums font-mono">{item.pageCount} {item.pageCount === 1 ? 'strona' : 'stron'}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums font-mono">{formatBytes(item.size)}</span>
                    {item.rotation !== 0 && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-amber-700 font-mono text-2xs font-medium">Obrót: {item.rotation}°</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Zone: Controls (Page Range, Rotate, Order, Delete) */}
              <div className="flex items-center gap-2 sm:gap-3 self-end sm:self-auto shrink-0">
                {/* Page range configuration */}
                <div className="flex items-center gap-1.5 text-xs text-neutral-600">
                  <label htmlFor={`range-${item.id}`} className="hidden lg:inline text-neutral-500 whitespace-nowrap">
                    Strony:
                  </label>
                  <input
                    id={`range-${item.id}`}
                    type="text"
                    value={item.pageRange}
                    onChange={(e) => onUpdateRange(item.id, e.target.value)}
                    placeholder="Wszystkie lub np. 1-2"
                    title="Określ zakres stron (np. 'all', '1-3' lub '2, 4')"
                    className="w-24 sm:w-28 px-2 py-1 text-xs font-mono bg-neutral-50 border border-neutral-200 rounded-md focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                {/* Rotate button */}
                <button
                  type="button"
                  onClick={() => onRotate(item.id)}
                  title={`Obróć o 90° w prawo (obecnie: ${item.rotation}°)`}
                  className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors cursor-pointer"
                  aria-label={`Obróć plik ${item.name}`}
                >
                  <RotateCw className="w-4 h-4" />
                </button>

                {/* Reorder Up / Down */}
                <div className="flex items-center bg-neutral-100 rounded-md p-0.5">
                  <button
                    type="button"
                    onClick={() => onMoveUp(index)}
                    disabled={isFirst}
                    className="p-1 text-neutral-600 hover:text-neutral-900 disabled:opacity-30 disabled:hover:text-neutral-600 rounded cursor-pointer disabled:cursor-not-allowed transition-colors"
                    aria-label={`Przesuń ${item.name} w górę`}
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onMoveDown(index)}
                    disabled={isLast}
                    className="p-1 text-neutral-600 hover:text-neutral-900 disabled:opacity-30 disabled:hover:text-neutral-600 rounded cursor-pointer disabled:cursor-not-allowed transition-colors"
                    aria-label={`Przesuń ${item.name} w dół`}
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  title="Usuń plik z kolejki"
                  className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                  aria-label={`Usuń ${item.name}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
