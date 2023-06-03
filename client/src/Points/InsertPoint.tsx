import React, {useCallback, useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import "./InsertPoint.css";
import AddPointLeafLet from "../LeafLet/AddPointLeafLet";
import ImageUpload from "../Images/ImageUpload";
import {checkText, ImageSize} from "../Extra/Helper";
import Overlay from "../Extra/Overlay";

function InsertPoint(props: any) {

    const location = useLocation();
    const navigate = useNavigate();
    const img = location.state.img;
    const artId = location.state.artId;
    const pointId = location.state.pointId;

    const [position, setPosition] = useState({latitude: 0, longitude: 0});
    const [pointName, setPointName] = useState<String>("");
    const [fileSize, setFileSize] = useState<number>();
    const [layerName, setLayerName] = useState("");
    const [selectedImage, setSelectedImage] = useState<File>();
    const [metricWidth, setMetricWidth] = useState<Number>();
    const [metricHeight, setMetricHeight] = useState<Number>();
    const [date, setDate] = useState<String | null>(null);
    const [researcher, setResearcher] = useState<String>("");
    const [technique, setTechnique] = useState<String>();
    const [copyrights, setCopyrights] = useState<String[]>([]);
    const [materials, setMaterials] = useState<String[]>([]);

    const [layerNames, setLayerNames] = useState([])
    const [size, setSize] = useState<ImageSize>();

    const [error, setError] = useState("");

    const [isOpenCopyrights, setIsOpenCopyrights] = useState(false);
    const [isOpenMaterials, setIsOpenMaterials] = useState(false);

    const [emailLogged, setEmailLogged] = useState(localStorage.getItem("email"))

    useEffect(() => {
        setEmailLogged(localStorage.getItem("email"))
    },[emailLogged])

    useEffect(() => {
        fetch('http://localhost:8080/layer/all/', {
            method: 'GET',
            mode: "cors"
        })
            .then(response => {
                return response.json()
            })
            .then(data => setLayerNames(data))
            .catch(r => console.log(r))
    }, [])

    const toggleOverlayCopyrights = () => {
        setIsOpenCopyrights(!isOpenCopyrights);
    };

    const toggleOverlayMaterials = () => {
        setIsOpenMaterials(!isOpenMaterials);
    };

    const handlePosition = (lat: number, long: number) => {
        setPosition({latitude: lat, longitude: long});
    };

    const handleSize = (w: number, h: number, img: File) => {
        // 👇️ take the parameter passed from the Child component
        setSelectedImage(img);
        setFileSize(img.size);
        setSize({width: w, height:h});
    };

    const CreateZoomPoint = useCallback(() => {
        const formData = new FormData();
        if (selectedImage) {
            formData.append("file", selectedImage);
            formData.append("json", JSON.stringify({
                "artworkId": artId,
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
                "zoomPointId": pointId,
                "pixelWidth": size?.width,
                "pixelHeight": size?.height,
            }))
        }
        fetch('http://localhost:8080/zoom_point/', {
            method: 'POST',
            mode: "cors",
            body: formData
        })
            .then(response => {
                if (response.status === 201) {
                    alert("Zoom Point Created");
                    navigate(-1);
                } else {
                    return response.text()
                }
            }).then(r => r && setError(r))
            .catch(r => console.log(r))
    }, [artId, pointId , size, emailLogged, selectedImage, position, fileSize, metricWidth, metricHeight, pointName, layerName, researcher, technique, date, copyrights, materials, navigate])


    function checkParameters() {
        if (position == null || (position.longitude === 0 && position.latitude === 0) || pointName.length === 0 || researcher.length === 0 || metricWidth === 0 || metricWidth === undefined || metricHeight === undefined || metricHeight === 0 || selectedImage === undefined || fileSize === 0)
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
                            <AddPointLeafLet handlePosition={handlePosition} img={img} x={location.state.x}
                                             y={location.state.y}/>
                        </div>
                        <div className={"image-selection"}>
                            <ImageUpload handleSize={handleSize}/>
                        </div>
                    </div>
                </section>
                <section>
                    <div className={"horizontal-form"}>
                        <div className={"form-section"}>
                            <h3>General Information</h3>
                            <p>
                                <label className={"required"}>Point Name</label>
                                <input type="text" onChange={e => setPointName(e.target.value)} required/>
                            </p>
                            <p>
                                <label className={"required"}>Layer Name </label>
                                <select defaultValue={"default"} onChange={e => setLayerName(e.target.value)}>
                                    <option value="default" disabled hidden>
                                        Choose Layer Name
                                    </option>
                                    {layerNames.map((k) => <option key={k["layerName"]}>{k["layerName"]}</option>)}
                                </select>
                            </p>
                            <p>
                                <label className={"required"}>Metric Width</label>
                                <input type="number" placeholder={"Insert in mm"}
                                       onChange={e => setMetricWidth(parseFloat(e.target.value))} required/>
                            </p>
                            <p>
                                <label className={"required"}>Metric Height</label>
                                <input type="number" placeholder={"Insert in mm"}
                                       onChange={e => setMetricHeight(parseFloat(e.target.value))} required/>
                            </p>
                        </div>
                        <div className="form-break"/>
                        <div className={"form-section"}>
                            <h3>Other Information</h3>
                            <p>
                                <label className={"required"}>Researcher Name</label>
                                <input type="text" onChange={e => setResearcher(e.target.value)} required/>
                            </p>
                            <p>
                                <label>Technique Name </label>
                                <input type="text" onChange={e => setTechnique(e.target.value)}/>
                            </p>
                            <p>
                                <label>Date</label>
                                <input type="text" placeholder={"Date if known"}
                                       onChange={e => setDate(e.target.value)}
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
                            CreateZoomPoint()
                        }}>Create Zoom Point
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

export default InsertPoint;