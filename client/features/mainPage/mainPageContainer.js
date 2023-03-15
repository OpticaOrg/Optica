import React from 'react';
import { useState } from 'react';
import { GalleryContainer } from '../gallery/galleryContainer';
import { SearchComponent } from './searchComponent';
import { useState, useHistory, useParams } from 'react';
import { Link } from 'react-router-dom';
import BlobView from '../testRenderBlob/blobView';

export function MainPage() {
  const history = useHistory();
  const [searchTerm, setSearchTerm] = useState('');
  const { viewParam } = useParams();
  const [layout, setLayout] = useState();

  const searchTermHandler = (searchFieldValue) => {
    setSearchTerm(searchFieldValue);
  };

  useEffect(() => {
    if (layout) {
      setViewToShow(layout);
    } else {
      history.push('/base');
    }
  }, [layout]);

  // If we sort, maybe a sort hook here? 





  return (
    <>
      <BlobView></BlobView>
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
