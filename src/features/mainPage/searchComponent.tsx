import React, { useState } from 'react';

interface SearchComponentProps {
  searchHandler: (searchFieldValue: string) => void
}

export default function SearchComponent ({ searchHandler }: SearchComponentProps): JSX.Element {
  const [currString, setCurrString] = useState('')

  return (
    <div>
      <h1>Optica</h1>
      <h3>The OpenAI DALL&#8226;E Search Engine</h3>
      <form
        className="search"
        onSubmit={(e) => {
          e.preventDefault()
          searchHandler(currString)
          setCurrString('')
        }}
      >
        <label>
          <input
            name="searchForm"
            className="searchForm"
            placeholder="Search for an image"
            value={currString}
            onChange={(e) => { setCurrString(e.target.value) }}
          />
        </label>
        <div className="buttonsContainer">
          <button
            className="buttons"
            id="searchButton"
            type="submit"
            aria-label="Search"
          >
            Search
          </button>
          <button
            className="buttons"
            id="uploadButton"
            type="button"
            aria-label="Upload Image"
          >
            Upload Image
          </button>
        </div>
      </form>
    </div>
  )
}
