import React from 'react';
import { 
  ArrowLeftRight, 
  Trash2, 
  Upload, 
  Download, 
  Copy,
  Eye,
  EyeOff,
  BarChart3
} from 'lucide-react';
import { DiffStats } from '../types';

interface ToolbarProps {
  viewMode: 'split' | 'unified';
  onViewModeChange: (mode: 'split' | 'unified') => void;
  language: string;
  onLanguageChange: (language: string) => void;
  onSwapContent: () => void;
  onClearAll: () => void;
  onFileUpload: (side: 'left' | 'right', content: string) => void;
  diffStats?: DiffStats;
}

const Toolbar: React.FC<ToolbarProps> = ({
  viewMode,
  onViewModeChange,
  language,
  onLanguageChange,
  onSwapContent,
  onClearAll,
  onFileUpload,
  diffStats
}) => {
  const handleFileUpload = (side: 'left' | 'right') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,.js,.ts,.jsx,.tsx,.py,.java,.cpp,.c,.html,.css,.json,.xml,.md';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          onFileUpload(side, content);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'json', label: 'JSON' },
    { value: 'xml', label: 'XML' },
    { value: 'markdown', label: 'Markdown' }
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-semibold text-gray-700">Langage:</label>
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
            >
              {languages.map(lang => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm font-semibold text-gray-700">Vue:</label>
            <div className="flex rounded-lg overflow-hidden border border-gray-300 shadow-sm">
              <button
                onClick={() => onViewModeChange('split')}
                className={`px-4 py-2 text-sm flex items-center space-x-2 transition-all duration-200 ${
                  viewMode === 'split' 
                    ? 'bg-blue-500 text-white shadow-sm' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Eye className="h-4 w-4" />
                <span>Split</span>
              </button>
              <button
                onClick={() => onViewModeChange('unified')}
                className={`px-4 py-2 text-sm flex items-center space-x-2 transition-all duration-200 ${
                  viewMode === 'unified' 
                    ? 'bg-blue-500 text-white shadow-sm' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <EyeOff className="h-4 w-4" />
                <span>Unifié</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleFileUpload('left')}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center space-x-2 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Upload className="h-4 w-4" />
            <span>Fichier Gauche</span>
          </button>
          
          <button
            onClick={() => handleFileUpload('right')}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center space-x-2 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Upload className="h-4 w-4" />
            <span>Fichier Droit</span>
          </button>
          
          <button
            onClick={onSwapContent}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center space-x-2 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <ArrowLeftRight className="h-4 w-4" />
            <span>Échanger</span>
          </button>
          
          <button
            onClick={onClearAll}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-red-50 hover:border-red-300 hover:text-red-700 flex items-center space-x-2 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Trash2 className="h-4 w-4" />
            <span>Effacer</span>
          </button>
        </div>
      </div>
      
      {diffStats && (
        <div className="mt-4 pt-4 border-t border-gray-200 flex items-center space-x-6 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <BarChart3 className="h-4 w-4" />
            <span className="font-semibold">Statistiques:</span>
          </div>
          <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            <span className="font-medium text-green-700">{diffStats.added} ajouts</span>
          </div>
          <div className="flex items-center space-x-2 bg-red-50 px-3 py-1 rounded-full">
            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
            <span className="font-medium text-red-700">{diffStats.removed} suppressions</span>
          </div>
          <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full">
            <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
            <span className="font-medium text-blue-700">{diffStats.modified} modifications</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Toolbar;