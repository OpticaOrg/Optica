import React from 'react';
import { useState } from 'react';

export function SearchComponent({ searchHandler }) {
  const [currString, setCurrString] = useState('');

  return (
    <div>
      <h1>Optica</h1>
      <h3>The OpenAI DALL&#8226;E Search Engine</h3>
      <form
        className="search"
        onSubmit={(e) => {
          e.preventDefault();
          searchHandler(currString);
          setCurrString('');
        }}
      >
        <label>
          <input
            name="searchForm"
            className="searchForm"
            placeholder="Search for an image"
            value={currString}
            onChange={(e) => setCurrString(e.target.value)}
          />
        </label>
        <div className="buttonsContainer">
          <button className="buttons" id="searchButton" type="search">
            Search
          </button>
          <button className="buttons" id="uploadButton" type="upload image">
            Upload Image
          </button>
        </div>
      </form>
    </div>
  );
}
