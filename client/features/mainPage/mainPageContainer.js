import React from 'react';
import { GalleryContainer } from '../gallery/galleryContainer';
import { SearchComponent } from './searchComponent';
import { useState } from 'react';
import { Link } from 'react-router-dom'

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
          <Link to="/" className="active">
            Home
          </Link>
          <a href="#contact">Contact</a>
          <a href="#about">About</a>
          <Link to="/login" className="loginButton">
            Login
          </Link>
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
