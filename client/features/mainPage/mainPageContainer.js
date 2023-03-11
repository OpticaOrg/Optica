import React from 'react'
import { GalleryContainer } from '../gallery/galleryContainer'
import { SearchComponent } from './searchComponent'

export function MainPage() {

  return(
    <div className='mainPage'>
      <SearchComponent />
      {/* <ImageUploadComponent /> */}
      <GalleryContainer />
    </div>
  
  )
}