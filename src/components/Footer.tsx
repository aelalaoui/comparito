import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">CodeCompare</h3>
            <p className="text-gray-400">
              Outil professionnel de comparaison de code en ligne avec édition en temps réel.
            </p>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Fonctionnalités</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Comparaison side-by-side</li>
              <li>Édition en temps réel</li>
              <li>Numérotation des lignes</li>
              <li>Détection automatique des diffs</li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Langages supportés</h4>
            <ul className="space-y-2 text-gray-400">
              <li>JavaScript</li>
              <li>TypeScript</li>
              <li>Python</li>
              <li>Java</li>
              <li>C++</li>
              <li>HTML/CSS</li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Ressources</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Documentation</li>
              <li>API</li>
              <li>Support</li>
              <li>Feedback</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 CodeCompare. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;