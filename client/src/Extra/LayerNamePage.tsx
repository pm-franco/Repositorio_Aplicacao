import React, {useCallback, useEffect, useState} from 'react';
import "./LayerNamePage.css";
import {useNavigate} from "react-router-dom";
import {ADMIN} from "./Helper";
import OverlayPassword from "./OverlayPassword";

function LayerName() {


    const [name, setName] = useState("")
    const [multiplePoints, setMultiplePoints] = useState(false)
    const [error, setError] = useState("")
    const [layerNames, setLayerNames] = useState([])
    const navigate = useNavigate();

    const [id, setId] = useState()
    const [emailLogged, setEmailLogged] = useState(localStorage.getItem("email"))
    const [roleLogged, setRoleLogged] = useState(localStorage.getItem("role"))
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setEmailLogged(localStorage.getItem("email"))
        setRoleLogged(localStorage.getItem("role"))
    }, [emailLogged, roleLogged])

    useEffect(() => {
        if (roleLogged !== ADMIN)
            navigate("/")
    }, [roleLogged, navigate])

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
    }, [layerNames])

    const deleteLayer = useCallback(() => {
        fetch('http://localhost:8080/layer/', {
            method: "delete",
            mode: "cors",
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                "layerName": id,
                "user": emailLogged
            })
        })
            .then(response => {
                if (response.status === 200) {
                    console.log("removed")
                } else {
                    return response.text()
                }
            }).then(r => r && setError(r))
            .catch(r => console.log(r))
    }, [emailLogged, id])

    const addLayer = useCallback(() => {
        fetch('http://localhost:8080/layer/', {
            method: "post",
            mode: "cors",
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                "layerName": name,
                "multiplePoints": multiplePoints,
                "user": emailLogged
            })
        })
            .then(response => {
                if (response.status === 201) {
                    console.log("added")
                } else {
                    return response.text()
                }
            }).then(r => r && setError(r))
            .catch(r => console.log(r))
    }, [name, emailLogged, multiplePoints])

    function handleClick() {
        addLayer();
        setName("")
    }

    const toggleOverlay = () => {
        setIsOpen(!isOpen);
    };

    const handleDelete = (idLayer: any) => {
        setIsOpen(!isOpen);
        setId(idLayer);
    };

    return (
        <div className="LayerName">
            <main>
                <section>
                    <div className={"horizontal-form"}>
                        <div className={"form-section"}>
                            <h3>Insert Layer Name</h3>
                            <p>
                                <label className={"required"}>Layer Name</label>
                            </p>
                            <p>
                                <input type={"text"} placeholder={"write value"} value={name}
                                       onChange={e => setName(e.target.value)}/>
                            </p>
                            <p>
                                <label className={"required"}>Allow Points</label>
                            </p>
                            <p>
                                <select onChange={e => setMultiplePoints(Boolean(e.target.value))}>
                                    <option value={"false"}>False</option>
                                    <option value={"true"}>True</option>
                                </select>
                            </p>
                            <button className={"btn"} disabled={name === ""} onClick={handleClick}>Insert</button>
                            <p/>
                        </div>
                    </div>
                </section>
                <section>
                    <div className={"horizontal-form"}>
                        <div className={"form-section"}>
                            <div className={"btns"}>

                                <h3 className={"title"}>Available Layer Names</h3>
                                <table border={2} cellPadding={15}>
                                    <thead>
                                    <tr>
                                        <th>Layer Name</th>
                                        <th>Allow Points</th>
                                        <th>Remove</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {layerNames.map((value: any) => {
                                        return (
                                            <tr key={value["layerName"]}>
                                                <td>{value["layerName"]}</td>
                                                <td>{value["multiplePoints"] === true ? "Yes" : "No"}</td>
                                                <td>
                                                    <button onClick={() => handleDelete(value["layerName"])}>Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                    </tbody>
                                </table>
                                <p className="error">
                                    {error.length > 0 && setTimeout(() => setError(""), 2000) && error}</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <OverlayPassword isOpen={isOpen} onClose={toggleOverlay} deleteFunction={deleteLayer}
                             email={emailLogged}></OverlayPassword>
        </div>
    );
}

export default LayerName;
