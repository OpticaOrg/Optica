import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { ImageComponent } from './imageComponent';

interface GalleryContainerProps {
  submittedSearchTerm: string;
}

export function GalleryContainer({ submittedSearchTerm }: GalleryContainerProps): JSX.Element {
  const [urls, setURLs] = useState<string[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [hasMoreImages, setHasMoreImages] = useState<boolean>(true);
  const [currentSearchTerm, setCurrentSearchTerm] = useState<string>('');

  useEffect(() => {
    if (submittedSearchTerm !== currentSearchTerm) {
      resetSearch();
    }
  }, [submittedSearchTerm]);

  /**
   * resetSearch() resets the page number, URLs, and hasMoreImages state variables.
   * It also sets the current search term to the submitted search term.
   * 
   * @returns 
   */
  function resetSearch() {
    setPageNumber(1);
    setURLs([]);
    setHasMoreImages(true);
    setCurrentSearchTerm(submittedSearchTerm);
    return;
  }

  useEffect(() => {
    if (hasMoreImages) loadImages();
  }, [pageNumber, currentSearchTerm]);

  /**
   * loadImages() makes a call to the backend to get a list of image URLs.
   * If the current search term is not empty, it will make a call to the search endpoint.
   * Otherwise, it will make a call to the images endpoint.
   */
  async function loadImages() {
    let res;
    if (currentSearchTerm.length !== 0) {
      res = await axios(`/api/search?pg=${pageNumber}&keyword=${currentSearchTerm}`);
    } else {
      res = await axios(`/api/images?pg=${pageNumber}`);
    }

    const newUrls = res.data;
    if (newUrls.length !== 16) setHasMoreImages(false);
    setURLs((oldURLs) => [...oldURLs, ...newUrls]);
  }

  /**
   * handleScroll() is a callback function that is called when the user scrolls.
   * If the user has scrolled to the bottom of the page, it will increment the page number.
   * This will trigger a call to loadImages() in the useEffect hook.
   */
  const handleScroll = useCallback(() => {
    if (isBottomOfPage()) {
      setPageNumber(pageNumber + 1);
    }
  }, [pageNumber]);

  /**
   * isBottomOfPage() returns true if the user has scrolled to the bottom of the page.
   * 
   * @returns boolean
   */
  function isBottomOfPage() {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    return scrollTop + clientHeight >= scrollHeight;
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => { window.removeEventListener('scroll', handleScroll); };
  }, [handleScroll]);

  /**
   * renderImages() maps the URLs to ImageComponents.
   */
  const renderImages = urls.map((url, index) => {
    return <ImageComponent key={index} imgUrl={url} />;
  });

  return <div className="galleryContainer">{renderImages}</div>;
}
