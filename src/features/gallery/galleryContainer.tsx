import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { ImageComponent } from './imageComponent';

interface GalleryContainerProps {
  submittedSearchTerm: string
}

export function GalleryContainer ({ submittedSearchTerm }: GalleryContainerProps): JSX.Element {
  const [urls, setURLs] = useState<string[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [keepUpdating, setKeepUpdating] = useState<boolean>(true);
  const [currSearchTerm, setCurrSearchTerm] = useState<string>('');

  useEffect(() => {
    if (submittedSearchTerm !== currSearchTerm) {
      setPageNumber(1);
      setURLs([]);
      setKeepUpdating(true);
      setCurrSearchTerm(submittedSearchTerm);
    }
  }, [submittedSearchTerm]);

  useEffect(() => {
    if (!keepUpdating) return;
    if (currSearchTerm.length !== 0) {
      void (async () => {
        const res = await axios(
          `/api/search?pg=${pageNumber}&keyword=${currSearchTerm}`
        );
        const arr = res.data;

        if (arr.length !== 16) {
          setKeepUpdating(false)
        }

        setURLs((oldURLs) => [...oldURLs, ...arr]);
      })();
    } else {
      void (async () => {
        const res = await axios(
          `/api/images?pg=${pageNumber}`
        );
        const arr = res.data;
        if (arr.length !== 16) setKeepUpdating(false);
        setURLs((oldURLs) => [...oldURLs, ...arr]);
      })();
    }
  }, [pageNumber, currSearchTerm]);

  // Infinite scrolling logic.
  const onScroll = useCallback(() => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    if (scrollTop + clientHeight >= scrollHeight) {
      setPageNumber(pageNumber + 1);
    }
  }, [pageNumber]);

  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); };
  }, [onScroll]);

  const toRender = urls.map((url) => {
    return <ImageComponent key={Math.random() + Date.now()} imgUrl={url} />;
  });

  return <div className="galleryContainer">{toRender}</div>;
}
