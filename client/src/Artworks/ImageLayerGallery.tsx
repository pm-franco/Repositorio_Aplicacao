import React, {useCallback, useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import "./ArtworkPage.css";
import {Pagination} from "../Extra/Pagination";
import {ADMIN, RESEARCHER} from "../Extra/Helper";
import OverlayPassword from "../Extra/OverlayPassword";

function ImageLayerGallery() {

    const [imageLayers, setImageLayers] = useState([])
    const emailLogged = localStorage.getItem("email")
    const roleLogged = localStorage.getItem("role")
    const {artId} = useParams();
    const [isOpen, setIsOpen] = useState(false);
    const [idLayer, setIdLayer] = useState()

    useEffect(() => {
            fetch('http://localhost:8080/image_layer/artwork_id/' + artId, {
                method: 'GET',
                mode: 'cors',
                headers: {'Content-Type': 'application/json'},
            })
                .then(response => {
                    if (response.status === 200)
                        return response.json()
                    return response.text()
                })
                .then(data => setImageLayers(data))
                .catch(r => console.log(r))
    }, [imageLayers, artId])

    const [activePage, setActivePage] = useState(1)
    const rowsPerPage = 8

    const calculatedRows = imageLayers.slice(
        (activePage - 1) * rowsPerPage,
        activePage * rowsPerPage
    )
    const count = imageLayers.length
    const totalPages = Math.ceil(count / rowsPerPage)

    const toggleOverlay = () => {
        setIsOpen(!isOpen);
    };

    const handleDelete = (layerId:any) => {
        setIsOpen(!isOpen);
        setIdLayer(layerId);
    };

    const deleteLayer = useCallback(() => {
        fetch('http://localhost:8080/image_layer/', {
            method: "delete",
            mode: "cors",
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                "id": idLayer,
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
    }, [emailLogged, idLayer])

    return (
        <div className={"ArtworkGallery"}>
            <main>
                <section>
                    {imageLayers.length===0 && <h4>No layers added yet.</h4>}
                    <div className={"boxes"}>
                        {imageLayers.length>0?calculatedRows.map((item: any) => (
                            <div key={item.id} className="box">
                                <p>{emailLogged !== "" && (roleLogged === RESEARCHER || roleLogged === ADMIN) && <><Link
                                    to={"/edit_layer/" + item.id}>{"Edit Image Layer" + item.id}</Link></>}</p>
                                <img style={{maxWidth: 200, maxHeight: 200, objectFit: "scale-down"}} alt={""}
                                     src={'data:image/png;base64,' + item.image}></img>
                                <p>{item.layerName}</p>
                                <p>{"Depth:"+ item.depth}</p>
                                {emailLogged !== "" && (roleLogged === RESEARCHER || roleLogged === ADMIN) && <p>
                                <button onClick={() => handleDelete(item["id"])}>Delete</button></p>}
                            </div>
                        )):null}
                    </div>
                    {imageLayers.length>0?
                    <Pagination
                        activePage={activePage}
                        count={count}
                        rowsPerPage={rowsPerPage}
                        totalPages={totalPages}
                        setActivePage={setActivePage}
                    />:null}
                </section>
            </main>
            <OverlayPassword isOpen={isOpen} onClose={toggleOverlay} deleteFunction={deleteLayer} email={emailLogged}></OverlayPassword>
        </div>
    );
}

export default ImageLayerGallery;