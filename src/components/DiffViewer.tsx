import React from 'react';
import { DiffResult } from '../types';

interface DiffViewerProps {
  leftCode: string;
  rightCode: string;
  language: string;
  diffResult: DiffResult | null;
}

const DiffViewer: React.FC<DiffViewerProps> = ({
  leftCode,
  rightCode,
  language,
  diffResult
}) => {
  if (!diffResult) return null;

  const renderUnifiedDiff = () => {
    const leftLines = leftCode.split('\n');
    const rightLines = rightCode.split('\n');
    const maxLines = Math.max(leftLines.length, rightLines.length);
    const unifiedLines = [];

    for (let i = 0; i < maxLines; i++) {
      const leftLine = leftLines[i] || '';
      const rightLine = rightLines[i] || '';
      
      if (leftLine === rightLine) {
        unifiedLines.push({
          type: 'unchanged',
          leftLineNum: i + 1,
          rightLineNum: i + 1,
          content: leftLine
        });
      } else if (leftLine && rightLine) {
        unifiedLines.push({
          type: 'removed',
          leftLineNum: i + 1,
          rightLineNum: null,
          content: leftLine
        });
        unifiedLines.push({
          type: 'added',
          leftLineNum: null,
          rightLineNum: i + 1,
          content: rightLine
        });
      } else if (leftLine) {
        unifiedLines.push({
          type: 'removed',
          leftLineNum: i + 1,
          rightLineNum: null,
          content: leftLine
        });
      } else if (rightLine) {
        unifiedLines.push({
          type: 'added',
          leftLineNum: null,
          rightLineNum: i + 1,
          content: rightLine
        });
      }
    }

    return (
      <div className="h-full overflow-auto font-mono text-sm bg-white">
        {unifiedLines.map((line, index) => (
          <div
            key={index}
            className={`flex items-center px-2 py-1 border-b border-gray-100 hover:bg-gray-25 ${
              line.type === 'added' ? 'bg-green-50 border-l-4 border-green-500' :
              line.type === 'removed' ? 'bg-red-50 border-l-4 border-red-500' :
              'bg-white'
            }`} 
            style={{ minHeight: '1.5rem', lineHeight: '1.5rem' }}
          >
            <div className="w-12 text-right text-gray-600 mr-2 font-medium text-xs">
              {line.leftLineNum || ''}
            </div>
            <div className="w-12 text-right text-gray-600 mr-2 font-medium text-xs">
              {line.rightLineNum || ''}
            </div>
            <div className={`w-6 text-center mr-3 font-bold text-xs ${
              line.type === 'added' ? 'text-green-700 bg-green-200 rounded px-1' :
              line.type === 'removed' ? 'text-red-700 bg-red-200 rounded px-1' :
              'text-gray-400'
            }`}>
              {line.type === 'added' ? '+' :
               line.type === 'removed' ? '-' :
               ' '}
            </div>
            <div className="flex-1 text-gray-900 font-mono">
              {line.content || '\u00A0'}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="h-full bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
      <div className="bg-gray-100 px-4 py-3 border-b border-gray-300">
        <h3 className="text-sm font-semibold text-gray-800">Vue Unifiée des Différences</h3>
      </div>
      {renderUnifiedDiff()}
    </div>
  );
};

export default DiffViewer;