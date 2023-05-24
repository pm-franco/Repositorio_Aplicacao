import React, {useCallback, useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import "./InsertEquipment.css";
import Overlay from "../Extra/Overlay";
import {checkText} from "../Extra/Helper";

function EditEquipment(props: any) {

    const navigate = useNavigate();

    const {id} = useParams();
    const [equipment, setEquipment] = useState()
    const [equipName, setEquipName] = useState<string>("");
    const [idPoint, setIdPoint] = useState()
    const [characteristics, setCharacteristics] = useState<String[]>([]);
    const [licenses, setLicenses] = useState<String[]>([]);

    const [error, setError] = useState("");

    const [isOpenCharacteristics, setIsOpenCharacteristics] = useState(false);
    const [isOpenLicenses, setIsOpenLicenses] = useState(false);

    const [emailLogged, setEmailLogged] = useState(localStorage.getItem("email"))

    useEffect(() => {
        setEmailLogged(localStorage.getItem("email"))
    }, [emailLogged])

    useEffect(() => {
        const setData = () => {
            if (equipment) {
                setEquipName(equipment["name"])
                setIdPoint(equipment["zoomPointId"])
                let characteristicsArray = equipment["characteristics"];
                if (characteristicsArray !== null)
                    setCharacteristics(characteristicsArray);
                let licensesArray = equipment["licenses"];
                if (licensesArray !== null)
                    setLicenses(licensesArray);
            }
        }
        setData();
    }, [equipment])

    useEffect(() => {
        if (emailLogged === null || emailLogged === "")
            navigate("/")
    }, [emailLogged, navigate])

    useEffect(() => {
        fetch('http://localhost:8080/equipment/id/' + id, {
            method: 'GET',
            mode: "cors"
        })
            .then(response => {
                if (response.status === 200) {
                    return response.json()
                }
                return response.text()
            })
            .then(data => {
                setEquipment(data);

            })
            .catch(r => r)
    }, [id])


    const toggleOverlayCharacteristics = () => {
        setIsOpenCharacteristics(!isOpenCharacteristics);
    };

    const toggleOverlayLicenses = () => {
        setIsOpenLicenses(!isOpenLicenses);
    };

    const UpdateEquipment = useCallback(() => {
        fetch('http://localhost:8080/equipment/' + id, {
            method: 'put',
            mode: "cors",
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                "zoomPointId": idPoint,
                "name": equipName,
                "characteristics": characteristics,
                "licenses": licenses,
                "user": emailLogged
            })
        })
            .then(response => {
                if (response.status === 200) {
                    alert("Equipment Updated")
                    navigate(-1)
                } else {
                    return response.text()
                }
            }).then(r => r && setError(r))
            .catch(r => console.log(r))
    }, [id, emailLogged, equipName, characteristics, licenses, navigate, idPoint])

    function checkParameters() {
        return equipName?.length === 0;
    }

    const handleCharacteristics = (characteristic: any) => {
        // @ts-ignore
        setCharacteristics([...characteristics, characteristic])
    }

    const handleLicenses = (license: any) => {
        // @ts-ignore
        setLicenses([...licenses, license])
    }

    const deleteByIndexCharacteristics = (index: number) => {
        setCharacteristics((oldValues: any[]) => {
            return oldValues.filter((_, i) => i !== index)
        })
    }

    const deleteByIndexLicenses = (index: number) => {
        setLicenses((oldValues: any[]) => {
            return oldValues.filter((_, i) => i !== index)
        })
    }

    return (
        <div className={"InsertEquipment"}>
            <main>
                <section>
                    <div className={"horizontal-form"}>
                        <div className={"form-section"}>
                            <h3>Equipment Information</h3>
                            <p>
                                <label className={"required"}>Equipment Name</label>
                            </p>
                            <input type="text" value={equipName} onChange={e => setEquipName(e.target.value)} required/>
                            <div className={"space_top"}>
                                <label>Characteristics</label>
                            </div>
                            <div className={"space_top"}>
                                {checkText(characteristics, "characteristic")}
                            </div>
                            <div className={"space_top"}>
                                <button onClick={toggleOverlayCharacteristics}>Insert Characteristics</button>
                            </div>
                            <div className={"space_top"}>
                                <label>Licenses</label>
                            </div>
                            <div className={"space_top"}>
                                {checkText(licenses, "license")}
                            </div>
                            <div className={"space_top"}>
                                <button onClick={toggleOverlayLicenses}>Insert Licenses</button>
                            </div>
                            <div className={"space_top"}/>
                        </div>
                    </div>
                    <div className={"prevs"}>
                        <button disabled={checkParameters()} onClick={() => {
                            UpdateEquipment()
                        }}>Update Equipment
                        </button>
                        <p className="error">
                            {error.length > 0 && setTimeout(
                                () => setError(""),
                                2000
                            ) && error}</p>
                    </div>
                </section>
                <Overlay isOpen={isOpenCharacteristics} onClose={toggleOverlayCharacteristics}
                         name={"Characteristics"} setList={handleCharacteristics} array={characteristics}
                         deleteFromArray={deleteByIndexCharacteristics}></Overlay>
                <Overlay isOpen={isOpenLicenses} onClose={toggleOverlayLicenses} name={"Licenses"}
                         setList={handleLicenses} array={licenses}
                         deleteFromArray={deleteByIndexLicenses}></Overlay>
            </main>
        </div>
    );
}

export default EditEquipment;