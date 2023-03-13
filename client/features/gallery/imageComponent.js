import React from 'react'

export function ImageComponent({imgUrl}) {
  return (
    <div>
      <img width="200px" src={imgUrl}></img>
    </div>

  )
}