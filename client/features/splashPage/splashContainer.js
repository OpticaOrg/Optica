import React from 'react'
import { GalleryContainer } from '../gallery/galleryContainer'
import { SearchComponent } from './searchComponent'

export function SplashContainer() {

  return(
    <div className='splashContainer'>
      <SearchComponent />
      {/* <ImageUploadComponent /> */}
      <GalleryContainer />
    </div>
  
  )
}