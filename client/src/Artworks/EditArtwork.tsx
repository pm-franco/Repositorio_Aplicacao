import React, {useCallback, useEffect, useState} from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import "./InsertArtwork.css";
import {ArtTypes, ImageSize} from "../Extra/Helper";
import ImageUpload from "../Images/ImageUpload";

function EditArtwork(props: any) {

    const navigate = useNavigate();
    let emailLogged = localStorage.getItem("email");

    const [aux, setAux] = useState(0);

    const {id} = useParams();
    const [artwork, setArtwork] = useState()
    const [artName, setArtName] = useState<string>("");
    const [author, setAuthor] = useState<string>("");
    const [artType, setArtType] = useState("");
    const [date, setDate] = useState<string>("");
    const [source, setSource] = useState<string>("");
    const [widthMetric, setWidthMetric] = useState("");
    const [heightMetric, setHeightMetric] = useState("");
    const [invNumber, setInvNumber] = useState<string>("");
    const [category, setCategory] = useState<string>("");
    const [superCategory, setSuperCategory] = useState<string>("");
    const [matter, setMatter] = useState<string>("");
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
    const [selectImage, setSelectImage] = useState();
    const [size, setSize] = useState<ImageSize>();

    const [error, setError] = useState("");

    const setData = () => {
        if (artwork && aux === 0) {
            setArtName(artwork["name"]);
            setAuthor(artwork["author"]);
            setArtType(artwork["artType"]);
            let d = artwork["date"];
            if (d === null) {
                setDate("");
            } else {
                setDate(d);
            }
            setSource(artwork["source"]);
            setWidthMetric(artwork["width"]);
            setHeightMetric(artwork["height"]);
            setInvNumber(artwork["invNumber"]);
            setCategory(artwork["category"]);
            setSuperCategory(artwork["superCategory"]);
            setMatter(artwork["matter"]);
            setSelectImage(artwork["image"]);
            setSize({width: artwork["pixelWidth"], height: artwork["pixelHeight"]});
            setAux(1);
        }
    }


    useEffect(() => {
        if (aux === 0) {
            if (emailLogged === null || emailLogged === "")
                navigate("/")
            fetch('http://localhost:8080/artwork/id/' + id, {
                method: 'GET',
                mode: "cors"
            })
                .then(response => {
                    if (response.status === 200) {
                        return response.json()
                    } else {
                        //navigate("/artworks")
                    }
                })
                .then(data => {
                    setArtwork(data);
                    setData();
                })
                .catch(r => r)
        }
    }, [id, setData])

    const EditArtwork = useCallback(() => {
        const formData = new FormData();
        if (selectedImageFile) {
            formData.append("file", selectedImageFile);
            formData.append("json", JSON.stringify({
                "name": artName,
                "author": author,
                "artType": artType,
                "source": source,
                "invNumber": invNumber,
                "superCategory": superCategory,
                "category": category,
                "matter": matter,
                "date": date === "" ? null : date,
                "width": widthMetric,
                "height": heightMetric,
                "pixelWidth": size?.width,
                "pixelHeight": size?.height,
                "insertedBy": emailLogged
            }))
            fetch('http://localhost:8080/artwork/file/'+id, {
                method: 'PUT',
                mode: "cors",
                body: formData
            })
                .then(response => {
                    if (response.status === 200) {
                        alert("Artwork Edited");
                        navigate(-1)
                    } else {
                        return response.text()
                    }
                }).then(r => r && setError(r))
                .catch(r => console.log(r))
        } else {
            fetch('http://localhost:8080/artwork/' + id, {
                method: 'PUT',
                mode: "cors",
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify({
                    "name": artName,
                    "author": author,
                    "artType": artType,
                    "source": source,
                    "invNumber": invNumber,
                    "superCategory": superCategory,
                    "category": category,
                    "matter": matter,
                    "date": date === "" ? null : date,
                    "width": widthMetric,
                    "height": heightMetric,
                    "pixelWidth": size?.width,
                    "pixelHeight": size?.height,
                    "insertedBy": emailLogged
                })
            })
                .then(response => {
                    if (response.status === 200) {
                        alert("Artwork Edited");
                        navigate(-1)
                    } else {
                        return response.text()
                    }
                }).then(r => r && setError(r))
                .catch(r => console.log(r))
        }
    }, [id, selectedImageFile, artName, size ,author, artType, source, invNumber, superCategory, category, matter, date, emailLogged, heightMetric, widthMetric, navigate])

    const handleSize = (w: number, h: number, imgFile: File) => {
        setSelectedImageFile(imgFile);
        setSize({width: w, height: h});
        alert("Changing artwork image may affect zoom points positions.")
    };

    const checkParameters = () => {
        if (artwork === undefined || artName.length === 0 || source.length === 0
            || invNumber.length === 0 || category.length === 0 || superCategory.length === 0
            || matter.length === 0 || widthMetric === "" || heightMetric === "" || artType.length === 0 || (selectedImageFile === undefined && selectImage === undefined))
            return true
        return false
    }

    const handleFloats = (setFunc:any, target:any) =>{
        if(target === "")
            setFunc("");
        else
            setFunc(parseFloat(target));
    }

    return (
        <div className={"InsertArtwork"}>
            <main>
                <section>
                    <div className={"img-selection"}>
                        {artwork && <ImageUpload handleSize={handleSize} img={artwork["image"]}/>}
                    </div>
                </section>
                <section>
                    <form className={"horizontal-form"}>
                        <div className={"form-section"}>
                            <h3>General Information</h3>
                            <p>
                                <label className={"required"}>Artwork Name</label>
                                <input type="text" placeholder={"Artwork name"} value={artName} onChange={e => {
                                    setArtName(e.target.value);
                                }}/>
                            </p>
                            <p>
                                <label>Author</label>
                                <input type="text" placeholder="If unknown, leave empty" value={author}
                                       onChange={e => setAuthor(e.target.value)}/>
                            </p>
                            <p>
                                <label className={"required"}>Artwork Type</label>
                                <select style={{width:190}} value={artType} onChange={e => setArtType(e.target.value)}>
                                    {ArtTypes.map((k) => <option key={k} value={k}>{k}</option>)}
                                </select>
                            </p>
                            <p>
                                <label>Artwork Date</label>
                                <input type="text" placeholder={"Date if known"} value={date.split("T")[0]}
                                       onChange={e => setDate(e.target.value)}
                                       onFocus={e => (e.target.type = "date")}
                                       onBlur={e => (e.target.type = "text")}/>
                            </p>
                            <p>
                                <label className={"required"}>Source </label>
                                <input type="text" placeholder="Source or Location"
                                       value={source} onChange={e => setSource(e.target.value)}/>
                            </p>
                        </div>
                        <div className="form-break"/>
                        <div className={"form-section"}>
                            <div className={"column"}>
                                <h3>Specific Information</h3>
                                <p>
                                    <label className={"required"}>Inventory Number</label>
                                    <input type="text" placeholder={"Inventory Number"} value={invNumber}
                                           onChange={e => setInvNumber(e.target.value)}/>
                                </p>
                                <p>
                                    <label className={"required"}>Category</label>
                                    <input type="text" placeholder="Category" value={category}
                                           onChange={e => setCategory(e.target.value)}/>
                                </p>
                                <p>
                                    <label className={"required"}>Super Category </label>
                                    <input type="text" placeholder="Super Category" value={superCategory}
                                           onChange={e => setSuperCategory(e.target.value)}/>
                                </p>
                                <p>
                                    <label className={"required"}>Matter </label>
                                    <input type="text" placeholder="Matter" value={matter}
                                           onChange={e => setMatter(e.target.value)}/>
                                </p>
                            </div>
                        </div>
                        <div className="form-break"/>
                        <div className={"form-section"}>
                            <h3>Size Information</h3>
                            <p>
                                <label className={"required"}>Width</label>
                                <input type="number" placeholder="Insert in mm" value={widthMetric}
                                       onChange={e => handleFloats(setWidthMetric,e.target.value)}/>
                            </p>
                            <p>
                                <label className={"required"}>Height {heightMetric}</label>
                                <input type="number" placeholder="Insert in mm" value={heightMetric}
                                       onChange={e => handleFloats(setHeightMetric,e.target.value)}/>
                            </p>
                        </div>
                    </form>
                    <div className={"prevs"}>
                        <button disabled={checkParameters()} onClick={() => {
                            EditArtwork()
                        }}>Edit Artwork Data
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

export default EditArtwork;