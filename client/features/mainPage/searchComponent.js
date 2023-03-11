import React from 'react'

export function SearchComponent() {

  return(
    <form className='search'>
      <label>
        <h1>ProjectX</h1>
        <input
          name="searchForm"
          defaultValue=""
        />
      </label>
        <button type="submit">Submit</button>
        <button type="upload image">Upload Image</button>
    </form>
  )
}
