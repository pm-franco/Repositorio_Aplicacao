import React, {useCallback, useEffect, useState} from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import "./InsertPoint.css";
import AddPointLeafLet from "../LeafLet/AddPointLeafLet";
import ImageUpload from "../Images/ImageUpload";
import {checkText, ImageSize} from "../Extra/Helper";
import Overlay from "../Extra/Overlay";

function EditPoint(props: any) {

    const navigate = useNavigate();
    const [idArtwork, setIdArtwork] = useState(-1);
    const {id} = useParams();
    const [point, setPoint] = useState()
    const [artwork, setArtwork] = useState()
    const [aux, setAux] = useState(0);

    const [position, setPosition] = useState({latitude: 0, longitude: 0});

    const [pointName, setPointName] = useState<string>();
    const [fileSize, setFileSize] = useState<number>();
    const [layerName, setLayerName] = useState("");
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
    const [metricWidth, setMetricWidth] = useState<number>();
    const [metricHeight, setMetricHeight] = useState<number>();
    const [date, setDate] = useState<string>("");
    const [researcher, setResearcher] = useState<string>();
    const [technique, setTechnique] = useState<string>("");
    const [copyrights, setCopyrights] = useState<string[]>([]);
    const [materials, setMaterials] = useState<string[]>([]);
    const [selectImage, setSelectImage] = useState();
    const [layerNames, setLayerNames] = useState([]);
    const [size, setSize] = useState<ImageSize>();

    const [error, setError] = useState("");

    const [isOpenCopyrights, setIsOpenCopyrights] = useState(false);
    const [isOpenMaterials, setIsOpenMaterials] = useState(false);

    const [emailLogged, setEmailLogged] = useState(localStorage.getItem("email"))

    useEffect(() => {
        setEmailLogged(localStorage.getItem("email"))
    },[emailLogged])

    const setData = () => {
        if (point && aux === 0) {
            setPointName(point["name"])
            setPosition({latitude: point["positionY"], longitude: point["positionX"]})
            setLayerName(point["layerName"]);
            setMetricWidth(point["metricWidth"]);
            setMetricHeight(point["metricHeight"])
            let d = point["date"];
            if (d === null) {
                setDate("");
            } else {
                setDate(d);
            }
            setResearcher(point["author"]);
            setTechnique(point["technique"]);
            setFileSize(point["fileSize"])
            setSelectImage(point["image"]);
            let copyrightsArray = point["copyrights"];
            if(copyrightsArray !== null)
                setCopyrights(copyrightsArray);
            let materialsArray = point["materials"];
            if(materialsArray !== null)
                setMaterials(materialsArray);
            setAux(1);
        }
    }

    useEffect(() => {
        if (aux === 0) {
            if (emailLogged === null || emailLogged === "")
                navigate("/")
            fetch('http://localhost:8080/zoom_point/id/' + id, {
                method: 'GET',
                mode: "cors"
            })
                .then(response => {
                    if (response.status === 200) {
                        return response.json()
                    } else {
                        return response.text();
                    }
                })
                .then(data => {
                    setPoint(data);
                    setIdArtwork(data["artworkId"]);
                    setData();
                })
                .catch(r => r)
            if (idArtwork > 0) {
                fetch('http://localhost:8080/artwork/id/' + idArtwork, {
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
        }
    }, [id, setData, idArtwork])

    useEffect(() => {
        setData();
        fetch('http://localhost:8080/layer/all/', {
            method: 'GET',
            mode: "cors",
        })
            .then(response => {
                return response.json()
            })
            .then(data => setLayerNames(data))
            .catch(r => console.log(r))
    }, [idArtwork, setData])

    const toggleOverlayCopyrights = () => {
        setIsOpenCopyrights(!isOpenCopyrights);
    };

    const toggleOverlayMaterials = () => {
        setIsOpenMaterials(!isOpenMaterials);
    };

    const handlePosition = (lat: number, long: number) => {
        setPosition({latitude: lat, longitude: long});
    };

    const handleSize = (w: number, h: number, imgFile: File) => {
        setSelectedImageFile(imgFile);
        setFileSize(imgFile.size);
        setSize({width: w, height:h});
    };

    const EditZoomPoint = useCallback(() => {
        const formData = new FormData();
        if (selectedImageFile) {
            formData.append("file", selectedImageFile);
            formData.append("json", JSON.stringify({
                "artworkId": idArtwork,
                "positionX": position.longitude,
                "positionY": position.latitude,
                "fileSize": fileSize,
                "metricWidth": metricWidth,
                "metricHeight": metricHeight,
                "name": pointName,
                "layerName": layerName,
                "author": researcher,
                "technique": technique,
                "date": date===""?null:date,
                "copyrights": copyrights,
                "materials": materials,
                "user": emailLogged,
                "pixelWidth": size?.width,
                "pixelHeight": size?.height,
            }))
        // @ts-ignore
        fetch('http://localhost:8080/zoom_point/file/'+id, {
            method: 'PUT',
            mode: "cors",
            body: formData
        })
            .then(response => {
                if (response.status === 200) {
                    alert("Zoom Point Edited.");
                    navigate(-1)
                } else {
                    return response.text()
                }
            }).then(r => r && setError(r))
            .catch(r => console.log(r))
        }
        else {
            // @ts-ignore
            fetch('http://localhost:8080/zoom_point/'+point["id"], {
                method: 'PUT',
                mode: "cors",
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify({
                    "artworkId": idArtwork,
                    "positionX": position.longitude,
                    "positionY": position.latitude,
                    "fileSize": fileSize,
                    "metricWidth": metricWidth,
                    "metricHeight": metricHeight,
                    "name": pointName,
                    "layerName": layerName,
                    "author": researcher,
                    "technique": technique,
                    "date": date===""?null:date,
                    "copyrights": copyrights,
                    "materials": materials,
                    "user": emailLogged,
                    "zoomPointId": id
                })
            })
                .then(response => {
                    if (response.status === 200) {
                        alert("Zoom Point Edited.");
                        navigate(-1)
                    } else {
                        return response.text()
                    }
                }).then(r => r && setError(r))
                .catch(r => console.log(r))
        }
    }, [idArtwork, emailLogged, point,selectedImageFile, position, fileSize, metricWidth, metricHeight, pointName, layerName, researcher, technique, date, copyrights, materials, navigate])


    function checkParameters() {
        if ( (position.longitude === 0 && position.latitude === 0) || pointName?.length === 0 || researcher?.length === 0 || metricWidth === 0 || metricHeight === 0 || (selectedImageFile === undefined && selectImage === undefined) || fileSize === 0)
            return true;
        return false;
    }

    const handleCopyrights = (copyright: any) => {
        setCopyrights([...copyrights, copyright])
    }

    const handleMaterials = (material: any) => {
        setMaterials([...materials, material])
    }

    const deleteByIndexCopyrights = (index: number) => {
        setCopyrights((oldValues: any[]) => {
            return oldValues.filter((_, i) => i !== index)
        })
    }

    const deleteByIndexMaterials = (index: number) => {
        setMaterials((oldValues: any[]) => {
            return oldValues.filter((_, i) => i !== index)
        })
    }

    return (
        <div className={"InsertPoint"}>
            <main>
                <section>
                    <div className={"row"}>
                        <div className={"leaf-point"}>
                            {point && artwork && <AddPointLeafLet handlePosition={handlePosition} img={'data:image/png;base64,'+artwork["image"]} x={artwork["pixelWidth"]}
                                             y={artwork["pixelHeight"]} positionX={point["positionY"]} positionY={point["positionX"]}/>}
                        </div>
                        <div className={"image-selection"}>
                            {point && <ImageUpload handleSize={handleSize} img={point["image"]}/>}
                        </div>
                    </div>
                </section>
                <section>
                    <div className={"horizontal-form"}>
                        <div className={"form-section"}>
                            <h3>General Information</h3>
                            <p>
                                <label className={"required"}>Point Name</label>
                                <input type="text" defaultValue={pointName} onChange={e => setPointName(e.target.value)}/>
                            </p>
                            <p>
                                <label className={"required"}>Layer Name </label>
                                <select value={layerName} onChange={e => setLayerName(e.target.value)}>
                                    {layerNames.map((k:any) => <option key={k["layerName"]}>{k["layerName"]}</option>)}
                                </select>
                            </p>
                            <p>
                                <label className={"required"}>Metric Width</label>
                                <input type="number" placeholder={"Insert in mm"} defaultValue={metricWidth}
                                       onChange={e => setMetricWidth(parseFloat(e.target.value))} />
                            </p>
                            <p>
                                <label className={"required"}>Metric Height</label>
                                <input type="number" placeholder={"Insert in mm"} defaultValue={metricHeight}
                                       onChange={e => setMetricHeight(parseFloat(e.target.value))}/>
                            </p>
                        </div>
                        <div className="form-break"/>
                        <div className={"form-section"}>
                            <h3>Other Information</h3>
                            <p>
                                <label className={"required"}>Researcher Name</label>
                                <input type="text" defaultValue={researcher} onChange={e => setResearcher(e.target.value)}/>
                            </p>
                            <p>
                                <label>Technique Name </label>
                                <input type="text" placeholder={"technique"} value={technique} onChange={e => setTechnique(e.target.value)}/>
                            </p>
                            <p>
                                <label>Date</label>
                                <input type="text" placeholder={"Date if known"} value={date.split("T")[0]} onChange={e => setDate(e.target.value)}
                                       onFocus={e => (e.target.type = "date")}
                                       onBlur={e => (e.target.type = "text")}/>
                            </p>
                        </div>
                        <div className="form-break"/>
                        <div className={"form-section"}>
                            <h3>Extra Information</h3>
                            <p>
                                <label>Copyrights </label>
                            </p>
                            <div className={"space_top"}>
                                {checkText(copyrights, "copyright")}
                            </div>
                            <div className={"space_top"}>
                                <button onClick={toggleOverlayCopyrights}>Insert Copyrights</button>
                            </div>
                            <div className={"space_top"}>
                            </div>
                            <p>
                                <label>Materials</label>
                            </p>
                            <div className={"space_top"}>
                                {checkText(materials, "material")}
                            </div>
                            <div className={"space_top"}>
                                <button onClick={toggleOverlayMaterials}>Insert Materials</button>
                            </div>
                        </div>
                    </div>
                    <div className={"prevs"}>
                        <button disabled={checkParameters()} onClick={() => {
                            EditZoomPoint()
                        }}>Edit Zoom Point
                        </button>
                        <p className="error">
                            {error.length > 0 && setTimeout(
                                () => setError(""),
                                2000
                            ) && error}</p>
                    </div>
                </section>
            </main>
            <Overlay isOpen={isOpenCopyrights} onClose={toggleOverlayCopyrights} name={"Copyrights"}
                     setList={handleCopyrights} array={copyrights}
                     deleteFromArray={deleteByIndexCopyrights}></Overlay>
            <Overlay isOpen={isOpenMaterials} onClose={toggleOverlayMaterials} name={"Materials"}
                     setList={handleMaterials} array={materials}
                     deleteFromArray={deleteByIndexMaterials}></Overlay>
        </div>
    );
}

export default EditPoint;