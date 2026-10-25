import { useEffect, useState } from 'react';
import { Download, CheckCircle, RefreshCw, X, Eye } from 'lucide-react';
import { formatBytes } from '../utils/pdfOperations';

interface PdfResultModalProps {
  pdfBytes: Uint8Array;
  fileName: string;
  pageCount: number;
  originalBytes?: number;
  durationMs?: number;
  onClose: () => void;
  onReset: () => void;
}

export function PdfResultModal({
  pdfBytes,
  fileName,
  pageCount,
  originalBytes,
  durationMs,
  onClose,
  onReset,
}: PdfResultModalProps) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => {
    // Create blob URL for in-browser PDF preview and download
    const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    setBlobUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [pdfBytes]);

  const handleDownload = () => {
    if (!blobUrl) return;
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-4xl max-h-[92vh] rounded-2xl border border-neutral-200 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50">
          <div className="flex items-center gap-2.5">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="text-base font-bold text-neutral-900">
                Dokument gotowy do pobrania
              </h3>
              <p className="text-xs text-neutral-500">
                Plik został przetworzony w całości lokalnie w pamięci Twojej przeglądarki.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Zamknij okno"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Metrics Bar */}
        <div className="px-5 py-3 bg-neutral-100/70 border-b border-neutral-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-neutral-500 block">Nazwa pliku</span>
            <span className="font-semibold text-neutral-900 truncate block" title={fileName}>
              {fileName}
            </span>
          </div>

          <div>
            <span className="text-neutral-500 block">Liczba stron</span>
            <span className="font-semibold text-neutral-900 font-mono tabular-nums block">
              {pageCount} {pageCount === 1 ? 'strona' : 'stron'}
            </span>
          </div>

          <div>
            <span className="text-neutral-500 block">Rozmiar pliku</span>
            <span className="font-semibold text-neutral-900 font-mono tabular-nums block">
              {formatBytes(pdfBytes.byteLength)}
            </span>
          </div>

          {durationMs !== undefined && (
            <div>
              <span className="text-neutral-500 block">Czas generowania</span>
              <span className="font-semibold text-neutral-900 font-mono tabular-nums block">
                {durationMs} ms
              </span>
            </div>
          )}
        </div>

        {/* Modal Body: PDF Preview */}
        <div className="flex-1 min-h-[350px] sm:min-h-[480px] p-4 bg-neutral-200/50 flex flex-col">
          {blobUrl ? (
            <div className="w-full h-full flex-1 rounded-xl overflow-hidden border border-neutral-300 bg-neutral-100 shadow-inner">
              <iframe
                src={`${blobUrl}#toolbar=0&navpanes=0`}
                title="Podgląd wygenerowanego pliku PDF"
                className="w-full h-full min-h-[350px] sm:min-h-[450px] border-0"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center flex-1 text-sm text-neutral-500">
              Ładowanie podglądu...
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-3 bg-white">
          <button
            type="button"
            onClick={onReset}
            className="px-3.5 py-2 text-xs font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Scal kolejne dokumenty</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownload}
              className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Pobierz plik PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
