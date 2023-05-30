import React from 'react';
import { GalleryContainer } from '../gallery/galleryContainer';
import { SearchComponent } from './searchComponent';
import { useState } from 'react';

export function MainPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const searchTermHandler = (searchFieldValue) => {
    setSearchTerm(searchFieldValue);
  };

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
        {/* <ImageUploadComponent /> */}
        <GalleryContainer submittedSearchTerm={searchTerm} />
      </div>
    </>
  );
}
