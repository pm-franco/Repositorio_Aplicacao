import React, {useCallback, useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import "./ArtworkPage.css";
import LeafLet from "../LeafLet/LeafLet";
import {ADMIN, RESEARCHER} from "../Extra/Helper";
import OverlayPassword from "../Extra/OverlayPassword";

function ArtworkPage() {

    const [artwork, setArtwork] = useState()
    const navigate = useNavigate();
    const {id} = useParams();

    const [emailLogged, setEmailLogged] = useState(localStorage.getItem("email"))
    const [roleLogged, setRoleLogged] = useState(localStorage.getItem("role"))
    const [isOpenArt, setIsOpenArt] = useState(false);

    useEffect(() => {
        setEmailLogged(localStorage.getItem("email"))
        setRoleLogged(localStorage.getItem("role"))
    }, [emailLogged, roleLogged])

    useEffect(() => {
        fetch('http://localhost:8080/artwork/id/' + id, {
            method: 'GET',
            mode: "cors"
        })
            .then(response => {
                return response.json()
            })
            .then(data => setArtwork(data))
            .catch(r => r)
    }, [artwork, id])

    const toggleOverlayArt = () => {
        setIsOpenArt(!isOpenArt);
    };

    const deleteArtwork = useCallback(() => {
        fetch('http://localhost:8080/artwork/', {
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
                    navigate("/artworks")
                } else {
                    return response.text()
                }
            }).then(r => r && console.log(r))
            .catch(r => console.log(r))
    }, [emailLogged, id, navigate])

    const setDate = (date: any) => {
        if (date)
            return date.split("T")[0]
        return "Unknown"
    }

    return (
        <div className={"ArtworkPage"}>
            <div className={"buttons"}>
                <Link to={"/artwork/" + id}><button>Artwork Information</button></Link>
                <Link to={"/artwork_points/" + id}><button>Artwork Points</button></Link>
                <Link to={"/artwork_extra/" + id}><button>Artwork Extra Information</button></Link>
            </div>
            <main>
                <section>
                    <h3>General Information</h3>
                    {artwork &&
                        <table border={2} cellPadding={20}>
                            <tbody>
                            <tr>
                                <th>Name</th>
                                <td>{artwork["name"]}</td>
                            </tr>
                            <tr>
                                <th>Author</th>
                                <td>{artwork["author"] || "Unknown"}</td>
                            </tr>
                            <tr>
                                <th>Artwork Type</th>
                                <td>{artwork["artType"]}</td>
                            </tr>
                            <tr>
                                <th>Date</th>
                                <td>{setDate(artwork["date"])}</td>
                            </tr>
                            <tr>
                                <th>Source</th>
                                <td>{artwork["source"]}</td>
                            </tr>
                            </tbody>
                        </table>}
                </section>
                <div className={"column"}>
                    <h1>Page for {artwork && artwork["name"]} artwork</h1>
                    {artwork && <img style={{maxWidth: 450, maxHeight: 450, objectFit: "scale-down"}}
                                     src={'data:image/png;base64,' + artwork["image"]} alt={""}></img>}
                    {emailLogged !== "" && (roleLogged === RESEARCHER || roleLogged === ADMIN) && <>
                        <p>
                            <Link to={"/edit_artwork/" + id}>Edit Artwork Data</Link>
                        </p>
                        <p>
                            <button onClick={toggleOverlayArt}>Delete Artwork</button>
                        </p>
                    </>}
                </div>
                <section>
                    <h3>Additional Information</h3>
                    {artwork &&
                        <table border={2} cellPadding={20}>
                            <tbody>
                            <tr>
                                <th>Inventory Number</th>
                                <td>{artwork["invNumber"]}</td>
                            </tr>
                            <tr>
                                <th>Category</th>
                                <td>{artwork["category"]}</td>
                            </tr>
                            <tr>
                                <th>Super Category</th>
                                <td>{artwork["superCategory"]}</td>
                            </tr>
                            <tr>
                                <th>Matter</th>
                                <td>{artwork["matter"]}</td>
                            </tr>
                            <tr>
                                <th>Width (mm)</th>
                                <td>{artwork["width"]}</td>
                            </tr>
                            <tr>
                                <th>Height (mm)</th>
                                <td>{artwork["height"]}</td>
                            </tr>
                            </tbody>
                        </table>}
                </section>
            </main>
            <OverlayPassword isOpen={isOpenArt} onClose={toggleOverlayArt} deleteFunction={deleteArtwork}
                             email={emailLogged}></OverlayPassword>
        </div>
    );
}

export default ArtworkPage;