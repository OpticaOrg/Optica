import React from 'react'

export function ImageComponent({imgUrl}) {
  return (
    <div>
      <img className="imageComponent" src={imgUrl}></img>
    </div>

  )
}