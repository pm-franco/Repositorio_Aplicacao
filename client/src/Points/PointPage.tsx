import React, {useCallback, useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import "./PointPage.css";
import {ADMIN, RESEARCHER, setDate} from "../Extra/Helper";
import OverlayPassword from "../Extra/OverlayPassword";
import Buttons from "../Extra/Buttons";

function PointPage() {

    const [point, setPoint] = useState()
    const navigate = useNavigate();
    const {id} = useParams();
    const [emailLogged, setEmailLogged] = useState(localStorage.getItem("email"))
    const [roleLogged, setRoleLogged] = useState(localStorage.getItem("role"))

    const [isOpenPoint, setIsOpenPoint] = useState(false);

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
    }, [point, id])

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

    function printCopyrights() {
        // @ts-ignore
        if (point["copyrights"].length === 0) {
            return (
                <>
                    <tr>
                        <th>Copyrights</th>
                        <td>No copyrights added yet.</td>
                    </tr>
                </>
            )
        } else {
            return (
                <>
                    <tr>
                        { // @ts-ignore
                            <th rowSpan={point["copyrights"].length + 1}>Copyrights</th>}
                    </tr>
                    {  // @ts-ignore
                        point["copyrights"].map((value: any) => {
                            return (
                                <tr key={value}>
                                    <td>{value}</td>
                                </tr>
                            )
                        })}
                </>

            )
        }
    }

    function printMaterials() {
        // @ts-ignore
        if (point["materials"].length === 0) {
            return (
                <>
                    <tr>
                        <th>Materials</th>
                        <td>No materials added yet.</td>
                    </tr>
                </>
            )
        } else {
            return (
                <>
                    <tr>
                        { // @ts-ignore
                            <th rowSpan={point["materials"].length + 1}>Materials</th>}
                    </tr>
                    {  // @ts-ignore
                        point["materials"].map((value: any) => {
                            return (
                                <tr key={value}>
                                    <td>{value}</td>
                                </tr>
                            )
                        })}
                </>
            )
        }
    }

    return (
        <div className={"PointPage"}>
            <Buttons id={id} btn1={'yellow-color'} btn2={'grey-color'} type={"point"} artId={point && point["artworkId"]} pointId={point && point["zoomPointId"]}/>
            <main>
                <section>
                    <h3>Point Information</h3>
                    {point &&
                        <table border={2} cellPadding={20}>
                            <tbody>
                            <tr>
                                <th>Name</th>
                                <td>{point["name"]}</td>
                            </tr>
                            <tr>
                                <th>Layer Name</th>
                                <td>{point["layerName"] || "Unknown"}</td>
                            </tr>
                            <tr>
                                <th>Width (mm)</th>
                                <td>{point["metricWidth"]}</td>
                            </tr>
                            <tr>
                                <th>Height (mm)</th>
                                <td>{point["metricHeight"]}</td>
                            </tr>
                            <tr>
                                <th>Researcher Name</th>
                                <td>{point["author"]}</td>
                            </tr>
                            </tbody>
                        </table>}
                </section>
                <div className={"column"}>
                    {point && <p><img style={{maxWidth: 400, maxHeight: 400, objectFit: "scale-down"}}
                                      src={'data:image/png;base64,' + point["image"]} alt={""}></img></p>}
                    {emailLogged !== "" && (roleLogged === RESEARCHER || roleLogged === ADMIN) && <><p><Link
                        to={"/edit_point/" + id}>Edit Point Data</Link></p>
                        <p>
                            <button onClick={toggleOverlayPoint}>Delete Point</button>
                        </p>
                    </>}
                </div>

                <section>
                    <h3>Additional Information</h3>
                    {point &&
                        <table border={2} cellPadding={20}>
                            <tbody>
                            <tr>
                                <th>Technique Name</th>
                                <td>{point["technique"]|| "Unknown"}</td>
                            </tr>
                            <tr>
                                <th>Date</th>
                                <td>{setDate(point["date"])}</td>
                            </tr>
                            {printCopyrights()}
                            {printMaterials()}
                            </tbody>
                        </table>}
                </section>
            </main>
            <OverlayPassword isOpen={isOpenPoint} onClose={toggleOverlayPoint} deleteFunction={deletePoint}
                             email={emailLogged}></OverlayPassword></div>
    );
}

export default PointPage;