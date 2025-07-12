import React from 'react';
import { GitCompare, Settings, Download, Share2 } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <GitCompare className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">CodeCompare</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
              Fonctionnalités
            </a>
            <a href="#guide" className="text-gray-600 hover:text-blue-600 transition-colors">
              Guide
            </a>
            <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">
              À propos
            </a>
          </nav>
          <div className="flex items-center space-x-3">
            <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
              <Settings className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
              <Download className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;