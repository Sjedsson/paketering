import React, { useState } from 'react';

function FavoriteWords({ wordData }) {
  const [favorites, setFavorites] = useState(
    JSON.parse(sessionStorage.getItem('favorites')) || []
  );

  // Lägger till ordet i favoriter
  const addToFavorites = () => {
    const newFavorites = [...favorites, wordData];
    setFavorites(newFavorites);
    sessionStorage.setItem('favorites', JSON.stringify(newFavorites)); // Spara i sessionStorage
  };

  // Tar bort ord från favoriter
  const removeFromFavorites = (word) => {
    const updatedFavorites = favorites.filter((item) => item.word !== word);
    setFavorites(updatedFavorites);
    sessionStorage.setItem('favorites', JSON.stringify(updatedFavorites)); // Uppdatera sessionStorage
  };

  return (
    <div>
      {/* Visar knapp för att lägga till ord i favoriter */}
      {wordData && (
        <button onClick={addToFavorites}>Lägg till i favoriter</button>
      )}

      <h3>Dina favoriter</h3>
      {/* Visar listan över sparade favoritord */}
      {favorites.length > 0 ? (
        <ul>
          {favorites.map((item) => (
            <li key={item.word}>
              <h4>{item.word}</h4>
              <p>{item.meanings[0].definitions[0].definition}</p>
              <button onClick={() => removeFromFavorites(item.word)}>Ta bort</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Inga favoritord än.</p>
      )}
    </div>
  );
}

export default FavoriteWords;
