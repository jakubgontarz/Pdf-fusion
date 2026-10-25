import React, { useRef, useState } from 'react';
import { Upload, Sparkles, FolderOpen } from 'lucide-react';

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void;
  onLoadSamples?: () => void;
  accept: string;
  title: string;
  subtitle: string;
  allowSamples?: boolean;
  isProcessing?: boolean;
}

export function DropZone({
  onFilesSelected,
  onLoadSamples,
  accept,
  title,
  subtitle,
  allowSamples = true,
  isProcessing = false,
}: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const dragCounter = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) {
      setIsDragOver(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    dragCounter.current = 0;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      onFilesSelected(filesArray);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(Array.from(e.target.files));
      // Reset input so re-selecting the same file works
      e.target.value = '';
    }
  };

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`relative rounded-xl border-2 border-dashed transition-all p-8 sm:p-12 text-center ${
        isDragOver
          ? 'border-neutral-900 bg-neutral-100/70 scale-[0.995]'
          : 'border-neutral-300 hover:border-neutral-400 bg-white'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        id="file-upload-input"
        disabled={isProcessing}
      />

      <div className="max-w-md mx-auto flex flex-col items-center">
        <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-700 mb-4">
          <Upload className="w-6 h-6" />
        </div>

        <h3 className="text-base sm:text-lg font-semibold text-neutral-900 mb-1">
          {title}
        </h3>

        <p className="text-xs sm:text-sm text-neutral-500 mb-6 leading-relaxed">
          {subtitle}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isProcessing}
            className="px-5 py-2.5 text-xs sm:text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
          >
            <FolderOpen className="w-4 h-4" />
            <span>Wybierz pliki z dysku</span>
          </button>

          {allowSamples && onLoadSamples && (
            <button
              type="button"
              onClick={onLoadSamples}
              disabled={isProcessing}
              className="px-4 py-2.5 text-xs sm:text-sm font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-neutral-700" />
              <span>Załaduj przykładowe pliki</span>
            </button>
          )}
        </div>

        <div className="mt-6 flex items-center gap-2 text-xs text-neutral-400">
          <span>Obsługiwane: {accept}</span>
          <span aria-hidden="true">·</span>
          <span>Brak limitu rozmiaru</span>
          <span aria-hidden="true">·</span>
          <span>100% lokalnie</span>
        </div>
      </div>
    </div>
  );
}
