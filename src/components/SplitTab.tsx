import React, { useState } from 'react';
import { Scissors, FileText, Download, CheckCircle, Sparkles } from 'lucide-react';
import { splitPdf, formatBytes, generateSamplePdf } from '../utils/pdfOperations';
import { PDFDocument } from 'pdf-lib';

export function SplitTab() {
  const [file, setFile] = useState<{
    name: string;
    buffer: ArrayBuffer;
    size: number;
    pageCount: number;
  } | null>(null);

  const [splitMode, setSplitMode] = useState<'single' | 'range'>('single');
  const [rangeInput, setRangeInput] = useState('1-2');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<Array<{ filename: string; pdfBytes: Uint8Array; pageCount: number }> | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const f = e.target.files[0];
    const buffer = await f.arrayBuffer();
    const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
    setFile({
      name: f.name,
      buffer,
      size: f.size,
      pageCount: doc.getPageCount(),
    });
    setResults(null);
    e.target.value = '';
  };

  const handleLoadSample = async () => {
    setIsProcessing(true);
    try {
      const sample = await generateSamplePdf('Katalog Produktów', 'Katalog', 4, 'emerald');
      setFile({
        name: 'katalog_produktow_4strony.pdf',
        buffer: sample.buffer as ArrayBuffer,
        size: sample.byteLength,
        pageCount: 4,
      });
      setResults(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSplit = async () => {
    if (!file) return;
    try {
      setIsProcessing(true);
      const res = await splitPdf(file.buffer, file.name, splitMode, rangeInput);
      setResults(res);
    } catch (err: any) {
      alert(`Wystąpił błąd podziału: ${err?.message || 'Nieznany błąd'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadSingle = (item: { filename: string; pdfBytes: Uint8Array }) => {
    const blob = new Blob([item.pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = item.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-neutral-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-neutral-900">
            Rozdzielanie stron dokumentu PDF
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Wyodrębnij każdą stronę do osobnego pliku lub wyciągnij tylko wybrany zakres stron.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLoadSample}
          disabled={isProcessing}
          className="px-3.5 py-2 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 disabled:opacity-50"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Załaduj plik testowy</span>
        </button>
      </div>

      {!file ? (
        <div className="rounded-xl border-2 border-dashed border-neutral-300 bg-white p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-neutral-100 text-neutral-600 flex items-center justify-center mx-auto mb-4">
            <Scissors className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-neutral-900 mb-1">
            Wybierz plik PDF do rozdzielenia
          </h3>
          <p className="text-xs sm:text-sm text-neutral-500 mb-6 max-w-sm mx-auto">
            Wybierz dokument wielostronicowy, który chcesz podzielić na mniejsze pliki.
          </p>
          <label className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg cursor-pointer transition-colors inline-flex items-center gap-2">
            <span>Wybierz plik PDF</span>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Controls Column */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText className="w-5 h-5 text-neutral-700 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-neutral-900 truncate" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-xs text-neutral-500 font-mono tabular-nums">
                    {file.pageCount} stron · {formatBytes(file.size)}
                  </p>
                </div>
              </div>
              <label className="text-xs text-neutral-600 hover:text-neutral-900 cursor-pointer font-medium underline shrink-0">
                Zmień
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wide">
                Tryb podziału
              </label>

              <div className="space-y-2">
                <label className="flex items-center gap-2.5 text-xs text-neutral-700 cursor-pointer">
                  <input
                    type="radio"
                    name="split-mode"
                    value="single"
                    checked={splitMode === 'single'}
                    onChange={() => setSplitMode('single')}
                    className="w-4 h-4 text-neutral-900"
                  />
                  <span>Wyodrębnij każdą stronę jako osobny plik ({file.pageCount} plików)</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs text-neutral-700 cursor-pointer">
                  <input
                    type="radio"
                    name="split-mode"
                    value="range"
                    checked={splitMode === 'range'}
                    onChange={() => setSplitMode('range')}
                    className="w-4 h-4 text-neutral-900"
                  />
                  <span>Wyodrębnij określony zakres stron</span>
                </label>
              </div>

              {splitMode === 'range' && (
                <div className="pt-2">
                  <label htmlFor="range-selector-input" className="block text-xs text-neutral-600 mb-1">
                    Zakres stron (np. 1-2 lub 1, 3):
                  </label>
                  <input
                    id="range-selector-input"
                    type="text"
                    value={rangeInput}
                    onChange={(e) => setRangeInput(e.target.value)}
                    placeholder="np. 1-2"
                    className="w-full px-2.5 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:bg-white focus:outline-hidden"
                  />
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleSplit}
              disabled={isProcessing}
              className="w-full py-2.5 text-xs sm:text-sm font-semibold text-white bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              <Scissors className="w-4 h-4" />
              <span>{isProcessing ? 'Dzielenie...' : 'Rozdziel plik'}</span>
            </button>
          </div>

          {/* Results Column */}
          <div className="md:col-span-2 bg-white rounded-xl border border-neutral-200 p-5 flex flex-col justify-between">
            <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wide pb-2 border-b border-neutral-200">
              Wyodrębnione pliki {results ? `(${results.length})` : ''}
            </h4>

            {results && results.length > 0 ? (
              <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1 py-2">
                {results.map((res, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 bg-neutral-50/50 hover:bg-neutral-50 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="w-4 h-4 text-neutral-600 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-neutral-900 truncate" title={res.filename}>
                          {res.filename}
                        </p>
                        <p className="text-2xs text-neutral-500 font-mono tabular-nums">
                          {res.pageCount} {res.pageCount === 1 ? 'strona' : 'stron'} · {formatBytes(res.pdfBytes.byteLength)}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDownloadSingle(res)}
                      className="px-3 py-1.5 text-xs font-medium text-neutral-700 bg-white hover:bg-neutral-100 border border-neutral-200 rounded-md transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Pobierz</span>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-neutral-400 text-xs">
                Wybierz tryb i kliknij „Rozdziel plik”, aby wygenerować osobne dokumenty PDF.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
