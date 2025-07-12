import React, { useRef, useEffect, useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { DiffLine } from '../types';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  lineNumbers?: boolean;
  diffLines?: DiffLine[];
  title?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language,
  lineNumbers = true,
  diffLines = [],
  title = ''
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);

  const lines = value.split('\n');
  const lineCount = Math.max(lines.length, 1);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Enhanced scroll synchronization
  useEffect(() => {
    const textarea = textareaRef.current;
    const lineNumbers = lineNumbersRef.current;
    const background = backgroundRef.current;
    
    if (!textarea || !lineNumbers || !background) return;
    
    const syncScroll = (source: HTMLElement) => {
      const scrollTop = source.scrollTop;
      setScrollTop(scrollTop);
      
      // Only sync if the scroll values are different to prevent infinite loops
      if (lineNumbers && lineNumbers.scrollTop !== scrollTop) {
        lineNumbers.scrollTop = scrollTop;
      }
      if (background && background.scrollTop !== scrollTop) {
        background.scrollTop = scrollTop;
      }
    };
    
    const handleTextareaScroll = () => syncScroll(textarea);
    const handleLineNumbersScroll = () => syncScroll(lineNumbers);
    
    textarea.addEventListener('scroll', handleTextareaScroll, { passive: true });
    lineNumbers.addEventListener('scroll', handleLineNumbersScroll, { passive: true });
    
    return () => {
      textarea.removeEventListener('scroll', handleTextareaScroll);
      lineNumbers.removeEventListener('scroll', handleLineNumbersScroll);
    };
  }, []);

  const getDiffClass = (lineIndex: number) => {
    const diffLine = diffLines.find(d => d.lineNumber === lineIndex + 1);
    if (!diffLine) return '';
    
    switch (diffLine.type) {
      case 'added':
        return 'bg-green-50 border-l-4 border-green-500';
      case 'removed':
        return 'bg-red-50 border-l-4 border-red-500';
      case 'modified':
        return 'bg-blue-50 border-l-4 border-blue-500';
      default:
        return '';
    }
  };

  const getLineNumberClass = (lineIndex: number) => {
    const diffLine = diffLines.find(d => d.lineNumber === lineIndex + 1);
    if (!diffLine) return 'text-gray-500 bg-gray-50';
    
    switch (diffLine.type) {
      case 'added':
        return 'text-green-800 bg-green-100 font-semibold';
      case 'removed':
        return 'text-red-800 bg-red-100 font-semibold';
      case 'modified':
        return 'text-blue-800 bg-blue-100 font-semibold';
      default:
        return 'text-gray-500 bg-gray-50';
    }
  };

  const renderLineNumbers = () => {
    return (
      <div
        ref={lineNumbersRef}
        className="select-none overflow-hidden bg-gray-50 border-r border-gray-300 flex-shrink-0"
        style={{ 
          width: '60px',
          fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
          fontSize: '13px',
          lineHeight: '19.5px',
          paddingTop: '12px',
          paddingBottom: '12px',
        }}
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <div
            key={i}
            className={`flex items-center justify-end px-3 ${getLineNumberClass(i)}`}
            style={{ 
              height: '19.5px',
              lineHeight: '19.5px',
              fontSize: '13px'
            }}
          >
            {i + 1}
          </div>
        ))}
      </div>
    );
  };

  const renderBackground = () => {
    return (
      <div 
        ref={backgroundRef}
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{
          fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
          fontSize: '13px',
          lineHeight: '19.5px',
          paddingTop: '12px',
          paddingBottom: '12px',
        }}
      >
        {lines.map((line, index) => (
          <div
            key={index}
            className={getDiffClass(index)}
            style={{ 
              height: '19.5px',
              lineHeight: '19.5px',
              width: '100%',
              position: 'relative'
            }}
          >
            &nbsp;
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex h-full bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm relative">
      {/* Copy Button */}
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 z-30 p-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center space-x-1"
        title={`Copier ${title.toLowerCase()}`}
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 text-green-600" />
            <span className="text-xs text-green-600 font-medium">Copié!</span>
          </>
        ) : (
          <>
            <Copy className="h-4 w-4 text-gray-600" />
            <span className="text-xs text-gray-600 font-medium">Copier</span>
          </>
        )}
      </button>

      {lineNumbers && renderLineNumbers()}
      
      <div className="flex-1 relative overflow-hidden">
        {/* Background highlighting */}
        {renderBackground()}
        
        {/* Code textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full resize-none border-none outline-none bg-transparent text-gray-900 relative z-20 scrollbar-hide"
          style={{
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
            fontSize: '13px',
            lineHeight: '19.5px',
            padding: '12px',
            tabSize: 2,
            whiteSpace: 'pre',
            wordWrap: 'break-word',
            margin: 0,
            border: 0,
          }}
          spellCheck={false}
          placeholder="Collez votre code ici..."
        />
      </div>
    </div>
  );
};

export default CodeEditor;