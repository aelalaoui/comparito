import React, { useState, useEffect, useRef } from 'react';
import CodeEditor from './CodeEditor';
import DiffViewer from './DiffViewer';
import Toolbar from './Toolbar';
import { DiffResult } from '../types';
import { calculateDiff } from '../utils/diffUtils';

const CodeComparator: React.FC = () => {
  const [leftCode, setLeftCode] = useState(`function calculateSum(a, b) {
  return a + b;
}

const result = calculateSum(5, 3);
console.log('Result:', result);

// Added some extra functionality
function multiply(x, y) {
  return x * y;
}`);

  const [rightCode, setRightCode] = useState(`function calculateSum(a, b) {
  // Added input validation
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new Error('Both arguments must be numbers');
  }
  return a + b;
}

const result = calculateSum(5, 3);
console.log('Result:', result);

// Modified multiplication function
function multiply(x, y) {
  if (x === 0 || y === 0) return 0;
  return x * y;
}

// New function added
function divide(x, y) {
  if (y === 0) throw new Error('Division by zero');
  return x / y;
}`);

  const [viewMode, setViewMode] = useState<'split' | 'unified'>('split');
  const [language, setLanguage] = useState('javascript');
  const [diffResult, setDiffResult] = useState<DiffResult | null>(null);

  // Ajout des refs et états pour la synchro du scroll
  const leftEditorRef = useRef<HTMLTextAreaElement>(null);
  const rightEditorRef = useRef<HTMLTextAreaElement>(null);
  const [leftScroll, setLeftScroll] = useState<{ top?: number; left?: number }>({});
  const [rightScroll, setRightScroll] = useState<{ top?: number; left?: number }>({});
  const isSyncingScroll = useRef(false);

  // Gestion du scroll synchronisé
  const handleLeftScroll = (scrollTop: number, scrollLeft: number) => {
    if (isSyncingScroll.current) return;
    isSyncingScroll.current = true;
    setRightScroll({ top: scrollTop, left: scrollLeft });
    setTimeout(() => { isSyncingScroll.current = false; }, 10);
  };
  const handleRightScroll = (scrollTop: number, scrollLeft: number) => {
    if (isSyncingScroll.current) return;
    isSyncingScroll.current = true;
    setLeftScroll({ top: scrollTop, left: scrollLeft });
    setTimeout(() => { isSyncingScroll.current = false; }, 10);
  };

  useEffect(() => {
    const diff = calculateDiff(leftCode, rightCode);
    setDiffResult(diff);
  }, [leftCode, rightCode]);

  const handleSwapContent = () => {
    const temp = leftCode;
    setLeftCode(rightCode);
    setRightCode(temp);
  };

  const handleClearAll = () => {
    setLeftCode('');
    setRightCode('');
  };

  const handleFileUpload = (side: 'left' | 'right', content: string) => {
    if (side === 'left') {
      setLeftCode(content);
    } else {
      setRightCode(content);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <Toolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        language={language}
        onLanguageChange={setLanguage}
        onSwapContent={handleSwapContent}
        onClearAll={handleClearAll}
        onFileUpload={handleFileUpload}
        diffStats={diffResult?.stats}
      />
      
      {viewMode === 'split' ? (
        <div className="flex h-[700px] gap-4 p-4">
          <div className="flex-1">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 border-b border-gray-200 rounded-t-lg">
              <h3 className="text-sm font-semibold text-gray-800 flex items-center">
                <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                Version Originale
              </h3>
            </div>
            <CodeEditor
              ref={leftEditorRef}
              value={leftCode}
              onChange={setLeftCode}
              language={language}
              lineNumbers={true}
              diffLines={diffResult?.leftDiffs}
              title="Version Originale"
              onScroll={handleLeftScroll}
              scrollTo={leftScroll}
            />
          </div>
          <div className="flex-1">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 border-b border-gray-200 rounded-t-lg">
              <h3 className="text-sm font-semibold text-gray-800 flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                Version Modifiée
              </h3>
            </div>
            <CodeEditor
              ref={rightEditorRef}
              value={rightCode}
              onChange={setRightCode}
              language={language}
              lineNumbers={true}
              diffLines={diffResult?.rightDiffs}
              title="Version Modifiée"
              onScroll={handleRightScroll}
              scrollTo={rightScroll}
            />
          </div>
        </div>
      ) : (
        <div className="h-[700px] p-4">
          <DiffViewer
            leftCode={leftCode}
            rightCode={rightCode}
            language={language}
            diffResult={diffResult}
          />
        </div>
      )}
    </div>
  );
};

export default CodeComparator;