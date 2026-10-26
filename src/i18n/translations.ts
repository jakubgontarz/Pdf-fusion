export type Language = 'pl' | 'en' | 'de' | 'es' | 'fr';

export interface Translations {
  appName: string;
  localBadge: string;
  dropTitle: string;
  dropSubtitle: string;
  selectFiles: string;
  clearList: string;
  fileSingular: string;
  fileFew: string;
  fileMany: string;
  pageSingular: string;
  pagePlural: string;
  pages: string;
  pagesPlaceholder: string;
  rotate: string;
  moveUp: string;
  moveDown: string;
  remove: string;
  imageFormat: string;
  imageFormatA4: string;
  imageFormatFit: string;
  orientation: string;
  orientationPortrait: string;
  orientationLandscape: string;
  orientationAuto: string;
  margin: string;
  marginNone: string;
  marginSmall: string;
  marginNormal: string;
  settings: string;
  outputFileName: string;
  addPageNumbers: string;
  format: string;
  position: string;
  pageFormatStrXofY: string;
  pageFormatXofY: string;
  pageFormatOnlyX: string;
  posBottomCenter: string;
  posBottomRight: string;
  posTopRight: string;
  compressCheckbox: string;
  compressionLevel: string;
  presetStrong: string;
  presetBalanced: string;
  presetLight: string;
  imageQuality: string;
  smallerFile: string;
  higherQuality: string;
  removeMetadata: string;
  mergeButton: string;
  processing: string;
  modalTitle: string;
  modalFile: string;
  savings: string;
  downloadPdf: string;
  clearAndReset: string;
  themeToggle: string;
  language: string;
  lightMode: string;
  darkMode: string;
  rotationLabel: string;
}

export const translations: Record<Language, Translations> = {
  pl: {
    appName: 'PDF Fusion',
    localBadge: 'Działa w 100% lokalnie',
    dropTitle: 'Przeciągnij pliki PDF lub obrazy tutaj',
    dropSubtitle: 'lub kliknij, aby wybrać z dysku (PDF, JPG, PNG)',
    selectFiles: 'Wybierz pliki',
    clearList: 'Wyczyść listę',
    fileSingular: 'plik',
    fileFew: 'pliki',
    fileMany: 'plików',
    pageSingular: 'strona',
    pagePlural: 'stron',
    pages: 'Strony:',
    pagesPlaceholder: 'all lub np. 1-3',
    rotate: 'Obróć o 90°',
    moveUp: 'W górę',
    moveDown: 'W dół',
    remove: 'Usuń',
    imageFormat: 'Format:',
    imageFormatA4: 'Strona A4',
    imageFormatFit: 'Dopasuj do zdjęcia',
    orientation: 'Orientacja:',
    orientationPortrait: 'Pionowa',
    orientationLandscape: 'Pozioma',
    orientationAuto: 'Auto',
    margin: 'Margines:',
    marginNone: 'Brak',
    marginSmall: 'Mały',
    marginNormal: 'Standardowy',
    settings: 'Ustawienia',
    outputFileName: 'Nazwa pliku wynikowego',
    addPageNumbers: 'Wstaw numerację stron',
    format: 'Format',
    position: 'Pozycja',
    pageFormatStrXofY: 'Strona X z Y',
    pageFormatXofY: 'X / Y',
    pageFormatOnlyX: 'Tylko numer',
    posBottomCenter: 'Dół, środek',
    posBottomRight: 'Dół, prawo',
    posTopRight: 'Góra, prawo',
    compressCheckbox: 'Kompresuj plik wynikowy',
    compressionLevel: 'Poziom kompresji',
    presetStrong: 'Mocna',
    presetBalanced: 'Zrównoważona',
    presetLight: 'Lekka',
    imageQuality: 'Jakość obrazów:',
    smallerFile: 'Mniejszy plik',
    higherQuality: 'Wyższa jakość',
    removeMetadata: 'Usuń zbędne metadane dokumentu',
    mergeButton: 'Połącz pliki w jeden PDF',
    processing: 'Przetwarzanie...',
    modalTitle: 'Dokument został utworzony',
    modalFile: 'Plik:',
    savings: 'Zmniejszono o',
    downloadPdf: 'Pobierz plik PDF',
    clearAndReset: 'Wyczyść i zacznij od nowa',
    themeToggle: 'Przełącz motyw',
    language: 'Język',
    lightMode: 'Jasny',
    darkMode: 'Ciemny',
    rotationLabel: 'Obrót:',
  },
  en: {
    appName: 'PDF Fusion',
    localBadge: '100% local processing',
    dropTitle: 'Drag & drop PDF files or images here',
    dropSubtitle: 'or click to browse from device (PDF, JPG, PNG)',
    selectFiles: 'Select files',
    clearList: 'Clear list',
    fileSingular: 'file',
    fileFew: 'files',
    fileMany: 'files',
    pageSingular: 'page',
    pagePlural: 'pages',
    pages: 'Pages:',
    pagesPlaceholder: 'all or e.g. 1-3',
    rotate: 'Rotate 90°',
    moveUp: 'Move up',
    moveDown: 'Move down',
    remove: 'Remove',
    imageFormat: 'Page size:',
    imageFormatA4: 'A4 Page',
    imageFormatFit: 'Fit to image',
    orientation: 'Orientation:',
    orientationPortrait: 'Portrait',
    orientationLandscape: 'Landscape',
    orientationAuto: 'Auto',
    margin: 'Margin:',
    marginNone: 'None',
    marginSmall: 'Small',
    marginNormal: 'Standard',
    settings: 'Settings',
    outputFileName: 'Output file name',
    addPageNumbers: 'Add page numbers',
    format: 'Format',
    position: 'Position',
    pageFormatStrXofY: 'Page X of Y',
    pageFormatXofY: 'X / Y',
    pageFormatOnlyX: 'Number only',
    posBottomCenter: 'Bottom, center',
    posBottomRight: 'Bottom, right',
    posTopRight: 'Top, right',
    compressCheckbox: 'Compress output file',
    compressionLevel: 'Compression level',
    presetStrong: 'Strong',
    presetBalanced: 'Balanced',
    presetLight: 'Light',
    imageQuality: 'Image quality:',
    smallerFile: 'Smaller file',
    higherQuality: 'Higher quality',
    removeMetadata: 'Remove redundant document metadata',
    mergeButton: 'Merge files into one PDF',
    processing: 'Processing...',
    modalTitle: 'Document created successfully',
    modalFile: 'File:',
    savings: 'Reduced by',
    downloadPdf: 'Download PDF file',
    clearAndReset: 'Clear and start over',
    themeToggle: 'Toggle theme',
    language: 'Language',
    lightMode: 'Light',
    darkMode: 'Dark',
    rotationLabel: 'Rotation:',
  },
  de: {
    appName: 'PDF Fusion',
    localBadge: '100% lokale Verarbeitung',
    dropTitle: 'PDF-Dateien oder Bilder hierher ziehen',
    dropSubtitle: 'oder klicken, um vom Gerät auszuwählen (PDF, JPG, PNG)',
    selectFiles: 'Dateien auswählen',
    clearList: 'Liste leeren',
    fileSingular: 'Datei',
    fileFew: 'Dateien',
    fileMany: 'Dateien',
    pageSingular: 'Seite',
    pagePlural: 'Seiten',
    pages: 'Seiten:',
    pagesPlaceholder: 'alle oder z. B. 1-3',
    rotate: 'Um 90° drehen',
    moveUp: 'Nach oben',
    moveDown: 'Nach unten',
    remove: 'Entfernen',
    imageFormat: 'Format:',
    imageFormatA4: 'A4-Seite',
    imageFormatFit: 'An Bild anpassen',
    orientation: 'Ausrichtung:',
    orientationPortrait: 'Hochformat',
    orientationLandscape: 'Querformat',
    orientationAuto: 'Auto',
    margin: 'Rand:',
    marginNone: 'Keiner',
    marginSmall: 'Schmal',
    marginNormal: 'Standard',
    settings: 'Einstellungen',
    outputFileName: 'Name der Ausgabedatei',
    addPageNumbers: 'Seitenzahlen hinzufügen',
    format: 'Format',
    position: 'Position',
    pageFormatStrXofY: 'Seite X von Y',
    pageFormatXofY: 'X / Y',
    pageFormatOnlyX: 'Nur Zahl',
    posBottomCenter: 'Unten, Mitte',
    posBottomRight: 'Unten, rechts',
    posTopRight: 'Oben, rechts',
    compressCheckbox: 'Ausgabedatei komprimieren',
    compressionLevel: 'Komprimierungsstufe',
    presetStrong: 'Stark',
    presetBalanced: 'Ausgewogen',
    presetLight: 'Leicht',
    imageQuality: 'Bildqualität:',
    smallerFile: 'Kleinere Datei',
    higherQuality: 'Höhere Qualität',
    removeMetadata: 'Überflüssige Metadaten entfernen',
    mergeButton: 'Dateien zu einem PDF zusammenfügen',
    processing: 'Verarbeitung...',
    modalTitle: 'Dokument wurde erstellt',
    modalFile: 'Datei:',
    savings: 'Verkleinert um',
    downloadPdf: 'PDF-Datei herunterladen',
    clearAndReset: 'Leeren und neu anfangen',
    themeToggle: 'Design umschalten',
    language: 'Sprache',
    lightMode: 'Hell',
    darkMode: 'Dunkel',
    rotationLabel: 'Drehung:',
  },
  es: {
    appName: 'PDF Fusion',
    localBadge: 'Procesamiento 100% local',
    dropTitle: 'Arrastra archivos PDF o imágenes aquí',
    dropSubtitle: 'o haz clic para seleccionar (PDF, JPG, PNG)',
    selectFiles: 'Seleccionar archivos',
    clearList: 'Limpiar lista',
    fileSingular: 'archivo',
    fileFew: 'archivos',
    fileMany: 'archivos',
    pageSingular: 'página',
    pagePlural: 'páginas',
    pages: 'Páginas:',
    pagesPlaceholder: 'todas o ej. 1-3',
    rotate: 'Girar 90°',
    moveUp: 'Subir',
    moveDown: 'Bajar',
    remove: 'Eliminar',
    imageFormat: 'Formato:',
    imageFormatA4: 'Página A4',
    imageFormatFit: 'Ajustar a imagen',
    orientation: 'Orientación:',
    orientationPortrait: 'Vertical',
    orientationLandscape: 'Horizontal',
    orientationAuto: 'Auto',
    margin: 'Margen:',
    marginNone: 'Ninguno',
    marginSmall: 'Pequeño',
    marginNormal: 'Estándar',
    settings: 'Ajustes',
    outputFileName: 'Nombre del archivo final',
    addPageNumbers: 'Insertar números de página',
    format: 'Formato',
    position: 'Posición',
    pageFormatStrXofY: 'Página X de Y',
    pageFormatXofY: 'X / Y',
    pageFormatOnlyX: 'Solo número',
    posBottomCenter: 'Abajo, centro',
    posBottomRight: 'Abajo, derecha',
    posTopRight: 'Arriba, derecha',
    compressCheckbox: 'Comprimir archivo final',
    compressionLevel: 'Nivel de compresión',
    presetStrong: 'Fuerte',
    presetBalanced: 'Equilibrada',
    presetLight: 'Ligera',
    imageQuality: 'Calidad de imagen:',
    smallerFile: 'Archivo menor',
    higherQuality: 'Mayor calidad',
    removeMetadata: 'Eliminar metadatos innecesarios',
    mergeButton: 'Combinar archivos en un PDF',
    processing: 'Procesando...',
    modalTitle: 'Documento generado con éxito',
    modalFile: 'Archivo:',
    savings: 'Reducido un',
    downloadPdf: 'Descargar archivo PDF',
    clearAndReset: 'Limpiar y reiniciar',
    themeToggle: 'Cambiar tema',
    language: 'Idioma',
    lightMode: 'Claro',
    darkMode: 'Oscuro',
    rotationLabel: 'Giro:',
  },
  fr: {
    appName: 'PDF Fusion',
    localBadge: 'Traitement 100% local',
    dropTitle: 'Glissez des fichiers PDF ou images ici',
    dropSubtitle: 'ou cliquez pour parcourir (PDF, JPG, PNG)',
    selectFiles: 'Choisir des fichiers',
    clearList: 'Vider la liste',
    fileSingular: 'fichier',
    fileFew: 'fichiers',
    fileMany: 'fichiers',
    pageSingular: 'page',
    pagePlural: 'pages',
    pages: 'Pages :',
    pagesPlaceholder: 'toutes ou ex. 1-3',
    rotate: 'Pivoter de 90°',
    moveUp: 'Monter',
    moveDown: 'Descendre',
    remove: 'Supprimer',
    imageFormat: 'Format :',
    imageFormatA4: 'Page A4',
    imageFormatFit: "Ajuster à l'image",
    orientation: 'Orientation :',
    orientationPortrait: 'Portrait',
    orientationLandscape: 'Paysage',
    orientationAuto: 'Auto',
    margin: 'Marge :',
    marginNone: 'Aucune',
    marginSmall: 'Petite',
    marginNormal: 'Standard',
    settings: 'Paramètres',
    outputFileName: 'Nom du fichier de sortie',
    addPageNumbers: 'Ajouter la numérotation',
    format: 'Format',
    position: 'Position',
    pageFormatStrXofY: 'Page X sur Y',
    pageFormatXofY: 'X / Y',
    pageFormatOnlyX: 'Numéro seul',
    posBottomCenter: 'Bas, centre',
    posBottomRight: 'Bas, droite',
    posTopRight: 'Haut, droite',
    compressCheckbox: 'Compresser le fichier de sortie',
    compressionLevel: 'Niveau de compression',
    presetStrong: 'Forte',
    presetBalanced: 'Équilibrée',
    presetLight: 'Légère',
    imageQuality: "Qualité d'image :",
    smallerFile: 'Fichier plus petit',
    higherQuality: 'Meilleure qualité',
    removeMetadata: 'Supprimer les métadonnées inutiles',
    mergeButton: 'Fusionner les fichiers en un seul PDF',
    processing: 'Traitement...',
    modalTitle: 'Document créé avec succès',
    modalFile: 'Fichier :',
    savings: 'Réduit de',
    downloadPdf: 'Télécharger le fichier PDF',
    clearAndReset: 'Effacer et recommencer',
    themeToggle: 'Changer de thème',
    language: 'Langue',
    lightMode: 'Clair',
    darkMode: 'Sombre',
    rotationLabel: 'Rotation :',
  },
};

export const availableLanguages: Array<{ code: Language; label: string }> = [
  { code: 'pl', label: 'Polski' },
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
];

/**
 * Detects language from navigator.language or defaults to Polish if pl, or English
 */
export function detectDefaultLanguage(): Language {
  if (typeof window === 'undefined' || !navigator.language) {
    return 'pl';
  }
  const sys = navigator.language.toLowerCase();
  if (sys.startsWith('pl')) return 'pl';
  if (sys.startsWith('de')) return 'de';
  if (sys.startsWith('es')) return 'es';
  if (sys.startsWith('fr')) return 'fr';
  if (sys.startsWith('en')) return 'en';
  return 'en';
}

export function formatFilesCount(count: number, lang: Language): string {
  const t = translations[lang];
  if (lang === 'pl') {
    if (count === 1) return `1 ${t.fileSingular}`;
    if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) {
      return `${count} ${t.fileFew}`;
    }
    return `${count} ${t.fileMany}`;
  }
  return `${count} ${count === 1 ? t.fileSingular : t.fileMany}`;
}

export function formatPagesCount(count: number, lang: Language): string {
  const t = translations[lang];
  if (lang === 'pl') {
    if (count === 1) return `1 ${t.pageSingular}`;
    return `${count} ${t.pagePlural}`;
  }
  return `${count} ${count === 1 ? t.pageSingular : t.pagePlural}`;
}
