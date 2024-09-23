import React, { useState } from 'react';
import '../styles/DictionarySearch.css';

function DictionarySearch() {
  // Okej, här har vi tre grejer vi håller koll på: vad användaren söker efter, resultatet från API:et, och eventuella fel
  const [query, setQuery] = useState('');
  const [wordData, setWordData] = useState(null);
  const [error, setError] = useState('');

  // Här är vår sökfunktion, där magin händer... eller kaoset, beroende på.....
  const searchWord = async () => {
    // Tomt sökfält? Nepp , användaren måste skriva något
    if (query === '') {
      setError('Sökfältet är tomt. Ange ett ord.');
      setWordData(null);
      return;
    }

    try {
      // Okej, nu ropar vi på Free Dictionary API... om det är på gott humör man vill säga
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${query}`);
      // Om API:et inte gillar vårt ord, säger vi "ingen definition hittades", typ som en lärare som inte hittar rätt i boken
      if (!response.ok) {
        setError('Ingen definition hittades.');
        setWordData(null);
        return;
      }

      // Men om allt går bra, då plockar vi fram ordet och definitionen
      const data = await response.json();
      setWordData(data[0]);
      setError('');
    } catch (err) {
      // Men om nåt ändå kraschar, ja då visar vi ett surt felmeddelande
      setError('Ett fel uppstod. Försök igen.');
      setWordData(null);
    }
  };

  return (
    <div className="DictionarySearch">
      {/* Här kommer inputfältet, där magin (eller kaoset) börjar */}
      <input
        className="DictionarySearch-input"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}  // Uppdaterar vad användaren skriver in, i realtid. Fancy.
        placeholder="Skriv in ett ord"
      />
      <button className="DictionarySearch-button" onClick={searchWord}>Sök</button>

      {/* Om vi får något fel, så visar vi ett rött och stort felmeddelande. Ingen kan missa det. */}
      {error && <p className="DictionarySearch-error" style={{ color: 'red' }}>{error}</p>}

      {/* Och om vi får nån data tillbaka från API:et, då visar vi den här */}
      {wordData && (
        <div className="DictionarySearch-result">
          <h3>{wordData.word}</h3>
          <p>{wordData.meanings[0].definitions[0].definition}</p>  {/* Och här har vi definitionen. Yay, vi lär oss nya saker. */}
          {/* Om vi har ljud också, varför inte låta användaren höra uttalet? */}
          {wordData.phonetics[0] && wordData.phonetics[0].audio && (
            <audio controls className="DictionarySearch-audio">
              <source src={wordData.phonetics[0].audio} type="audio/mpeg" />
              Din webbläsare stödjer inte ljuduppspelning.  {/* Alltid bra att ha en fallback om nåt går snett... */}
            </audio>
          )}
        </div>
      )}
    </div>
  );
}

export default DictionarySearch;
