import { useEffect, useState } from 'react';
import { Download, CheckCircle, X, RefreshCw } from 'lucide-react';
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

  useEffect(() => {
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

  const finalSize = pdfBytes.byteLength;
  const savingsPct =
    originalBytes && originalBytes > finalSize
      ? Math.round(((originalBytes - finalSize) / originalBytes) * 100)
      : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-xs">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-2xl border border-neutral-200 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-neutral-900">
              Dokument został utworzony
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-700 rounded-md cursor-pointer"
            aria-label="Zamknij"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Metrics bar */}
        <div className="px-5 py-2.5 bg-neutral-50 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-neutral-500">Plik:</span>
            <span className="font-semibold text-neutral-900 truncate max-w-[200px]" title={fileName}>
              {fileName}
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono tabular-nums">
            <span>{pageCount} {pageCount === 1 ? 'strona' : 'stron'}</span>
            <span aria-hidden="true" className="text-neutral-300">·</span>
            <span>{formatBytes(finalSize)}</span>
            {savingsPct !== null && savingsPct > 0 && (
              <>
                <span aria-hidden="true" className="text-neutral-300">·</span>
                <span className="text-emerald-700 font-semibold">Zmniejszono o {savingsPct}%</span>
              </>
            )}
            {durationMs !== undefined && (
              <>
                <span aria-hidden="true" className="text-neutral-300">·</span>
                <span className="text-neutral-400">{durationMs} ms</span>
              </>
            )}
          </div>
        </div>

        {/* PDF Preview Frame */}
        <div className="flex-1 min-h-[360px] sm:min-h-[460px] p-3 bg-neutral-100 flex flex-col">
          {blobUrl ? (
            <iframe
              src={`${blobUrl}#toolbar=0&navpanes=0`}
              title="Podgląd PDF"
              className="w-full h-full flex-1 rounded-lg border border-neutral-300 bg-white"
            />
          ) : (
            <div className="flex items-center justify-center flex-1 text-xs text-neutral-400">
              Ładowanie podglądu...
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-neutral-200 flex items-center justify-between bg-white">
          <button
            type="button"
            onClick={onReset}
            className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Wyczyść i zacznij od nowa</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Pobierz plik PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
