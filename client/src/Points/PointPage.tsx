import React, {useCallback, useEffect, useState} from 'react';
import {Link, useLocation, useNavigate, useParams} from 'react-router-dom';
import "./PointPage.css";
import {ADMIN, RESEARCHER} from "../Extra/Helper";
import OverlayPassword from "../Extra/OverlayPassword";

function PointPage() {

    const [point, setPoint] = useState()
    const [equipment, setEquipment] = useState([])
    const location = useLocation();
    const navigate = useNavigate();
    const {id} = useParams();
    const pixelWidth = location.state.x;
    const pixelHeight = location.state.y;
    const imgArtwork = location.state.img;
    const [emailLogged, setEmailLogged] = useState(localStorage.getItem("email"))
    const [roleLogged, setRoleLogged] = useState(localStorage.getItem("role"))

    const [idEquip, setIdEquip] = useState()
    const [isOpenPoint, setIsOpenPoint] = useState(false);
    const [isOpenEquip, setIsOpenEquip] = useState(false);

    useEffect(() => {
        setEmailLogged(localStorage.getItem("email"))
        setRoleLogged(localStorage.getItem("role"))
    }, [emailLogged, roleLogged])

    useEffect(() => {

        fetch('http://localhost:8080/zoom_point/id/' + id, {
            method: 'GET',
            mode: "cors"
        })
            .then(response => {
                return response.json()
            })
            .then(data => setPoint(data))
            .catch(r => console.log(r))

        fetch('http://localhost:8080/equipment/point_id/' + id, {
            method: 'GET',
            mode: "cors"
        })
            .then(response => {
                if (response.status === 200) {
                    return response.json()
                }
                return response.text();
            })
            .then(data => setEquipment(data))
            .catch(r => console.log(r))
    }, [point, id])

    const deleteEquipment = useCallback(() => {
        fetch('http://localhost:8080/equipment/', {
            method: "delete",
            mode: "cors",
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                "id": idEquip,
                "user": emailLogged
            })
        })
            .then(response => {
                if (response.status === 200) {
                    console.log("removed")
                } else {
                    return response.text()
                }
            }).then(r => r && console.log(r))
            .catch(r => console.log(r))
    }, [emailLogged, idEquip])

    const deletePoint = useCallback(() => {
        fetch('http://localhost:8080/zoom_point/', {
            method: "delete",
            mode: "cors",
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                "id": id,
                "user": emailLogged
            })
        })
            .then(response => {
                if (response.status === 200) {
                    navigate(-1)
                } else {
                    return response.text()
                }
            }).then(r => r && console.log(r))
            .catch(r => console.log(r))
    }, [emailLogged, id, navigate])

    const toggleOverlayPoint = () => {
        setIsOpenPoint(!isOpenPoint);
    };

    const toggleOverlayEquip = () => {
        setIsOpenEquip(!isOpenEquip);
    };

    const handleDelete = (idEquip:any) => {
        toggleOverlayEquip();
        setIdEquip(idEquip);
    };

    return (
        <div className={"PointPage"}>
            <main>
                    <section>
                        <h1>Point Information</h1>
                        {point && <>
                            <p>{emailLogged !== "" && (roleLogged === RESEARCHER || roleLogged === ADMIN) && <><Link
                                to={"/insert_equipment/" + id}
                                state={{id: id}}>Insert Equipment</Link></>}</p>
                            <p><img style={{maxWidth: 450, maxHeight: 450, objectFit: "scale-down"}}
                                    src={'data:image/png;base64,' + point["image"]} alt={""}></img></p>
                            <p>{point["name"]}</p>
                            <p>{point["author"] ? point["author"] : "Unknown Author"}</p>
                            {id}
                            <p/>
                            {emailLogged !== "" && (roleLogged === RESEARCHER || roleLogged === ADMIN) && <><p><Link
                                to={"/edit_point/" + id} state={{
                                img: imgArtwork,
                                x: pixelWidth,
                                y: pixelHeight,
                                point: point
                            }}>Edit Point Data</Link></p>
                                <p>
                                    <button onClick={toggleOverlayPoint}>Delete Point</button>
                                </p>
                            </>}
                        </>}
                    </section>
                    <section>
                        <h1>Equipments Information</h1>
                        {equipment.length>0?<table border={2} cellPadding={20}>
                            <thead>
                            <tr>
                                <th>Name</th>
                                <>{(emailLogged !== "" && (roleLogged === RESEARCHER || roleLogged === ADMIN)) ?<th>Edit</th>:null}</>
                                <>{(emailLogged !== "" && (roleLogged === RESEARCHER || roleLogged === ADMIN)) ?<th>Remove</th>:null}</>
                            </tr>
                            </thead>
                            <tbody>
                            {equipment.map((value: any) => {
                                return (
                                    <tr key={value["id"]}>
                                        <td>{value["name"]}</td>
                                        <>{(emailLogged !== "" && (roleLogged === RESEARCHER || roleLogged === ADMIN)) ?<td>
                                            <Link  to={"/edit_equipment/" + value["id"]}><button>Edit</button></Link>
                                        </td>:null}</>
                                        <>{(emailLogged !== "" && (roleLogged === RESEARCHER || roleLogged === ADMIN)) ?<td>
                                            <button onClick={() => handleDelete(value["id"])}>Delete</button>
                                        </td>:null}</>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>:"No equipment added yet."}
                    </section>
            </main>
            <OverlayPassword isOpen={isOpenPoint} onClose={toggleOverlayPoint} deleteFunction={deletePoint} email={emailLogged}></OverlayPassword>
            <OverlayPassword isOpen={isOpenEquip} onClose={toggleOverlayEquip} deleteFunction={deleteEquipment} email={emailLogged}></OverlayPassword>
        </div>
    );
}

export default PointPage;