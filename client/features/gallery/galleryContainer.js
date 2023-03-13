import React from 'react';
import { ImageComponent } from './imageComponent';
import { useEffect, useState } from 'react';
const axios = require('axios');
export function GalleryContainer() {
  const [urls, setURLs] = useState([]);
  // const enpoint = 'http://localhost:3000/images'
  // const firstSearchParams = new URLSearchParams({'pg': 1});

  useEffect(() => {
    (async () => {
      const res = await axios('http://localhost:3000/images?pg=1', {
        mode: 'no-cors'
      });
      const arr = res.data;
      console.log(arr);
      console.log(urls);
      setURLs((oldURLs) => [...oldURLs, ...arr]);
      console.log(urls);
    })();
  }, []);

  const toRender = urls.map((url) => {
    return <ImageComponent key={Math.random() + Date.now()} imgUrl={url} />;
  });

  return <div className="galleryContainer">{toRender}</div>;
}
