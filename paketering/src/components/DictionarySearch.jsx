import React, { useState } from 'react';
import '../styles/DictionarySearch.css';


function DictionarySearch() {
  const [query, setQuery] = useState('');
  const [wordData, setWordData] = useState(null);
  const [error, setError] = useState('');

  const searchWord = async () => {
    if (query === '') {
      setError('Sökfältet är tomt. Ange ett ord.');
      setWordData(null);
      return;
    }

    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${query}`);
      if (!response.ok) {
        setError('Ingen definition hittades.');
        setWordData(null);
        return;
      }

      const data = await response.json();
      setWordData(data[0]);
      setError('');
    } catch (err) {
      setError('Ett fel uppstod. Försök igen.');
      setWordData(null);
    }
  };

  return (
    <div className="DictionarySearch">
      <input
        className="DictionarySearch-input"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Skriv in ett ord"
      />
      <button className="DictionarySearch-button" onClick={searchWord}>Sök</button>

      {error && <p className="DictionarySearch-error" style={{ color: 'red' }}>{error}</p>}

      {wordData && (
        <div className="DictionarySearch-result">
          <h3>{wordData.word}</h3>
          <p>{wordData.meanings[0].definitions[0].definition}</p>
          {wordData.phonetics[0] && wordData.phonetics[0].audio && (
            <audio controls className="DictionarySearch-audio">
              <source src={wordData.phonetics[0].audio} type="audio/mpeg" />
              Din webbläsare stödjer inte ljuduppspelning.
            </audio>
          )}
        </div>
      )}
    </div>
  );
}

export default DictionarySearch;
