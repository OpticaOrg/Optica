import React from 'react';

export function SearchComponent() {
  return (
    <div>
      <h1>Optica</h1>
      <h3>The OpenAI DALL-E Search Engine</h3>
      <form className="search">
        <label>
          <input
            name="searchForm"
            className="searchForm"
            defaultValue=""
            placeholder="Search for an image"
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
