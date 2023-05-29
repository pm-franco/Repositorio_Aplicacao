import React, {useCallback, useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import "./ArtworkPage.css";
import {ADMIN, RESEARCHER} from "../Extra/Helper";
import OverlayPassword from "../Extra/OverlayPassword";
import Buttons from "../Extra/Buttons";

function ArtworkPageExtraInfos() {

    const [pdfs, setPdfs] = useState([])
    const [extraInfo, setExtraInfo] = useState()
    const {id} = useParams();

    const [emailLogged, setEmailLogged] = useState(localStorage.getItem("email"))
    const [roleLogged, setRoleLogged] = useState(localStorage.getItem("role"))
    const [idPdf, setIdPdf] = useState()
    const [isOpenPdf, setIsOpenPdf] = useState(false);

    useEffect(() => {
        setEmailLogged(localStorage.getItem("email"))
        setRoleLogged(localStorage.getItem("role"))
    },[emailLogged, roleLogged])

    useEffect(() => {
        fetch('http://localhost:8080/pdf/artwork_id/' + id, {
            method: 'GET',
            mode: "cors"
        })
            .then(response => {
                if (response.status === 200) {
                    return response.json()
                }
                return response.text();
            })
            .then(data => setPdfs(data))
            .catch(r => r)
    },[pdfs, id])

    useEffect(() => {
        fetch('http://localhost:8080/extra_info/artwork_id/' + id, {
            method: 'GET',
            mode: "cors"
        })
            .then(response => {
                if (response.status === 200) {
                    return response.json()
                }
                return response.text();
            })
            .then(data => setExtraInfo(data))
            .catch(r => r)
    },[extraInfo, id])

    const toggleOverlayPdf = () => {
        setIsOpenPdf(!isOpenPdf);
    };

    const handleDelete = (idPdf:any) => {
        setIsOpenPdf(!isOpenPdf);
        setIdPdf(idPdf);
    };

    const deletePdf = useCallback(() => {
        fetch('http://localhost:8080/pdf/', {
            method: "delete",
            mode: "cors",
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                "id": idPdf,
                "user": emailLogged
            })
        })
            .then(response => {
                if (response.status === 200) {
                    return
                } else {
                    return response.text()
                }
            }).then(r => r && console.log(r))
            .catch(r => console.log(r))
    }, [emailLogged, idPdf])


    return (
        <div className={"ArtworkPage"}>
            <Buttons id={id} btn1={'grey-color'} btn2={'grey-color'} btn3={'yellow-color'} type={"artwork"}/>
            <main><section>
                <h1>Extra Information </h1>
                {extraInfo?
                    <table border={2} cellPadding={20}>
                        <tbody>
                        <tr>
                            { // @ts-ignore
                                <th rowSpan={extraInfo["links"].length+1}>Useful Links</th>}
                        </tr>
                        {   // @ts-ignore
                            extraInfo["links"].map((value: any) => {
                                return (
                                    <tr key={value}>
                                        <td><a href={value} target="_blank" rel="noopener noreferrer">{value}</a></td>
                                    </tr>
                                )
                            })}
                        <tr>
                            { // @ts-ignore
                                <th rowSpan={extraInfo["info"].length+1}>Useful Information</th>}
                        </tr>
                        {   // @ts-ignore
                            extraInfo["info"].map((value: any) => {
                                return (
                                    <tr key={Math.random()}>
                                        <td>{value}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>: "No extra information added."}
            </section>
                <div className={"column"}>
                    <p>
                        <Link  to={"/insert_extra_info/" + id}>{pdfs.length>0 || extraInfo?"Update Information":"Insert Extra Information"}</Link>
                    </p>
                </div>
                <section>
                    <h1>Pdfs Information </h1>
                    {pdfs?<table border={2} cellPadding={20}>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Url</th>
                            <>{(emailLogged !== "" && (roleLogged === RESEARCHER || roleLogged === ADMIN)) ?<th>Remove</th>:null}</>
                        </tr>
                        </thead>
                        <tbody>
                        {pdfs.map((value: any) => {
                            return (
                                <tr key={value["id"]}>
                                    <td>{value["name"]}</td>
                                    <td><a href={value["link"]} target="_blank" rel="noopener noreferrer">Url</a></td>
                                    <>{(emailLogged !== "" && (roleLogged === RESEARCHER || roleLogged === ADMIN)) ?<td>
                                        <button onClick={() => handleDelete(value["id"])}>Delete</button>
                                    </td>:null}</>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>:"No pdf added yet."}
                </section>
            </main>
            <OverlayPassword isOpen={isOpenPdf} onClose={toggleOverlayPdf} deleteFunction={deletePdf} email={emailLogged}></OverlayPassword>
        </div>
    );
}

export default ArtworkPageExtraInfos;