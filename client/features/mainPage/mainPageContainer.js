import React from 'react'
import { GalleryContainer } from '../gallery/galleryContainer'
import { SearchComponent } from './searchComponent'

export function MainPage() {

  return (
    <>
      <div class="header">
        <a href="#default" class="logo">Optica</a>
        <div class="header-right">
          <a class="active" href="#home">Home</a>
          <a href="#contact">Contact</a>
          <a href="#about">About</a>
        </div>
      </div>
      <div className='mainPage'>
        <SearchComponent />
        {/* <ImageUploadComponent /> */}
        <GalleryContainer />
      </div>
    </>
  )
}