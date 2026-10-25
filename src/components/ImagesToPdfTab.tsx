import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Trash2, FilePlus, Sparkles, Download, CheckCircle, Image as ImageIcon } from 'lucide-react';
import type { ImageToPdfItem, ImageToPdfOptions } from '../types';
import { convertImagesToPdf, formatBytes } from '../utils/pdfOperations';

export function ImagesToPdfTab() {
  const [images, setImages] = useState<ImageToPdfItem[]>([]);
  const [options, setOptions] = useState<ImageToPdfOptions>({
    pageSize: 'a4',
    orientation: 'portrait',
    margin: 'small',
    outputFileName: 'obrazy_zestaw.pdf',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{
    pdfBytes: Uint8Array;
    pageCount: number;
    size: number;
  } | null>(null);

  const handleFilesSelected = (files: File[]) => {
    const validFiles = files.filter((f) => f.type.startsWith('image/'));
    if (validFiles.length === 0) return;

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const newItem: ImageToPdfItem = {
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          name: file.name,
          size: file.size,
          dataUrl,
          type: file.type,
        };
        setImages((prev) => [...prev, newItem]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleLoadSampleImages = () => {
    // Generate two clean sample canvas images (e.g. document scan & photo)
    const samples: ImageToPdfItem[] = [];

    // Sample 1: Document Scan
    const canvas1 = document.createElement('canvas');
    canvas1.width = 800;
    canvas1.height = 1100;
    const ctx1 = canvas1.getContext('2d');
    if (ctx1) {
      ctx1.fillStyle = '#f8fafc';
      ctx1.fillRect(0, 0, 800, 1100);
      ctx1.fillStyle = '#0f172a';
      ctx1.font = 'bold 36px sans-serif';
      ctx1.fillText('FAKTURA / RACHUNEK #01', 50, 90);
      ctx1.fillStyle = '#64748b';
      ctx1.font = '22px sans-serif';
      ctx1.fillText('Data wystawienia: 2026-10-25', 50, 135);

      ctx1.strokeStyle = '#cbd5e1';
      ctx1.lineWidth = 2;
      ctx1.strokeRect(50, 180, 700, 300);

      ctx1.fillStyle = '#1e293b';
      ctx1.font = '20px sans-serif';
      ctx1.fillText('Pozycja 1: Usluga programistyczna i laczenie PDF', 70, 240);
      ctx1.fillText('Wartosc brutto: 1 500,00 PLN', 70, 290);
      ctx1.fillText('Status: Oplacono w calosci (Lokalnie)', 70, 340);

      samples.push({
        id: `sample-img-1-${Date.now()}`,
        name: 'skan_faktury.jpg',
        size: 85000,
        dataUrl: canvas1.toDataURL('image/jpeg', 0.9),
        type: 'image/jpeg',
      });
    }

    // Sample 2: Diagram / Landscape
    const canvas2 = document.createElement('canvas');
    canvas2.width = 1100;
    canvas2.height = 800;
    const ctx2 = canvas2.getContext('2d');
    if (ctx2) {
      ctx2.fillStyle = '#1e293b';
      ctx2.fillRect(0, 0, 1100, 800);
      ctx2.fillStyle = '#f8fafc';
      ctx2.font = 'bold 36px sans-serif';
      ctx2.fillText('DIAGRAM PROCESU KLIENTA', 60, 100);
      ctx2.fillStyle = '#94a3b8';
      ctx2.font = '20px sans-serif';
      ctx2.fillText('Schemat bezpiecznego laczenia plikow w przegladarce', 60, 150);

      ctx2.fillStyle = '#0284c7';
      ctx2.fillRect(60, 220, 280, 160);
      ctx2.fillStyle = '#ffffff';
      ctx2.font = 'bold 20px sans-serif';
      ctx2.fillText('Krok 1: Wybor plikow', 80, 280);

      ctx2.fillStyle = '#059669';
      ctx2.fillRect(410, 220, 280, 160);
      ctx2.fillStyle = '#ffffff';
      ctx2.fillText('Krok 2: pdf-lib (Local)', 430, 280);

      ctx2.fillStyle = '#4f46e5';
      ctx2.fillRect(760, 220, 280, 160);
      ctx2.fillStyle = '#ffffff';
      ctx2.fillText('Krok 3: Pobranie PDF', 780, 280);

      samples.push({
        id: `sample-img-2-${Date.now()}`,
        name: 'schemat_architektury.png',
        size: 92000,
        dataUrl: canvas2.toDataURL('image/png'),
        type: 'image/png',
      });
    }

    setImages((prev) => [...prev, ...samples]);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setImages((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[index - 1];
      copy[index - 1] = temp;
      return copy;
    });
  };

  const handleMoveDown = (index: number) => {
    if (index === images.length - 1) return;
    setImages((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[index + 1];
      copy[index + 1] = temp;
      return copy;
    });
  };

  const handleRemove = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleConvert = async () => {
    if (images.length === 0) return;
    try {
      setIsProcessing(true);
      const res = await convertImagesToPdf(images, options);
      setResult(res);
    } catch (err: any) {
      alert(`Wystąpił błąd: ${err?.message || 'Nie udało się przetworzyć obrazów.'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const blob = new Blob([result.pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = options.outputFileName.endsWith('.pdf') ? options.outputFileName : `${options.outputFileName}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Introduction banner */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-neutral-900">
            Konwersja obrazów JPG i PNG do pliku PDF
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Połącz zdjęcia paragonów, faktur, skanów lub grafik w jeden wielostronicowy dokument PDF.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg cursor-pointer transition-colors flex items-center gap-2 shrink-0">
            <FilePlus className="w-4 h-4" />
            <span>Dodaj zdjęcia</span>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => {
                if (e.target.files) handleFilesSelected(Array.from(e.target.files));
                e.target.value = '';
              }}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={handleLoadSampleImages}
            className="px-3.5 py-2 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Przykładowe grafiki</span>
          </button>
        </div>
      </div>

      {/* Main layout */}
      {images.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-neutral-300 bg-white p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-neutral-100 text-neutral-600 flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-neutral-900 mb-1">
            Brak dodanych obrazów
          </h3>
          <p className="text-xs sm:text-sm text-neutral-500 mb-6 max-w-sm mx-auto">
            Wybierz pliki JPG lub PNG ze swojego dysku lub kliknij przycisk poniżej, aby załadować przykłady.
          </p>
          <button
            type="button"
            onClick={handleLoadSampleImages}
            className="px-4 py-2 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors inline-flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Załaduj przykładowe obrazy do testu</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Images Grid (2 columns on lg) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
              <span className="text-xs text-neutral-600 font-medium">
                {images.length} {images.length === 1 ? 'obraz' : 'obrazów'} w kolejce (
                <span className="tabular-nums font-mono">
                  {formatBytes(images.reduce((acc, curr) => acc + curr.size, 0))}
                </span>
                )
              </span>
              <button
                type="button"
                onClick={() => setImages([])}
                className="text-xs text-red-600 hover:text-red-700 font-medium cursor-pointer"
              >
                Usuń wszystkie
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {images.map((img, idx) => (
                <div
                  key={img.id}
                  className="bg-white rounded-xl border border-neutral-200 p-3 flex flex-col justify-between gap-3 shadow-2xs"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={img.dataUrl}
                      alt={img.name}
                      className="w-16 h-16 rounded-lg object-cover border border-neutral-200 bg-neutral-50 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-2xs font-mono text-neutral-400 block">
                        Strona {idx + 1}
                      </span>
                      <p className="text-xs font-semibold text-neutral-900 truncate" title={img.name}>
                        {img.name}
                      </p>
                      <span className="text-xs text-neutral-500 font-mono tabular-nums block mt-0.5">
                        {formatBytes(img.size)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-xs">
                    <div className="flex items-center bg-neutral-100 rounded-md p-0.5">
                      <button
                        type="button"
                        onClick={() => handleMoveUp(idx)}
                        disabled={idx === 0}
                        className="p-1 text-neutral-600 hover:text-neutral-900 disabled:opacity-30 rounded cursor-pointer"
                        aria-label="W górę"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveDown(idx)}
                        disabled={idx === images.length - 1}
                        className="p-1 text-neutral-600 hover:text-neutral-900 disabled:opacity-30 rounded cursor-pointer"
                        aria-label="W dół"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemove(img.id)}
                      className="p-1 text-neutral-400 hover:text-red-600 rounded cursor-pointer"
                      aria-label="Usuń obraz"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Settings & Action column */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-neutral-200 p-5 space-y-4">
              <h4 className="text-sm font-semibold text-neutral-900 pb-2 border-b border-neutral-200">
                Parametry dokumentu PDF
              </h4>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Format strony
                </label>
                <select
                  value={options.pageSize}
                  onChange={(e) => setOptions({ ...options, pageSize: e.target.value as any })}
                  className="w-full px-2.5 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:bg-white focus:outline-hidden"
                >
                  <option value="a4">Standardowy A4</option>
                  <option value="fit">Dopasuj rozmiar do proporcji zdjęcia</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Orientacja strony
                </label>
                <select
                  value={options.orientation}
                  onChange={(e) => setOptions({ ...options, orientation: e.target.value as any })}
                  disabled={options.pageSize === 'fit'}
                  className="w-full px-2.5 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:bg-white focus:outline-hidden disabled:opacity-50"
                >
                  <option value="portrait">Pionowa (Portrait)</option>
                  <option value="landscape">Pozioma (Landscape)</option>
                  <option value="auto">Automatyczna (według proporcji zdjęcia)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Marginesy strony
                </label>
                <select
                  value={options.margin}
                  onChange={(e) => setOptions({ ...options, margin: e.target.value as any })}
                  disabled={options.pageSize === 'fit'}
                  className="w-full px-2.5 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:bg-white focus:outline-hidden disabled:opacity-50"
                >
                  <option value="none">Brak marginesu (pełne wypełnienie)</option>
                  <option value="small">Mały margines (20 pkt)</option>
                  <option value="normal">Standardowy margines (40 pkt)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Nazwa pliku wynikowego
                </label>
                <input
                  type="text"
                  value={options.outputFileName}
                  onChange={(e) => setOptions({ ...options, outputFileName: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:bg-white focus:outline-hidden"
                />
              </div>

              <button
                type="button"
                onClick={handleConvert}
                disabled={isProcessing}
                className="w-full mt-2 py-2.5 text-xs sm:text-sm font-semibold text-white bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {isProcessing ? 'Generowanie PDF...' : 'Utwórz plik PDF'}
              </button>
            </div>

            {/* Success card if generated */}
            {result && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-900 space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span className="text-xs font-bold">PDF wygenerowany pomyślnie!</span>
                </div>
                <div className="text-xs space-y-0.5 text-emerald-800 font-mono tabular-nums">
                  <p>Stron: {result.pageCount}</p>
                  <p>Rozmiar: {formatBytes(result.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="w-full py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Pobierz wygenerowany PDF</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
