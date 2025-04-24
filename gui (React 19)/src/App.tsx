import React from 'react';
import './App.css';
import FlashcardGame from './components/FlashcardGame';
import {flashcardData} from './components/Sections';

function App() {
  return (
    <>
      <FlashcardGame data={flashcardData} />
    </>
  );
}

export default App;
