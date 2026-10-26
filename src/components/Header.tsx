import { ShieldCheck } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b border-neutral-200 bg-white sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold text-xs tracking-tight">
            PDF
          </div>
          <span className="text-base font-bold tracking-tight text-neutral-900">
            PDF Fusion
          </span>
        </div>

        {/* Local processing indicator */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-100 text-xs text-neutral-600">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Działa w 100% lokalnie</span>
        </div>
      </div>
    </header>
  );
}
