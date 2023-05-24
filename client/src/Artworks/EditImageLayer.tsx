import React, {useCallback, useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import "./InsertArtwork.css";
import {handleFloats} from "../Extra/Helper";
import ImageUpload from "../Images/ImageUpload";

function EditImageLayer() {

    const navigate = useNavigate();
    let emailLogged = localStorage.getItem("email");

    const {id} = useParams();
    const [layer, setLayer] = useState()
    const [name, setName] = useState<string>("");
    const [depth, setDepth] = useState<string>("");
    const [artId, setArtId] = useState()
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
    const [selectImage, setSelectImage] = useState();

    const [error, setError] = useState("");

    useEffect(() => {
        const setData = () => {
            if (layer) {
                setName(layer["layerName"])
                setDepth(layer["depth"])
                setSelectImage(layer["image"])
                setArtId(layer["artworkId"])
            }
        }
        setData();
    }, [layer])

    useEffect(() => {
        if (emailLogged === null || emailLogged === "")
            navigate("/")
    }, [emailLogged, navigate])

    useEffect(() => {

        fetch('http://localhost:8080/image_layer/id/' + id, {
            method: 'GET',
            mode: "cors"
        })
            .then(response => {
                if (response.status === 200) {
                    return response.json()
                } else {
                    return response.text()
                }
            })
            .then(data => {
                setLayer(data);
            })
            .catch(r => r)
    }, [id])

    const EditImageLayer = useCallback(() => {
        const formData = new FormData();
        if (selectedImageFile) {
            formData.append("file", selectedImageFile);
            formData.append("json", JSON.stringify({
                "layerName": name,
                "depth": depth,
                "artworkId": artId,
                "user": emailLogged
            }))
            fetch('http://localhost:8080/image_layer/file/' + id, {
                method: 'PUT',
                mode: "cors",
                body: formData
            })
                .then(response => {
                    if (response.status === 200) {
                        navigate(-1)
                    } else {
                        return response.text()
                    }
                }).then(r => r && setError(r))
                .catch(r => console.log(r))
        } else {
            fetch('http://localhost:8080/image_layer/' + id, {
                method: 'PUT',
                mode: "cors",
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify({
                    "layerName": name,
                    "depth": depth,
                    "artworkId": artId,
                    "user": emailLogged
                })
            })
                .then(response => {
                    if (response.status === 200) {
                        navigate(-1)
                    } else {
                        return response.text()
                    }
                }).then(r => r && setError(r))
                .catch(r => console.log(r))
        }
    }, [id, selectedImageFile, name, depth, emailLogged, navigate, artId])

    const handleSize = (w: number, h: number, img: File) => {
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
                        {layer && selectImage && <ImageUpload handleSize={handleSize} img={selectImage}/>}
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
                                       onChange={e => handleFloats(setDepth, e.target.value)}/>
                            </p>
                        </div>
                    </form>
                    <div className={"prevs"}>
                        <button disabled={checkParameters()} onClick={() => {
                            EditImageLayer()
                        }}>Update Image Layer
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

export default EditImageLayer;