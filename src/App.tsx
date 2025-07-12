import React from 'react';
import CodeComparator from './components/CodeComparator';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <section className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Comparateur de Code Side-by-Side
          </h1>
          <p className="text-xl text-gray-600 text-center max-w-4xl mx-auto leading-relaxed">
            Comparez vos fichiers de code facilement avec notre outil professionnel. 
            Édition en temps réel, numérotation des lignes et détection automatique des différences.
          </p>
        </section>
        <CodeComparator />
      </main>
      <Footer />
    </div>
  );
}

export default App;