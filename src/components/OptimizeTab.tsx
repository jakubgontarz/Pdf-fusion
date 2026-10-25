import React, { useState } from 'react';
import { Sparkles, FileText, Download, CheckCircle, Zap } from 'lucide-react';
import type { OptimizeOptions } from '../types';
import { optimizePdf, formatBytes, generateSamplePdf } from '../utils/pdfOperations';

export function OptimizeTab() {
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    buffer: ArrayBuffer;
    size: number;
  } | null>(null);

  const [options, setOptions] = useState<OptimizeOptions>({
    removeMetadata: true,
    flattenAnnotations: true,
    useObjectStreams: true,
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{
    pdfBytes: Uint8Array;
    originalSize: number;
    newSize: number;
    pageCount: number;
  } | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const buffer = await file.arrayBuffer();
    setSelectedFile({
      name: file.name,
      buffer,
      size: file.size,
    });
    setResult(null);
    e.target.value = '';
  };

  const handleLoadSample = async () => {
    setIsProcessing(true);
    try {
      const sampleBytes = await generateSamplePdf('Wielostronicowy Raport Techniczny', 'Architektura', 5, 'indigo');
      setSelectedFile({
        name: 'raport_techniczny_optymalizacja.pdf',
        buffer: sampleBytes.buffer as ArrayBuffer,
        size: sampleBytes.byteLength,
      });
      setResult(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOptimize = async () => {
    if (!selectedFile) return;
    try {
      setIsProcessing(true);
      const res = await optimizePdf(selectedFile.buffer, options);
      setResult(res);
    } catch (err: any) {
      alert(`Wystąpił błąd optymalizacji: ${err?.message || 'Nieznany błąd'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result || !selectedFile) return;
    const blob = new Blob([result.pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const baseName = selectedFile.name.replace(/\.pdf$/i, '');
    link.download = `${baseName}_zoptymalizowany.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const savingsPct =
    result && result.originalSize > 0
      ? Math.max(0, Math.round(((result.originalSize - result.newSize) / result.originalSize) * 100))
      : 0;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-neutral-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-neutral-900">
            Kompresja i optymalizacja plików PDF
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Zmniejsz rozmiar dokumentu poprzez kompresję strumieni danych i oczyszczenie nadmiarowych metadanych bezpośrednio w przeglądarce.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLoadSample}
          disabled={isProcessing}
          className="px-3.5 py-2 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 disabled:opacity-50"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Załaduj przykładowy PDF</span>
        </button>
      </div>

      {!selectedFile ? (
        <div className="rounded-xl border-2 border-dashed border-neutral-300 bg-white p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-neutral-100 text-neutral-600 flex items-center justify-center mx-auto mb-4">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-neutral-900 mb-1">
            Wybierz plik PDF do kompresji
          </h3>
          <p className="text-xs sm:text-sm text-neutral-500 mb-6 max-w-sm mx-auto">
            Plik zostanie przeanalizowany i skompresowany w 100% lokalnie bez wysyłania do sieci.
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* File details & options */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-700 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-neutral-900 truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-neutral-500 font-mono tabular-nums">
                    Rozmiar początkowy: {formatBytes(selectedFile.size)}
                  </p>
                </div>
              </div>

              <label className="text-xs text-neutral-600 hover:text-neutral-900 cursor-pointer font-medium underline">
                Zmień
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            <div className="space-y-3 pt-1">
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wide">
                Opcje optymalizacji
              </h4>

              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-neutral-700">
                <input
                  type="checkbox"
                  checked={options.useObjectStreams}
                  onChange={(e) => setOptions({ ...options, useObjectStreams: e.target.checked })}
                  className="w-4 h-4 rounded border-neutral-300 text-neutral-900"
                />
                <span>Użyj strumieni obiektów PDF (Object Streams)</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-neutral-700">
                <input
                  type="checkbox"
                  checked={options.removeMetadata}
                  onChange={(e) => setOptions({ ...options, removeMetadata: e.target.checked })}
                  className="w-4 h-4 rounded border-neutral-300 text-neutral-900"
                />
                <span>Usuń nieużywane metadane i sygnatury edycji</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-neutral-700">
                <input
                  type="checkbox"
                  checked={options.flattenAnnotations}
                  onChange={(e) => setOptions({ ...options, flattenAnnotations: e.target.checked })}
                  className="w-4 h-4 rounded border-neutral-300 text-neutral-900"
                />
                <span>Spłaszcz adnotacje i zoptymalizuj strukturę stron</span>
              </label>
            </div>

            <button
              type="button"
              onClick={handleOptimize}
              disabled={isProcessing}
              className="w-full py-2.5 text-xs sm:text-sm font-semibold text-white bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              <Zap className="w-4 h-4" />
              <span>{isProcessing ? 'Optymalizowanie dokumentu...' : 'Zoptymalizuj PDF'}</span>
            </button>
          </div>

          {/* Results card */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5 flex flex-col justify-between">
            <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wide pb-2 border-b border-neutral-200">
              Wynik kompresji
            </h4>

            {result ? (
              <div className="space-y-4 my-auto py-4">
                <div className="flex items-center gap-2 text-emerald-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-bold">Optymalizacja zakończona</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs bg-neutral-50 p-3.5 rounded-lg border border-neutral-200">
                  <div>
                    <span className="text-neutral-500 block">Przed:</span>
                    <span className="font-mono font-semibold text-neutral-800 text-sm">
                      {formatBytes(result.originalSize)}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Po optymalizacji:</span>
                    <span className="font-mono font-semibold text-emerald-700 text-sm">
                      {formatBytes(result.newSize)}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-neutral-600">
                  <span>Liczba stron: <strong className="font-mono">{result.pageCount}</strong></span>
                  {savingsPct > 0 && (
                    <span className="ml-3 text-emerald-700 font-semibold">
                      Zaoszczędzono: {savingsPct}%
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="w-full py-2.5 text-xs sm:text-sm font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Pobierz zoptymalizowany PDF</span>
                </button>
              </div>
            ) : (
              <div className="text-center py-12 text-neutral-400 text-xs">
                Kliknij „Zoptymalizuj PDF”, aby przeliczyć i skompresować plik w przeglądarce.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
