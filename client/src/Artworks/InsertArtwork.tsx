import React, {useCallback, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import "./InsertArtwork.css";
import ImageUpload from "../Images/ImageUpload";
import {API_BASE_URL, ArtTypes, ImageSize} from "../Extra/Helper";

function InsertArtwork(){

    const navigate = useNavigate();
    const [artName, setArtName] = useState<String>("");
    const [author, setAuthor] = useState<String>("");
    const [artType, setArtType] = useState<String>("");
    const [date, setDate] = useState<String | null>(null);
    const [source, setSource] = useState<String>("");
    const [widthMetric, setWidthMetric] = useState("");
    const [heightMetric, setHeightMetric] = useState("");
    const [invNumber, setInvNumber] = useState<String>("");
    const [category, setCategory] = useState<String>("");
    const [superCategory, setSuperCategory] = useState<String>("");
    const [matter, setMatter] = useState<String>("");
    const [selectedImage, setSelectedImage] = useState<File>();

    const [size, setSize] = useState<ImageSize>();

    const [error, setError] = useState("");

    const handleSize = (w:number, h:number, img:File) => {
        // 👇️ take the parameter passed from the Child component
        setSize({width: w, height:h});
        setSelectedImage(img);
    };

    const [emailLogged, setEmailLogged] = useState(localStorage.getItem("email"))

    useEffect(() => {
        setEmailLogged(localStorage.getItem("email"))
    },[emailLogged])

    const CreateArtwork = useCallback( () => {
        const formData = new FormData();
        if(selectedImage){
            formData.append("file", selectedImage);
            formData.append("json", JSON.stringify({"name": artName,
                "author": author,
                "artType": artType,
                "source": source,
                "invNumber": invNumber,
                "superCategory": superCategory,
                "category": category,
                "matter": matter,
                "date": date===""?null:date,
                "width": widthMetric,
                "height" :heightMetric,
                "pixelWidth": size?.width,
                "pixelHeight": size?.height,
                "insertedBy": emailLogged
            }))
        }
       fetch(API_BASE_URL+'artwork/', {
            method: 'POST',
            body: formData
        })
            .then(response =>
            {
                if(response.status === 201){
                    navigate("/artworks")
                }
                else{
                    return response.text()
                }
            }).then(r=> r && setError(r))
           .catch(r=> console.log(r))
    }, [selectedImage, artName, author, artType, source, invNumber, superCategory, category, matter, date, emailLogged, size, heightMetric, widthMetric, navigate])

    const handleFloats = (setFunc:any, target:any) =>{
        if(target === "")
            setFunc("");
        else
            setFunc(parseFloat(target));
    }

    function checkParameters(){
        if(artName.length === 0 || source.length === 0
            || invNumber.length === 0  || category.length === 0 || superCategory.length === 0
            || matter.length === 0 || widthMetric === "" || heightMetric === "" || selectedImage === undefined || artType.length === 0)
            return true
        return false
    }

    return (
        <div className={"InsertArtwork"}>
            <main>
                <section>
                    <div className={"img-selection"}>
                        <ImageUpload handleSize={handleSize}/>
                    </div>
                </section>
                <section>
                    <form className={"horizontal-form"}>
                        <div className={"form-section"}>
                            <h3>General Information</h3>
                            <p>
                                <label className={"required"}>Artwork Name</label>
                                <input type="text" placeholder={"Artwork name"} onChange={e=> setArtName(e.target.value)} required={true}/>
                            </p>
                            <p>
                                <label>Author </label>
                                <input type="text" placeholder="If unknown, leave empty" onChange={e => setAuthor(e.target.value)}/>
                            </p>
                            <p>
                                <label className={"required"}>Artwork Type </label>
                                <select style={{width:190}} defaultValue={"default"} onChange={e => setArtType(e.target.value)}>
                                    <option value="default" disabled hidden>
                                        Choose Artwork Type
                                    </option>
                                    {ArtTypes.map((k) => <option key={k}>{k}</option>)}
                                </select>
                            </p>
                            <p>
                                <label>Artwork Date </label>
                                <input type="text" placeholder={"Date if known"} onChange={e => setDate(e.target.value)} onFocus={e => (e.target.type = "date")}
                                       onBlur={e => (e.target.type = "text")}/>
                            </p>
                            <p>
                                <label className={"required"}>Source </label>
                                <input type="text" placeholder="Source or Location" onChange={e => setSource(e.target.value)} required={true}/>
                            </p>
                        </div>
                        <div className="form-break"/>
                        <div className={"form-section"}>
                            <div className={"column"}>
                                <h3>Specific Information</h3>
                                <p>
                                    <label className={"required"}>Inventory Number </label>
                                    <input type="text" placeholder={"Inventory Number"} onChange={e => setInvNumber(e.target.value)} required={true}/>
                                </p>
                                <p>
                                    <label className={"required"}>Category </label>
                                    <input type="text" placeholder="Category" onChange={e => setCategory(e.target.value)} required={true}/>
                                </p>
                                <p>
                                    <label className={"required"}>Super Category </label>
                                    <input type="text" placeholder="Super Category" onChange={e => setSuperCategory(e.target.value)} required={true}/>
                                </p>
                                <p>
                                    <label className={"required"}>Matter </label>
                                    <input type="text" placeholder="Matter" onChange={e => setMatter(e.target.value)} required={true}/>
                                </p>
                            </div>
                        </div>
                        <div className="form-break"/>
                        <div className={"form-section"}>
                            <h3>Size Information</h3>
                            <p>
                                <label className={"required"}>Width </label>
                                <input type="number" placeholder="Insert in mm" onChange={e => handleFloats(setWidthMetric,e.target.value)} required={true}/>
                            </p>
                            <p>
                                <label className={"required"}>Height </label>
                                <input type="number" placeholder="Insert in mm" onChange={e =>handleFloats(setHeightMetric,e.target.value)} required={true}/>
                            </p>
                        </div>
                    </form>
                    <div className={"prevs"}>
                        <button disabled={checkParameters()} onClick={() => {
                            CreateArtwork()
                        }}>Create Artwork</button>
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

export default InsertArtwork;