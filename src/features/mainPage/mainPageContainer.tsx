import React, { useState } from 'react';
import { GalleryContainer } from '../gallery/galleryContainer';
import SearchComponent from './searchComponent';

export default function MainPage (): JSX.Element {
  const [searchTerm, setSearchTerm] = useState<string>('')

  const searchTermHandler = (searchFieldValue: string): void => {
    setSearchTerm(searchFieldValue)
  }

  return (
    <>
      <div className="header">
        <a href="#default" className="logo">
          Optica
        </a>
        <div className="header-right">
          <a className="active" href="#home">
            Home
          </a>
          <a href="#contact">Contact</a>
          <a href="#about">About</a>
          <a className="loginButton" href="#login">
            Login
          </a>
        </div>
      </div>
      <div className="mainPage">
        <SearchComponent searchHandler={searchTermHandler} />
        <GalleryContainer submittedSearchTerm={searchTerm} />
      </div>
    </>
  )
}
