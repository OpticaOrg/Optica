import React from 'react'

export function ImageComponent({ imgUrl }) {
  return (
    <div className='imageComponentContainer'>
      <img className='imageComponent' src={imgUrl}></img>
    </div>

  )
}