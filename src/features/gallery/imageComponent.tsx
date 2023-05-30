
interface ImageComponentProps {
  imgUrl: string;
}

export function ImageComponent({ imgUrl } : ImageComponentProps) {
  return (
    <div className="imageComponentContainer">
      <img className="imageComponent" src={imgUrl}></img>
    </div>
  );
}
