import React, {useState, useMemo} from "react";
import {Card} from "primereact/card";
import {Button} from "primereact/button";
import {Dropdown} from "primereact/dropdown";
import {Checkbox} from "primereact/checkbox";
import {Chip} from "primereact/chip";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";

interface Flashcard {
  pl: string;
  en: string;
}

export interface Section {
  section: string;
  words: Flashcard[];
  expressions: Flashcard[];
}

interface Props {
  data: Section[];
}

const FlashcardGame: React.FC<Props> = ({data}) => {

  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [showWords, setShowWords] = useState(true);
  const [showExpressions, setShowExpressions] = useState(true);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentCard, setCurrentCard] = useState<Flashcard | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);

  const sections = useMemo(() => data.map((d) => ({label: d.section, value: d.section})), [data]);

  const loadFlashcards = () => {
    const filteredData = data.filter((d) => !selectedSection || d.section === selectedSection);
    let allCards: Flashcard[] = [];

    if (showWords) allCards = allCards.concat(...filteredData.map((d) => d.words));
    if (showExpressions) allCards = allCards.concat(...filteredData.map((d) => d.expressions));

    setFlashcards(allCards);
    pickRandomCard(allCards);
  };

  const pickRandomCard = (cards: Flashcard[]) => {
    if (cards.length > 0) {
      const randomIndex = Math.floor(Math.random() * cards.length);
      setCurrentCard(cards[randomIndex]);
      setShowTranslation(false);
    } else {
      setCurrentCard(null);
    }
  };

  const handleResponse = (correct: boolean) => {
    if (currentCard) {
      if (correct) {
        setFlashcards((prev) => prev.filter((card) => card !== currentCard));
      }
      pickRandomCard(flashcards.filter((card) => card !== currentCard));
    }
  };

  return (
    <div className="p-4 flex flex-column align-items-center gap-4">
      <Card className="p-fluid w-full md:w-6">
        <Dropdown
          value={selectedSection}
          options={sections}
          onChange={(e) => setSelectedSection(e.value)}
          placeholder="Select section"
          showClear
        />
        <div className="flex flex-column sm:flex-row align-items-center gap-3 mt-3">
          <Checkbox inputId="words" checked={showWords} onChange={(e) => setShowWords(e.checked || false)} />
          <label htmlFor="words">Words</label>
          <Checkbox
            inputId="expressions"
            checked={showExpressions}
            onChange={(e) => setShowExpressions(e.checked || false)}
          />
          <label htmlFor="expressions">Expressions</label>
        </div>
        <Button label="Start" icon="pi pi-play" className="mt-3" onClick={loadFlashcards} />
      </Card>

      {currentCard && (
        <Card className="w-full md:w-6 text-center p-4">
          <div className="text-4xl cursor-pointer" onClick={() => setShowTranslation((prev) => !prev)}>
            {showTranslation ? currentCard.en : currentCard.pl}
          </div>
          <div className="h-2rem sm:h-0"></div>
          <div className="flex flex-column sm:flex-row justify-content-between mt-3">
            <Button
              label="Try Again"
              icon="pi pi-replay"
              className="p-button-danger"
              onClick={() => pickRandomCard(flashcards)}
            />
            <div className="h-1rem sm:h-0"></div>
            <Button label="Passed" icon="pi pi-check" className="p-button-success" onClick={() => handleResponse(true)} />
          </div>
        </Card>
      )}

      {flashcards.length === 0 && currentCard === null && <Chip label="No more flashcards!" className="p-mt-3" />}
    </div>
  );
};

export default FlashcardGame;
