import React, { useState, useEffect } from "react";
// git
const convertImgToUint8 = (file) => {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => {
      console.log("onload", reader.result);
      const Uint8Arr = Array.from(new Uint8Array(reader.result));
      res(Uint8Arr);
    };
    reader.onerror = () => {
      rej("Conversion error");
    };
    reader.readAsArrayBuffer(file);
  });
};

const convertUint8ToImg = async (binaryData, imageType = "image/png") => {
  const blob = new Blob([binaryData], { type: imageType });
  const imageURL = URL.createObjectURL(blob);
  return imageURL;
};

const BlobView = () => {
  const [image, setImage] = useState("");
  useEffect(() => {
    if (image === "") {
      try {
        const asyncFetch = async () => {
          const res = await fetch("/imagesV2/get_image?id=641202bd01b9c9b19822ab35");
          const json = await res.json();
          const img = json[0];
          console.log(img.image.data);
          const Uint8 = new Uint8Array(img.image.data);
          const url = await convertUint8ToImg(Uint8, "image/png");
          setImage(url);
        };
        asyncFetch();
      } catch (err) {
        console.log(err);
      }
    }
  }, []);

  const handleChange = async (e) => {
    try {
      console.log(e.target.files[0]);
      const file = e.target.files[0];
      const Uint8Arr = await convertImgToUint8(file);
      const binaryJSON = JSON.stringify(Uint8Arr);
      console.log("sending binary", binaryJSON);
      const res = await fetch("/imagesV2/save_image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // body: JSON.stringify({ image: binary, tags: [new Date()] }),
        body: JSON.stringify({ image: Uint8Arr }),
      });
      const json = await res.json();
      console.log(json);
    } catch (err) {
      console.log("Change Error", err);
    }
  };

  return (
    <>
      <div>
        IMAGE:
        <img src={image} alt="" />
      </div>
      <input type="file" onChange={handleChange}></input>
    </>
  );
};

export default BlobView;
