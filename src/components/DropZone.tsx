import React, { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import type { Translations } from '../i18n/translations';

interface DropZoneProps {
  t: Translations;
  onFilesSelected: (files: File[]) => void;
  isProcessing?: boolean;
}

export function DropZone({ t, onFilesSelected, isProcessing = false }: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const dragCounter = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const isFilesDrag = (e: React.DragEvent) => {
    return e.dataTransfer.types && Array.from(e.dataTransfer.types).includes('Files');
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isFilesDrag(e)) return;
    dragCounter.current += 1;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isFilesDrag(e)) return;
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDragOver(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isFilesDrag(e)) {
      e.dataTransfer.dropEffect = 'none';
      return;
    }
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    dragCounter.current = 0;

    if (!isFilesDrag(e)) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(Array.from(e.target.files));
      e.target.value = '';
    }
  };

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`rounded-xl border-2 border-dashed transition-all p-8 sm:p-10 text-center cursor-pointer ${
        isDragOver
          ? 'border-neutral-900 dark:border-white bg-neutral-100 dark:bg-neutral-800'
          : 'border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600 bg-white dark:bg-neutral-900'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".pdf,application/pdf,image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        onChange={handleFileChange}
        className="hidden"
        disabled={isProcessing}
      />

      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-700 dark:text-neutral-300 mb-3">
          <Upload className="w-5 h-5" />
        </div>

        <p className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">
          {t.dropTitle}
        </p>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
          {t.dropSubtitle}
        </p>

        <span className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 rounded-lg transition-colors shadow-2xs">
          {t.selectFiles}
        </span>
      </div>
    </div>
  );
}
