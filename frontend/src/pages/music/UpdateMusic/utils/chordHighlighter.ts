/**
 * Função para identificar acordes em um texto
 */
export function findChords(text: string): string[] {
  // Regex para encontrar acordes musicais
  const chordRegex = /[CDEFGAB][#b]?(maj|m|min|dim|aug|sus|add)?\d*[M]?[#b]?/g;
  const matches = text.match(chordRegex) || [];
  return matches;
}

/**
 * Função para destacar acordes com cor roxa
 */
export function highlightChords(text: string): string {
  if (!text) return text;
  
  // Encontrar todos os acordes
  const chords = findChords(text);
  
  if (chords.length === 0) return text;
  
  let highlightedText = text;
  
  // Destacar cada acorde com cor roxa
  chords.forEach(chord => {
    const regex = new RegExp(`\\b${chord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
    highlightedText = highlightedText.replace(
      regex, 
      `<span style="color: #8B5CF6; font-weight: bold; display: inline;">${chord}</span>`
    );
  });
  
  return highlightedText;
}

/**
 * Função para verificar se um texto contém acordes
 */
export function hasChords(text: string): boolean {
  return findChords(text).length > 0;
}

/**
 * Função para contar quantos acordes existem no texto
 */
export function countChords(text: string): number {
  return findChords(text).length;
}
