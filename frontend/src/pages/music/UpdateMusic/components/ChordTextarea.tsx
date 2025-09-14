import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from '../../../../components/ui/textarea';
import { highlightChords, hasChords, countChords } from '../utils/chordHighlighter';

interface ChordTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
  id?: string;
  name?: string;
}

export const ChordTextarea: React.FC<ChordTextareaProps> = ({
  value,
  onChange,
  placeholder = "",
  rows = 18,
  className = "",
  id,
  name,
}) => {
  const [showHighlight, setShowHighlight] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Verificar se há acordes no texto
  const hasChordsInText = hasChords(value);
  const chordCount = countChords(value);

  // Sincronizar scroll entre textarea e preview
  const handleScroll = () => {
    if (textareaRef.current && previewRef.current) {
      previewRef.current.scrollTop = textareaRef.current.scrollTop;
      previewRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  // Sincronizar dimensões do preview com o textarea
  useEffect(() => {
    if (showHighlight && textareaRef.current && previewRef.current) {
      const textarea = textareaRef.current;
      const preview = previewRef.current;
      
      // Sincronizar dimensões
      preview.style.width = textarea.offsetWidth + 'px';
      preview.style.height = textarea.offsetHeight + 'px';
      preview.style.fontSize = getComputedStyle(textarea).fontSize;
      preview.style.fontFamily = getComputedStyle(textarea).fontFamily;
      preview.style.lineHeight = getComputedStyle(textarea).lineHeight;
      preview.style.padding = getComputedStyle(textarea).padding;
      preview.style.border = getComputedStyle(textarea).border;
      preview.style.borderRadius = getComputedStyle(textarea).borderRadius;
    }
  }, [showHighlight, value]);

  return (
    <div className="relative">
      {/* Preview com acordes destacados */}
      {showHighlight && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div
            ref={previewRef}
            className="absolute inset-0 overflow-auto whitespace-pre-wrap break-words"
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              resize: 'none',
            }}
            dangerouslySetInnerHTML={{ __html: highlightChords(value) }}
          />
        </div>
      )}

      {/* Textarea real */}
      <Textarea
        ref={textareaRef}
        id={id}
        name={name}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
        onScroll={handleScroll}
        placeholder={placeholder}
        rows={rows}
        className={`${className} ${showHighlight ? 'text-transparent' : ''}`}
        style={showHighlight ? { color: 'transparent' } : {}}
      />

      {/* Botão para alternar destaque */}
      {hasChordsInText && (
        <div className="absolute top-2 right-2 z-20">
          <button
            type="button"
            onClick={() => setShowHighlight(!showHighlight)}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              showHighlight
                ? 'bg-purple-600 text-white'
                : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
            }`}
            title={showHighlight ? 'Ocultar destaque de acordes' : 'Mostrar destaque de acordes'}
          >
            {showHighlight ? '📝' : '🎵'}
          </button>
        </div>
      )}

      {/* Contador de acordes */}
      {hasChordsInText && !showHighlight && (
        <div className="absolute bottom-2 right-2 z-20">
          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
            {chordCount} acorde{chordCount !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  );
};
