import React, {useCallback, useEffect, useState} from 'react';
import {Link,  useParams} from 'react-router-dom';
import "./PointPage.css";
import {ADMIN, RESEARCHER} from "../Extra/Helper";
import OverlayPassword from "../Extra/OverlayPassword";
import Buttons from "../Extra/Buttons";

function PointEquipmentPage() {

    const [equipment, setEquipment] = useState([])
    const [point, setPoint] = useState()
    const {id} = useParams();
    const [emailLogged, setEmailLogged] = useState(localStorage.getItem("email"))
    const [roleLogged, setRoleLogged] = useState(localStorage.getItem("role"))

    const [idEquip, setIdEquip] = useState()
    const [isOpenEquip, setIsOpenEquip] = useState(false);

    useEffect(() => {
        setEmailLogged(localStorage.getItem("email"))
        setRoleLogged(localStorage.getItem("role"))
    }, [emailLogged, roleLogged])

    useEffect( () => {
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
    },[id, equipment])

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

    const toggleOverlayEquip = () => {
        setIsOpenEquip(!isOpenEquip);
    };

    const handleDelete = (idEquip:any) => {
        toggleOverlayEquip();
        setIdEquip(idEquip);
    };

    function printCharacteristics(equip:any) {
        // @ts-ignore
        if (equip["characteristics"].length === 0) {
            return (
                <>
                    No characteristics added.
                </>
            )
        } else {
            return (
                <>
                    {  // @ts-ignore
                        equip["characteristics"].map((value: any) => {
                            return (
                                <dl>
                                    <dt>- {value}</dt>
                                </dl>
                            )
                        })}
                </>
            )
        }
    }

    function printLicenses(equip:any) {
        // @ts-ignore
        if (equip["licenses"].length === 0) {
            return (
                <>
                    No licenses added.
                </>
            )
        } else {
            return (
                <>
                    {  // @ts-ignore
                        equip["licenses"].map((value: any) => {
                            return (
                                <dl>
                                    <dt>- {value}</dt>
                                </dl>
                            )
                        })}
                </>
            )
        }
    }

    return (
        <div className={"PointPage"}>
            <Buttons id={id} btn1={'grey-color'} btn2={'yellow-color'} type={"point"} artId={point && point["artworkId"]} pointId={point && point["zoomPointId"]}/>
            <main>
                    <section>
                        <p>{emailLogged !== "" && (roleLogged === RESEARCHER || roleLogged === ADMIN) && <><Link
                                to={"/insert_equipment/" + id}
                                >Insert Equipment</Link></>}</p>
                        {equipment.length>0?<table border={2} cellPadding={20}>
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Characteristics</th>
                                <th>Licenses</th>
                                <>{(emailLogged !== "" && (roleLogged === RESEARCHER || roleLogged === ADMIN)) ?<th>Edit</th>:null}</>
                                <>{(emailLogged !== "" && (roleLogged === RESEARCHER || roleLogged === ADMIN)) ?<th>Remove</th>:null}</>
                            </tr>
                            </thead>
                            <tbody>
                            {equipment.map((value: any) => {
                                return (
                                    <tr key={value["id"]}>
                                        <td>{value["name"]}</td>
                                        <td>{printCharacteristics(value)}</td>
                                        <td>{printLicenses(value)}</td>
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
            <OverlayPassword isOpen={isOpenEquip} onClose={toggleOverlayEquip} deleteFunction={deleteEquipment} email={emailLogged}></OverlayPassword>
        </div>
    );
}

export default PointEquipmentPage;