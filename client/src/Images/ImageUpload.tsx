import React, {useEffect, useState} from "react";
import "./ImageUpload.css";

function ImageUpload(props:any){


    const [selectedImage, setSelectedImage] = useState();
    const [imgProp, setImgProp] = useState(props.img);

    useEffect(() =>{
        if(imgProp)
            setSelectedImage(imgProp);
    },[])

    const removeSelectedImage = () => {
        // @ts-ignore
        setSelectedImage();
    };

    return (
        <div className={"imagem"}>
            <label>Choose the image file.</label>
            <input type="file" accept="image/png, image/jpeg" onChange={(e) => {
                const ev = e.currentTarget.files;
                if (ev) {
                    if (ev.length === 0) {
                        return;
                    }
                    var img: HTMLImageElement;
                    img = document.createElement("img");
                    // @ts-ignore
                    var image = e.target.files[0];
                    img.onload = function () {
                        props.handleSize(img.width, img.height, image);
                    };
                    img.src = URL.createObjectURL(image);
                    // @ts-ignore
                    setSelectedImage(image);
                    setImgProp(undefined);
                }
            }}
            />
            {selectedImage && (
                <div className={"preview"}>
                    <div>
                        {imgProp?<img src={'data:image/png;base64,' + selectedImage} alt={""}></img>:<img src={URL.createObjectURL(selectedImage)} alt={""}></img>}
                    </div>
                    <button onClick={removeSelectedImage}>
                        Remove This Image
                    </button>
                </div>
            )}
        </div>
    );
}

export default ImageUpload;