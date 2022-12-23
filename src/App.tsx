import Chessboard from './components/Chessboard';
import Header from './components/Header'
import Footer from './components/Footer'
import React from 'react';

function App() {
  return (
    <div className="bg-slate-200 max-w-full min-h-screen">
      <Header />
      <Chessboard />
      <Footer />
    </div>
  );
}

export default App;