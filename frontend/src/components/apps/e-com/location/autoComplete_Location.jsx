import React, { useState } from 'react';

function LocationSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    setQuery(inputValue);

    // Trigger search when the query is not empty
    if (inputValue.trim() !== '') {
      searchLocation(inputValue);
    } else {
      // Clear the results if the input is empty
      setResults([]);
    }
  };

  const searchLocation = (inputValue) => {
    const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(inputValue)}`;

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        setResults(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const handleLiClick = (displayName) => {
    alert(displayName);
  };

  return (
    <div>
      <input 
        type="text"
        placeholder="Enter location..."
        value={query}
        onChange={handleInputChange}
      />
      <ul>
        {results.map((result, index) => (
          <li key={index} onClick={() => handleLiClick(result.display_name)}>{result.display_name}</li>
        ))}
      </ul>
    </div>
  );
}

export default LocationSearch;
