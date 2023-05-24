import React, {useCallback, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import "./InsertArtwork.css";
import {handleFloats} from "../Extra/Helper";
import ImageUpload from "../Images/ImageUpload";

function InsertImageLayer() {

    const navigate = useNavigate();
    let emailLogged = localStorage.getItem("email");

    const {id} = useParams();
    const [name, setName] = useState<string>("");
    const [depth, setDepth] = useState<string>("");
    const [selectedImageFile, setSelectedImageFile] = useState<File>();

    const [error, setError] = useState("");

    const InsertImageLayer = useCallback(() => {
        const formData = new FormData();
        if (selectedImageFile) {
            formData.append("file", selectedImageFile);
            formData.append("json", JSON.stringify({
                "layerName": name,
                "depth":depth,
                "artworkId": id,
                "user": emailLogged
            }))
            fetch('http://localhost:8080/image_layer/', {
                method: 'POST',
                mode: "cors",
                body: formData
            })
                .then(response => {
                    if (response.status === 201) {
                        navigate(-1)
                    } else {
                        return response.text()
                    }
                }).then(r => r && setError(r))
                .catch(r => console.log(r))
        }
    }, [id, selectedImageFile, name, depth, emailLogged, navigate])

    const handleSize = (w:number, h:number, img:File) => {
        setSelectedImageFile(img);
    };

    const checkParameters = () => {
        if (name.length === 0 || name === "" || depth === "" || selectedImageFile === undefined)
            return true
        return false
    }

    return (
        <div className={"InsertArtwork"}>
            <main>
                <section>
                    <div className={"img-selection"}>
                        {<ImageUpload handleSize={handleSize}/>}
                    </div>
                </section>
                <section>
                    <form className={"horizontal-form"}>
                        <div className={"form-section"}>
                            <h3>Layer Information</h3>
                            <p>
                                <label className={"required"}>Layer Name</label>
                                <input type="text" placeholder={"Artwork name"} value={name} onChange={e => {
                                    setName(e.target.value);
                                }}/>
                            </p>
                            <p>
                                <label className={"required"}>Depth</label>
                                <input type="number" placeholder="Insert in mm" value={depth}
                                       onChange={e => handleFloats(setDepth,e.target.value)}/>
                            </p>
                        </div>
                    </form>
                    <div className={"prevs"}>
                        <button disabled={checkParameters()} onClick={() => {
                            InsertImageLayer()
                        }}>Insert Image Layer
                        </button>
                        <p className="error">
                            {error.length > 0 && setTimeout(
                                () => setError(""),
                                2000
                            ) && error}</p>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default InsertImageLayer;