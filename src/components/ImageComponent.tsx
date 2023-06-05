import React from 'react';
interface ImageComponentProps {
  imgUrl: string
}

export function ImageComponent ({ imgUrl }: ImageComponentProps): JSX.Element {
  return (
    <div className="imageComponentContainer">
      <img className="imageComponent" src={imgUrl}></img>
    </div>
  );
}
