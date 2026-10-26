import React, { useState } from 'react';
import {
  ArrowUp,
  ArrowDown,
  RotateCw,
  Trash2,
  FileText,
  GripVertical,
  AlertCircle,
} from 'lucide-react';
import type { MergeQueueItem } from '../types';
import { formatBytes, validatePageRange } from '../utils/pdfOperations';
import {
  type Translations,
  type Language,
  formatFilesCount,
  formatPagesCount,
} from '../i18n/translations';

interface PdfMergeListProps {
  t: Translations;
  currentLang: Language;
  items: MergeQueueItem[];
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onReorder: (sourceIndex: number, targetIndex: number) => void;
  onRotate: (id: string) => void;
  onRemove: (id: string) => void;
  onUpdateRange: (id: string, range: string) => void;
  onUpdateImageOption: (id: string, partial: Partial<MergeQueueItem>) => void;
  onClearAll: () => void;
}

interface PdfMergeListItemProps {
  item: MergeQueueItem;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  isDragging: boolean;
  isDragOver: boolean;
  currentLang: Language;
  t: Translations;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDragLeave: (e: React.DragEvent, index: number) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  onDragEnd: () => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onRotate: (id: string) => void;
  onRemove: (id: string) => void;
  onUpdateRange: (id: string, range: string) => void;
  onUpdateImageOption: (id: string, partial: Partial<MergeQueueItem>) => void;
}

function PdfMergeListItem({
  item,
  index,
  isFirst,
  isLast,
  isDragging,
  isDragOver,
  currentLang,
  t,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  onMoveUp,
  onMoveDown,
  onRotate,
  onRemove,
  onUpdateRange,
  onUpdateImageOption,
}: PdfMergeListItemProps) {
  // Draggable is false by default so all inputs and text are natively selectable.
  // It is only enabled when interacting with the drag handle or non-interactive card space.
  const [isDraggable, setIsDraggable] = useState(false);
  const isImage = item.type === 'image';

  // Validate page range for PDF items
  const rangeValidation = !isImage
    ? validatePageRange(item.pageRange, item.pageCount)
    : { isValid: true, indices: [] };

  const handleCardPointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('input, textarea, select, button, a, [data-no-drag="true"]')) {
      setIsDraggable(false);
    } else {
      setIsDraggable(true);
    }
  };

  return (
    <div
      key={item.id}
      draggable={isDraggable}
      onPointerDown={handleCardPointerDown}
      onPointerUp={() => {
        if (!isDragging) setIsDraggable(false);
      }}
      onDragStart={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest('input, textarea, select, button, [data-no-drag="true"]')) {
          e.preventDefault();
          return;
        }
        onDragStart(e, index);
      }}
      onDragOver={(e) => onDragOver(e, index)}
      onDragLeave={(e) => onDragLeave(e, index)}
      onDrop={(e) => {
        setIsDraggable(false);
        onDrop(e, index);
      }}
      onDragEnd={() => {
        setIsDraggable(false);
        onDragEnd();
      }}
      className={`bg-white dark:bg-neutral-900 rounded-xl border p-3 flex flex-col gap-2.5 shadow-2xs transition-all ${
        isDragging
          ? 'opacity-40 border-dashed border-neutral-400 dark:border-neutral-600'
          : isDragOver
          ? 'border-neutral-900 dark:border-white ring-2 ring-neutral-900/15 dark:ring-white/20 scale-[1.01]'
          : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left: Drag Handle, Index, Icon/Thumb & Details */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Drag Handle */}
          <div
            className="p-1 text-neutral-400 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-200 cursor-grab active:cursor-grabbing shrink-0"
            title={t.dragToReorder}
            onMouseEnter={() => setIsDraggable(true)}
            onMouseLeave={() => {
              if (!isDragging) setIsDraggable(false);
            }}
            onMouseDown={() => setIsDraggable(true)}
          >
            <GripVertical className="w-4 h-4" />
          </div>

          <span className="w-5 text-center text-xs font-mono text-neutral-400 select-none hidden sm:inline">
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

          <div className="min-w-0 select-text">
            <p className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-white truncate select-text" title={item.name}>
              {item.name}
            </p>
            <div className="flex items-center gap-2 text-2xs text-neutral-500 dark:text-neutral-400 select-text">
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
          {/* For PDF: Page range input with validation */}
          {!isImage && (
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                <label htmlFor={`range-${item.id}`} className="hidden md:inline select-none">
                  {t.pages}
                </label>
                <input
                  id={`range-${item.id}`}
                  type="text"
                  data-no-drag="true"
                  value={item.pageRange}
                  onChange={(e) => onUpdateRange(item.id, e.target.value)}
                  onMouseEnter={() => setIsDraggable(false)}
                  onFocus={() => setIsDraggable(false)}
                  placeholder={t.allPagesPlaceholder}
                  title={t.pages}
                  className={`w-20 sm:w-24 px-2 py-1 text-xs font-mono rounded-md text-center transition-colors focus:outline-hidden focus:ring-1 select-text cursor-text ${
                    !rangeValidation.isValid
                      ? 'border-red-500 dark:border-red-400 bg-red-50/60 dark:bg-red-950/30 text-red-900 dark:text-red-200 focus:ring-red-500'
                      : 'bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:bg-white dark:focus:bg-neutral-900 focus:ring-neutral-900 dark:focus:ring-white border'
                  }`}
                />
              </div>

              {/* Warning label if invalid */}
              {!rangeValidation.isValid && (
                <div className="flex items-center gap-1 text-3xs font-medium text-red-600 dark:text-red-400 animate-in fade-in select-none">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>
                    {rangeValidation.errorType === 'out_of_range'
                      ? t.rangeErrorOutOfRange.replace('{max}', String(item.pageCount))
                      : t.rangeErrorFormat}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Rotate button */}
          <button
            type="button"
            onClick={() => onRotate(item.id)}
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
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
              onMouseDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              disabled={isFirst}
              className="p-1 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white disabled:opacity-30 rounded cursor-pointer"
              aria-label={`${t.moveUp} ${item.name}`}
            >
              <ArrowUp className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => onMoveDown(index)}
              onMouseDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
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
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            className="p-1.5 text-neutral-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors cursor-pointer"
            aria-label={`${t.remove} ${item.name}`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Image specific layout controls */}
      {isImage && (
        <div
          data-no-drag="true"
          onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          className="pl-6 sm:pl-8 pt-2 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap items-center gap-3 text-xs text-neutral-600 dark:text-neutral-300"
        >
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
}

export function PdfMergeList({
  t,
  currentLang,
  items,
  onMoveUp,
  onMoveDown,
  onReorder,
  onRotate,
  onRemove,
  onUpdateRange,
  onUpdateImageOption,
  onClearAll,
}: PdfMergeListProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const totalPages = items.reduce((acc, curr) => {
    if (curr.type === 'pdf') {
      const val = validatePageRange(curr.pageRange, curr.pageCount);
      return acc + (val.isValid ? val.indices.length : curr.pageCount);
    }
    return acc + curr.pageCount;
  }, 0);

  const totalBytes = items.reduce((acc, curr) => acc + curr.size, 0);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    const target = e.target as HTMLElement;
    if (target.closest('input, textarea, select, button, [data-no-drag="true"]')) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.effectAllowed = 'move';
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    // Only react to list item dragging, ignore text selection drags
    if (draggedIndex === null) return;
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = (_e: React.DragEvent, index: number) => {
    if (dragOverIndex === index) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null) return;
    if (draggedIndex !== targetIndex) {
      onReorder(draggedIndex, targetIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

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

      {/* Items List with Drag & Drop */}
      <div className="space-y-2.5">
        {items.map((item, index) => {
          const isFirst = index === 0;
          const isLast = index === items.length - 1;
          const isDragging = draggedIndex === index;
          const isDragOver = dragOverIndex === index && draggedIndex !== index;

          return (
            <PdfMergeListItem
              key={item.id}
              item={item}
              index={index}
              isFirst={isFirst}
              isLast={isLast}
              isDragging={isDragging}
              isDragOver={isDragOver}
              currentLang={currentLang}
              t={t}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onDragEnd={handleDragEnd}
              onMoveUp={onMoveUp}
              onMoveDown={onMoveDown}
              onRotate={onRotate}
              onRemove={onRemove}
              onUpdateRange={onUpdateRange}
              onUpdateImageOption={onUpdateImageOption}
            />
          );
        })}
      </div>
    </div>
  );
}
