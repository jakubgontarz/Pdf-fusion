/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import type { ActiveTool, PdfMergeItem, MergeOptions } from './types';
import { generateSamplePdf, mergePdfs, formatBytes } from './utils/pdfOperations';
import { Header } from './components/Header';
import { DropZone } from './components/DropZone';
import { PdfMergeList } from './components/PdfMergeList';
import { MergeSettings } from './components/MergeSettings';
import { PdfResultModal } from './components/PdfResultModal';
import { ImagesToPdfTab } from './components/ImagesToPdfTab';
import { OptimizeTab } from './components/OptimizeTab';
import { SplitTab } from './components/SplitTab';
import { Layers, ShieldCheck, Cpu, ArrowRight } from 'lucide-react';

export default function App() {
  const [activeTool, setActiveTool] = useState<ActiveTool>('merge');
  const [items, setItems] = useState<PdfMergeItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mergeOptions, setMergeOptions] = useState<MergeOptions>({
    outputFileName: 'scalony_dokument.pdf',
    addPageNumbers: false,
    pageNumberPosition: 'bottom-center',
    pageNumberFormat: 'strona-x-z-y',
    title: 'Scalony Dokument PDF',
    author: '',
  });

  const [mergeResult, setMergeResult] = useState<{
    pdfBytes: Uint8Array;
    fileName: string;
    pageCount: number;
    originalBytes: number;
    durationMs: number;
  } | null>(null);

  const handleFilesSelected = async (files: File[]) => {
    const pdfFiles = files.filter(
      (f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
    );

    if (pdfFiles.length === 0) return;

    setIsProcessing(true);
    try {
      const newItems: PdfMergeItem[] = [];

      for (const file of pdfFiles) {
        const buffer = await file.arrayBuffer();
        try {
          const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
          newItems.push({
            id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            name: file.name,
            size: file.size,
            buffer,
            pageCount: doc.getPageCount(),
            pageRange: 'all',
            rotation: 0,
          });
        } catch (e) {
          console.error(`Nie udało się wczytać pliku: ${file.name}`, e);
        }
      }

      setItems((prev) => [...prev, ...newItems]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLoadSamples = async () => {
    setIsProcessing(true);
    try {
      const sample1 = await generateSamplePdf('Raport Finansowy 2024', 'Finanse', 2, 'slate');
      const sample2 = await generateSamplePdf('Specyfikacja Projektu', 'Inzynieria', 3, 'indigo');
      const sample3 = await generateSamplePdf('Aneks i Zgody', 'Prawne', 1, 'emerald');

      const demoItems: PdfMergeItem[] = [
        {
          id: `demo-1-${Date.now()}`,
          name: 'Raport_Finansowy_2024.pdf',
          size: sample1.byteLength,
          buffer: sample1.buffer as ArrayBuffer,
          pageCount: 2,
          pageRange: 'all',
          rotation: 0,
        },
        {
          id: `demo-2-${Date.now()}`,
          name: 'Specyfikacja_Techniczna.pdf',
          size: sample2.byteLength,
          buffer: sample2.buffer as ArrayBuffer,
          pageCount: 3,
          pageRange: 'all',
          rotation: 0,
        },
        {
          id: `demo-3-${Date.now()}`,
          name: 'Aneks_Porozumienie.pdf',
          size: sample3.byteLength,
          buffer: sample3.buffer as ArrayBuffer,
          pageCount: 1,
          pageRange: 'all',
          rotation: 0,
        },
      ];

      setItems((prev) => [...prev, ...demoItems]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setItems((prev) => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[index - 1];
      updated[index - 1] = temp;
      return updated;
    });
  };

  const handleMoveDown = (index: number) => {
    if (index === items.length - 1) return;
    setItems((prev) => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[index + 1];
      updated[index + 1] = temp;
      return updated;
    });
  };

  const handleRotate = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, rotation: (item.rotation + 90) % 360 } : item
      )
    );
  };

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateRange = (id: string, range: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, pageRange: range } : item))
    );
  };

  const handleReverseOrder = () => {
    setItems((prev) => [...prev].reverse());
  };

  const handleClearAll = () => {
    setItems([]);
  };

  const handleExecuteMerge = async () => {
    if (items.length === 0) return;

    setIsProcessing(true);
    const startTime = performance.now();

    try {
      const result = await mergePdfs(items, mergeOptions);
      const durationMs = Math.round(performance.now() - startTime);

      setMergeResult({
        pdfBytes: result.pdfBytes,
        fileName: mergeOptions.outputFileName || 'scalony_dokument.pdf',
        pageCount: result.pageCount,
        originalBytes: items.reduce((acc, curr) => acc + curr.size, 0),
        durationMs,
      });
    } catch (error: any) {
      alert(`Wystąpił błąd podczas łączenia: ${error?.message || 'Nieznany błąd'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const totalPagesSelected = items.reduce((acc, curr) => acc + curr.pageCount, 0);

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col text-neutral-900 font-sans">
      <Header activeTool={activeTool} onSelectTool={setActiveTool} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* MERGE TAB */}
        {activeTool === 'merge' && (
          <div className="space-y-8">
            {/* Context headline area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-neutral-200">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
                  Łączenie plików PDF
                </h1>
                <p className="text-sm text-neutral-500 mt-1 max-w-2xl">
                  Połącz wiele dokumentów PDF w jeden uporządkowany plik. Zmieniaj kolejność stron, obracaj arkusze i dodawaj numerację w 100% lokalnie w przeglądarce.
                </p>
              </div>

              {items.length > 0 && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleExecuteMerge}
                    disabled={isProcessing}
                    className="px-6 py-2.5 text-sm font-semibold text-white bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Layers className="w-4 h-4" />
                    <span>{isProcessing ? 'Scalanie w toku...' : 'Połącz pliki PDF'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Empty state with DropZone */}
            {items.length === 0 ? (
              <div className="space-y-6">
                <DropZone
                  onFilesSelected={handleFilesSelected}
                  onLoadSamples={handleLoadSamples}
                  accept=".pdf,application/pdf"
                  title="Przeciągnij i upuść pliki PDF tutaj"
                  subtitle="lub kliknij poniższy przycisk, aby wybrać dokumenty ze swojego komputera"
                  allowSamples={true}
                  isProcessing={isProcessing}
                />

                {/* Privacy & Speed Pillars */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                  <div className="bg-white rounded-xl border border-neutral-200 p-5 space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-800">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-semibold text-neutral-900">100% Prywatności</h3>
                    <p className="text-xs text-neutral-500 leading-relaxed">
                      Twoje pliki nigdy nie opuszczają Twojego urządzenia. Wszystkie operacje wykonuje silnik WebAssembly bezpośrednio w przeglądarce.
                    </p>
                  </div>

                  <div className="bg-white rounded-xl border border-neutral-200 p-5 space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-800">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-semibold text-neutral-900">Brak limitu rozmiaru</h3>
                    <p className="text-xs text-neutral-500 leading-relaxed">
                      Brak ograniczeń serwerowych. Możesz łączyć zarówno małe formularze, jak i wielkie opracowania techniczne bez kolejek.
                    </p>
                  </div>

                  <div className="bg-white rounded-xl border border-neutral-200 p-5 space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-800">
                      <Layers className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-semibold text-neutral-900">Pełna kontrola</h3>
                    <p className="text-xs text-neutral-500 leading-relaxed">
                      Wybieraj konkretne zakresy stron (np. 1-3, 5), obracaj pojedyncze dokumenty o 90° oraz automatycznie numeruj strony.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* Populated Workspace: 2-column layout */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left 2 cols: Files Queue & Drop zone to add more */}
                <div className="lg:col-span-2 space-y-6">
                  <PdfMergeList
                    items={items}
                    onMoveUp={handleMoveUp}
                    onMoveDown={handleMoveDown}
                    onRotate={handleRotate}
                    onRemove={handleRemove}
                    onUpdateRange={handleUpdateRange}
                    onReverseOrder={handleReverseOrder}
                    onClearAll={handleClearAll}
                  />

                  {/* Add more files secondary drop zone */}
                  <div className="pt-2">
                    <DropZone
                      onFilesSelected={handleFilesSelected}
                      accept=".pdf,application/pdf"
                      title="Dodaj kolejne pliki PDF"
                      subtitle="Przeciągnij kolejne dokumenty, aby dołączyć je do kolejki scalania"
                      allowSamples={false}
                      isProcessing={isProcessing}
                    />
                  </div>
                </div>

                {/* Right col: Merge Settings & Primary Action */}
                <div className="space-y-6">
                  <MergeSettings options={mergeOptions} onChange={setMergeOptions} />

                  <div className="bg-white rounded-xl border border-neutral-200 p-5 space-y-4">
                    <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wide">
                      Podsumowanie scalania
                    </h4>

                    <div className="space-y-2 text-xs text-neutral-600">
                      <div className="flex justify-between py-1 border-b border-neutral-100">
                        <span>Liczba dokumentów:</span>
                        <span className="font-semibold text-neutral-900 font-mono tabular-nums">
                          {items.length}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-neutral-100">
                        <span>Łącznie stron źródłowych:</span>
                        <span className="font-semibold text-neutral-900 font-mono tabular-nums">
                          {totalPagesSelected}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-neutral-100">
                        <span>Łączny rozmiar:</span>
                        <span className="font-semibold text-neutral-900 font-mono tabular-nums">
                          {formatBytes(items.reduce((acc, curr) => acc + curr.size, 0))}
                        </span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span>Numeracja stron:</span>
                        <span className="font-medium text-neutral-700">
                          {mergeOptions.addPageNumbers ? 'Włączona' : 'Wyłączona'}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleExecuteMerge}
                      disabled={isProcessing}
                      className="w-full py-3 text-sm font-semibold text-white bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                    >
                      <Layers className="w-4 h-4" />
                      <span>{isProcessing ? 'Przetwarzanie w toku...' : 'Połącz pliki teraz'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* IMAGE TO PDF TAB */}
        {activeTool === 'image-to-pdf' && <ImagesToPdfTab />}

        {/* COMPRESSION TAB */}
        {activeTool === 'compress' && <OptimizeTab />}

        {/* SPLIT TAB */}
        {activeTool === 'split' && <SplitTab />}
      </main>

      {/* Result Modal for Merge */}
      {mergeResult && (
        <PdfResultModal
          pdfBytes={mergeResult.pdfBytes}
          fileName={mergeResult.fileName}
          pageCount={mergeResult.pageCount}
          originalBytes={mergeResult.originalBytes}
          durationMs={mergeResult.durationMs}
          onClose={() => setMergeResult(null)}
          onReset={() => {
            setMergeResult(null);
            setItems([]);
          }}
        />
      )}

      {/* Quiet Footer */}
      <footer className="border-t border-neutral-200 bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-800">PDF Fusion</span>
            <span aria-hidden="true">·</span>
            <span>Bezpieczne narzędzia PDF w Twojej przeglądarce</span>
          </div>
          <div>
            <span>Wszystkie operacje wykonywane są lokalnie na Twoim komputerze.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
