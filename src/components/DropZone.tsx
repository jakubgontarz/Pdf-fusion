import React, { useRef, useState } from 'react';
import { Upload } from 'lucide-react';

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void;
  isProcessing?: boolean;
}

export function DropZone({ onFilesSelected, isProcessing = false }: DropZoneProps) {
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
          ? 'border-neutral-900 bg-neutral-100'
          : 'border-neutral-300 hover:border-neutral-400 bg-white'
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
        <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-700 mb-3">
          <Upload className="w-5 h-5" />
        </div>

        <p className="text-sm font-semibold text-neutral-900 mb-1">
          Przeciągnij pliki PDF lub obrazy tutaj
        </p>
        <p className="text-xs text-neutral-500 mb-4">
          lub kliknij, aby wybrać z dysku (PDF, JPG, PNG)
        </p>

        <span className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors shadow-2xs">
          Wybierz pliki
        </span>
      </div>
    </div>
  );
}
