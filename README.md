# PDF Fusion · Lokalne Narzędzie PDF

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Privacy: 100% Client--Side](https://img.shields.io/badge/Privacy-100%25_Client--Side-10B981.svg)](#prywatność-i-bezpieczeństwo)

**PDF Fusion** to nowoczesna, minimalistyczna i w 100% prywatna aplikacja webowa do scalania dokumentów PDF oraz obrazów (JPG, PNG, WebP) bezpośrednio w Twojej przeglądarce.

Żadne pliki, obrazy ani metadane nigdy nie są przesyłane na serwer zewnętrzny — całe przetwarzanie odbywa się lokalnie w pamięci RAM urządzenia dzięki silnikowi `pdf-lib`.

---

## ✨ Główne funkcje (Key Features)

- 🔒 **100% Prywatności i Działanie Offline**:
  - Brak przesyłania plików na serwer.
  - Dokumenty nie opuszczają Twojego urządzenia.
  - Pełne bezpieczeństwo poufnych umów, dokumentacji medycznej i finansowej.

- 📑 **Wspólna kolejka dla plików PDF oraz obrazów**:
  - Łącz dokumenty PDF ze zdjęciami dokumentów, faktur czy wykresów (JPG, PNG, WebP) w jeden finalny plik PDF.
  - Zmieniaj kolejność elementów metodą góra/dół.

- 🖼️ **Indywidualna konfiguracja arkuszy ze zdjęć**:
  - **Format strony**: A4 lub dopasowanie do wymiarów zdjęcia.
  - **Orientacja**: Pionowa, Pozioma lub Automatyczna (na podstawie proporcji grafiki).
  - **Marginesy**: Brak, Mały (20 pkt) lub Standardowy (40 pkt).

- 🔄 **Obracanie i selekcja stron**:
  - Obracanie poszczególnych dokumentów lub zdjęć o 90° w prawo.
  - Wybór zakresu stron dla plików PDF (np. `all`, `1-3`, `2, 4-6`).

- ⚡ **Opcjonalna kompresja i optymalizacja**:
  - Checkbox **„Kompresuj plik wynikowy”** z rozwijanym panelem parametrów.
  - Profile kompresji: **Mocna** (~40% jakości), **Zrównoważona** (~65% jakości) oraz **Lekka** (~85% jakości).
  - Płynny suwak jakości obrazów (20% – 95%).
  - Automatyczne usuwanie zbędnych metadanych i włączanie strumieni obiektów PDF (*Object Streams*).

- 🔢 **Automatyczna numeracja stron**:
  - Opcjonalne stemplowanie numeracji w wygenerowanym dokumencie.
  - Formaty: `Strona X z Y`, `X / Y`, `Tylko numer`.
  - Pozycje: dół-środek, dół-prawo, góra-prawo.

- 🌓 **Tryb ciemny / jasny (Dark Mode)**:
  - Przełącznik motywu w pasku nagłówka.
  - Automatyczne zapamiętywanie wyboru w `localStorage` oraz obsługa preferencji systemowych.

- 🌐 **Wielojęzyczność (Multilingual)**:
  - Obsługa 5 języków: **Polski (PL)**, **English (EN)**, **Deutsch (DE)**, **Español (ES)**, **Français (FR)**.
  - Automatyczne dopasowanie do języka systemu operacyjnego/przeglądarki przy pierwszym uruchomieniu.
  - Zapamiętywanie wybranego języka w pamięci przeglądarki.

- 👁️ **Podgląd i natychmiastowe pobieranie**:
  - Wbudowany podgląd wygenerowanego pliku PDF w oknie dialogowym.
  - Prezentacja liczby stron, rozmiaru i czasu generowania oraz procentu redukcji wagi.

---

## 🛠️ Stos technologiczny (Tech Stack)

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Style**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Silnik PDF**: [pdf-lib](https://pdf-lib.js.org/) (przetwarzanie w JavaScript bez zewnętrznych zależności)
- **Ikony**: [Lucide React](https://lucide.dev/)
- **Testy jednostkowe**: Wbudowany runner `node:test` + `tsx`

---

## 🚀 Uruchomienie lokalne (Getting Started)

### Wymagania wstępne
- [Node.js](https://nodejs.org/) (wersja 20 lub nowsza)
- npm / yarn / pnpm

### Krok po kroku

1. **Sklonuj repozytorium**:
   ```bash
   git clone https://github.com/twoj-login/pdf-fusion.git
   cd pdf-fusion
   ```

2. **Zainstaluj zależności**:
   ```bash
   npm install
   ```

3. **Uruchom serwer deweloperski**:
   ```bash
   npm run dev
   ```
   Aplikacja będzie dostępna pod adresem: `http://localhost:3000`

4. **Uruchomienie testów jednostkowych**:
   ```bash
   npx tsx --test src/utils/pdfOperations.test.ts
   ```

5. **Budowanie wersji produkcyjnej**:
   ```bash
   npm run build
   ```
   Pliki produkcyjne zostaną wygenerowane w folderze `dist/` i mogą być hostowane na dowolnym statycznym hostingu (np. GitHub Pages, Vercel, Netlify, Cloudflare Pages).

---

## 🛡️ Prywatność i Bezpieczeństwo

Większość internetowych konwerterów PDF przesyła Twoje pliki na zewnętrzne serwery, gdzie są przetwarzane i tymczasowo przechowywane. 

**PDF Fusion działa w zupełnie inny sposób:**
- Wszystkie operacje (odczyt bajtów, parsowanie struktury PDF, dekodowanie i kompresja obrazów, stemplowanie tekstu oraz zapis pliku) wykonują się **wyłącznie po stronie klienta** w pamięci Twojej przeglądarki.
- Brak jakiegokolwiek kodu telemetrycznego czy zewnętrznych endpointów analitycznych.
- Aplikacja działa poprawnie nawet po całkowitym odłączeniu połączenia z Internetem (tryb offline).

---

## 📄 Licencja

Projekt udostępniany na licencji [MIT](LICENSE). Możesz go swobodnie używać, modyfikować i wdrażać zarówno do celów prywatnych, jak i komercyjnych.
