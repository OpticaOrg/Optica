import React from 'react';
import { ImageComponent } from './imageComponent';
import { useEffect } from 'react';
const axios = require('axios');
export function GalleryContainer() {
  // get request for pages
  // get request to localhost:3000/images?pg={page}

  // search query get request
  // /search?pg={number}&keyword={keyword}

  // for implementation of  infinite scrolling

  // define some variable to boolean
  // if the returned array from images endpoint has a length value less than 16, set boolean to false
  // DO NOT REQUEST ANY MORE IMAGES (you've loaded all images from database)

  // test array
  // const array = [
  //   "https://scratch-project-bucket.s3.us-east-2.amazonaws.com/07e20126-f321-45a1-9f36-757401b18296.jpg",
  //   "https://scratch-project-bucket.s3.us-east-2.amazonaws.com/faf564c5-1146-41e5-8c6b-f944ad03859f.jpg",
  //   "https://scratch-project-bucket.s3.us-east-2.amazonaws.com/21ebbaf9-09d8-410f-8786-751389e78731.jpg",
  //   "https://scratch-project-bucket.s3.us-east-2.amazonaws.com/73047c9a-1550-4c15-9c3c-d06459e56650.jpg",
  //   "https://scratch-project-bucket.s3.us-east-2.amazonaws.com/6752f090-5dc2-4c75-bfe0-3c545bee5eac.jpg",
  //   "https://scratch-project-bucket.s3.us-east-2.amazonaws.com/06ce2ce0-d137-4ef3-9808-9cc81d765d8a.jpg",
  //   "https://scratch-project-bucket.s3.us-east-2.amazonaws.com/a9823894-eea0-4a08-b06f-5b9bbc39e6d1.jpg",
  //   "https://scratch-project-bucket.s3.us-east-2.amazonaws.com/1b783e4d-eb5c-45e0-9eea-06e9ec829688.jpg",
  //   "https://scratch-project-bucket.s3.us-east-2.amazonaws.com/88818986-46fa-43cf-8461-11f8f850e7b2.jpg",
  //   "https://scratch-project-bucket.s3.us-east-2.amazonaws.com/d71417ab-c3ac-4545-a7f6-bc7ff5f5c81e.jpg",
  //   "https://scratch-project-bucket.s3.us-east-2.amazonaws.com/4104875d-75ed-4f97-bf76-b2527bc5a1d9.jpg",
  //   "https://scratch-project-bucket.s3.us-east-2.amazonaws.com/aae1aedd-e1eb-44b0-b2d1-44bb309ec6c9.jpg",
  //   "https://scratch-project-bucket.s3.us-east-2.amazonaws.com/3a79a64a-e20e-47d5-989a-59bfd4113b36.jpg",
  //   "https://scratch-project-bucket.s3.us-east-2.amazonaws.com/5eaf9929-7e71-4e45-a797-c78acf6320dc.jpg",
  //   "https://scratch-project-bucket.s3.us-east-2.amazonaws.com/b551a69d-2b2d-4fbd-a3cc-a11e2716a16c.jpg",
  //   "https://scratch-project-bucket.s3.us-east-2.amazonaws.com/274d60e9-880a-407b-80ff-04459049d7ba.jpg"
  // ];

  const imageComponentArray = [];
  const pageArray = [];

  // const enpoint = 'http://localhost:3000/images'
  // const firstSearchParams = new URLSearchParams({'pg': 1});

  useEffect(() => {
    (async () => {
      const res = await axios('http://localhost:3000/images?pg=1', {
        mode: 'no-cors'
      });
      const arr = await res;
      console.log(arr.data);
    })();
    // fetch('http://localhost:3000/images?pg=1', {
    //   method: 'get',
    //   headers: { 'Content-Type': 'application/json' },
    //   mode: 'no-cors'
    // })
    //   .then((res) => {
    //     console.log(res);
    //     console.log(res.body);
    //     return res.json();
    //   })
    //   .then((data) => {
    //     console.log(data);
    //   });
    //   // .then(() => {
    //   //   for (let i = 0 ; i < pageArray[0].length ; i++) {
    //   //     imageComponentArray.push(<ImageComponent key={counter} imgUrl={array[i]}/>)
    //   //   }
    //   // })
    //   .catch((e) => {
    //     console.log(e);
    //   })
  }, []);

  // let counter = 0;
  // while (counter < 16){
  //   imageComponentArray.push(<ImageComponent key={counter} imgUrl={array[counter]}/>)
  //   counter++
  // }

  return (
    <div className="galleryContainer">
      {/* <h1>hello</h1> */}
      {imageComponentArray}
    </div>
  );
}
