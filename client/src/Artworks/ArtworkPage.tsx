import React, {useCallback, useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import "./ArtworkPage.css";
import LeafLet from "../LeafLet/LeafLet";
import {ADMIN, RESEARCHER} from "../Extra/Helper";
import OverlayPassword from "../Extra/OverlayPassword";

function ArtworkPage() {

    const [artwork, setArtwork] = useState()
    const [points, setPoints] = useState([])
    const [pdfs, setPdfs] = useState([])
    const navigate = useNavigate();
    const {id} = useParams();
    const [img, setImg] = useState();// location.state.img;
    const [layerNames, setLayerNames] = useState([])

    const [filter, setFilter] = useState({layerName: "", multiplePoints: false})

    const [emailLogged, setEmailLogged] = useState(localStorage.getItem("email"))
    const [roleLogged, setRoleLogged] = useState(localStorage.getItem("role"))
    const [idPdf, setIdPdf] = useState()
    const [isOpenPdf, setIsOpenPdf] = useState(false);
    const [isOpenArt, setIsOpenArt] = useState(false);

    useEffect(() => {
        setEmailLogged(localStorage.getItem("email"))
        setRoleLogged(localStorage.getItem("role"))
    },[emailLogged, roleLogged])

    useEffect(() => {
        fetch('http://localhost:8080/artwork/id/' + id, {
            method: 'GET',
            mode: "cors"
        })
            .then(response => {
                return response.json()
            })
            .then(data => {setArtwork(data);
                setImg(data["image"]);
            })
            .catch(r => r)

        fetch('http://localhost:8080/layer/all/', {
            method: 'GET',
            mode: "cors"
        })
            .then(response => {
                return response.json()
            })
            .then(data => {
                setLayerNames(data);
                if (filter.layerName === "")
                    setFilter({layerName: data[0]["layerName"], multiplePoints: data[0]["multiplePoints"]})
            })
            .catch(r => console.log(r))
    }, [artwork, id, filter.layerName])

    useEffect(() => {
        fetch('http://localhost:8080/zoom_point/artwork_id/' + id, {
            method: 'GET',
            mode: "cors"
        })
            .then(response => {
                if (response.ok)
                    return response.json();
                else
                    return Promise.reject(response);
            })
            .then(data => setPoints(data))
            .catch(r => console.log(r))
    }, [points, id])

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

    const filteredRows = filterRows(points, filter)

    const handleSearch = (value: any) => {
        let obj = JSON.parse(value);
        if (obj)
            setFilter({layerName: obj.layerName, multiplePoints: obj.multiplePoints});
        else
            // @ts-ignore
            setFilter();
    }

    function filterRows(rows: any, filter: any) {
        if (!filter || filter.length === 0) return rows

        return rows.filter((row: any) => {
            return (row.layerName.toLowerCase()).includes(filter.layerName.toLowerCase())
        })
    }

    function printInformation(item:any){
        if(filter.multiplePoints){
            if(roleLogged === RESEARCHER || roleLogged === ADMIN){
                return <><p>
                    <Link to={"/insert_point/" + item.id} state={{
                    img: 'data:image/png;base64,' + item.image,
                    artId: 0,
                    x: item.pixelWidth,
                    y: item.pixelHeight,
                    pointId: item.id
                }}>Insert New Point</Link>
                </p><p><Link to={"/point/" + item.id}
                             state={artwork && {
                                 img: 'data:image/png;base64,' + item.image,
                                 id: item.id,
                                 artId: id,
                                 artImg: img
                             }}>See Points</Link></p></>
            }else {
                return <p><Link to={"/point/" + item.id}
                         state={artwork && {
                             img: 'data:image/png;base64,' + item.image,
                             id: item.id,
                             artId: id,
                             artImg: img
                         }}>See Points</Link></p>
            }
        }
        return <></>
    }

    const toggleOverlayPdf = () => {
        setIsOpenPdf(!isOpenPdf);
    };

    const toggleOverlayArt = () => {
        setIsOpenArt(!isOpenArt);
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



    return (
        <div className={"ArtworkPage"}>
            <main>
                <section>
                    <div className={"row"}>
                        <div className={"column"}>
                            <h3>Available points for artwork {artwork && artwork["name"]}</h3>
                            <select onChange={e => handleSearch(e.target.value)}>
                                {layerNames && layerNames.map((k) =>
                                    <option key={k["layerName"]} value={JSON.stringify(k)}>{k["layerName"]}</option>)}
                            </select>
                            <div className={"leaf"}>
                                {emailLogged !== "" && (roleLogged === RESEARCHER || roleLogged === ADMIN) && <>
                                <Link  to={"/insert_image_layer/" + id}>Insert Image Layer</Link>
                                <p><Link  to={"/images_layer/" + id}>Check all layers</Link></p></>}
                                {artwork &&
                                    <LeafLet markers={filteredRows} img={'data:image/png;base64,'+img} x={artwork["pixelWidth"]}
                                             y={artwork["pixelHeight"]} id={id}/>}
                                {emailLogged !== "" && (roleLogged === RESEARCHER || roleLogged === ADMIN) && <>
                                    <p>
                                    <Link  to={"/insert_extra_info/" + id}
                                        state={{id: id, img: img}}>Insert Extra Information</Link>
                                    </p>
                                    <p>
                                        <Link to={"/edit_artwork/" + id}>Edit Artwork Data</Link>
                                    </p>
                                    <p>
                                        <button onClick={toggleOverlayArt}>Delete Artwork</button>
                                    </p>
                                </>}
                            </div>
                        </div>
                        <div className={"boxes"}>
                            {filteredRows.map((item: any) => (
                                <div key={item.id.valueOf()} className="box">
                                    <p><Link to={"/point_zoom/" + item.id} state={artwork && {
                                        img: 'data:image/png;base64,' + artwork["image"],
                                        x: artwork["pixelWidth"],
                                        y: artwork["pixelHeight"]
                                    }}><img style={{maxWidth: 150, maxHeight: 150, objectFit: "scale-down"}} alt={""}
                                            src={'data:image/png;base64,' + item.image}></img></Link></p>
                                    <p>{item.name}</p>
                                    <p>{item.author ? item.author : "Unknown Author"}</p>
                                    {printInformation(item)}
                                </div>
                            ))
                            }
                        </div>
                    </div>
                    <h1>Pdfs Information </h1>
                    {pdfs?<table border={2} cellPadding={20}>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Url</th>
                            <th>Remove</th>
                        </tr>
                        </thead>
                        <tbody>
                        {pdfs.map((value: any) => {
                            return (
                                <tr key={value["id"]}>
                                    <td>{value["name"]}</td>
                                    <td>{value["link"]}</td>
                                    <td>
                                        <button onClick={() => handleDelete(value["id"])}>Delete</button>
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>:"No pdf added yet."}
                </section>
            </main>
            <OverlayPassword isOpen={isOpenArt} onClose={toggleOverlayArt} deleteFunction={deleteArtwork} email={emailLogged}></OverlayPassword>
            <OverlayPassword isOpen={isOpenPdf} onClose={toggleOverlayPdf} deleteFunction={deletePdf} email={emailLogged}></OverlayPassword>
        </div>
    );
}

export default ArtworkPage;