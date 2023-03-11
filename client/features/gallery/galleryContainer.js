import React from 'react'
import { ImageComponent } from './imageComponent'
export function GalleryContainer() {
  
  const imgUrl = 'https://image.lexica.art/full_jpg/92adc853-077c-4c8d-a829-65aa5b526232'

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