import React from 'react'
import { ImageComponent } from './imageComponent'
export function GalleryContainer() {
  
  const imgUrl = 'https://image.lexica.art/md2/02e95e19-e40c-451c-b154-aac8f674013f'

  const imageComponentArray = [];
  let counter = 0;
  while (counter < 50){
    imageComponentArray.push(<ImageComponent key={counter} imgUrl={imgUrl}/>)
    counter++
  }
  console.log(imageComponentArray);

  return(
    <div className='galleryContainer'>
      {imageComponentArray}
    </div>
  )
}