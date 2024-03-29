import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import "./ArtworkPagePoints.css";
import LeafLet from "../LeafLet/LeafLet";
import {ADMIN, RESEARCHER,API_BASE_URL} from "../Extra/Helper";
import Buttons from "../Extra/Buttons";

function ArtworkPagePoints() {

    const [artwork, setArtwork] = useState()
    const [points, setPoints] = useState([])
    const {id} = useParams();
    const [img, setImg] = useState();
    const [layerNames, setLayerNames] = useState([])

    const [filter, setFilter] = useState({layerName: "", multiplePoints: false})

    const [emailLogged, setEmailLogged] = useState(localStorage.getItem("email"))
    const [roleLogged, setRoleLogged] = useState(localStorage.getItem("role"))

    useEffect(() => {
        setEmailLogged(localStorage.getItem("email"))
        setRoleLogged(localStorage.getItem("role"))
    },[emailLogged, roleLogged])

    useEffect(() => {
        fetch(API_BASE_URL+'artwork/id/' + id, {
            method: 'GET'
        })
            .then(response => {
                return response.json()
            })
            .then(data => {setArtwork(data);
                setImg(data["image"]);
            })
            .catch(r => r)

        fetch(API_BASE_URL+'layer/all/', {
            method: 'GET'
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
        fetch(API_BASE_URL+'zoom_point/artwork_id/' + id, {
            method: 'GET'
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
                        artId: null,
                        x: item.pixelWidth,
                        y: item.pixelHeight,
                        pointId: item.id
                    }}>Insert New Point</Link>
                </p><p><Link to={"/point/" + item.id}>See Points</Link></p></>
            }else {
                return <p><Link to={"/point/" + item.id}>See Points</Link></p>
            }
        }
        return <></>
    }

    return (
        <div className={"ArtworkPagePoints"}>
            <Buttons id={id} btn1={'grey-color'} btn2={'yellow-color'}  btn3={'grey-color'} type={"artwork"}/>
            <main>
                <section>
                    <div className={"row"}>
                        <div className={"column"}>
                            <h3>Select a layer</h3>
                            <select onChange={e => handleSearch(e.target.value)}>
                                {layerNames && layerNames.map((k) =>
                                    <option key={k["layerName"]} value={JSON.stringify(k)}>{k["layerName"]}</option>)}
                            </select>
                            <div className={"leaf"}>
                                {artwork && emailLogged !== "" && (roleLogged === RESEARCHER || roleLogged === ADMIN) && <>
                                    <Link
                                        to={"/insert_point/" + id} state={{
                                        img: 'data:image/png;base64,' + img,
                                        artId: id,
                                        x: artwork["pixelWidth"],
                                        y: artwork["pixelHeight"],
                                        pointId: null
                                    }}>Insert New Point</Link>
                                    <p><Link  to={"/insert_image_layer/" + id}>Insert Image Layer</Link></p>
                                    <p><Link  to={"/images_layer/" + id}>Available Image Layers</Link></p></>}
                                {artwork &&
                                    <LeafLet markers={filteredRows} img={'data:image/png;base64,'+img} x={artwork["pixelWidth"]}
                                             y={artwork["pixelHeight"]} id={id}/>}
                            </div>
                        </div>
                        <div className={"boxes"}>
                            {filteredRows.length>0? filteredRows.map((item: any) => (
                                <div key={item.id.valueOf()} className="box">
                                    <p><Link to={"/point_zoom/" + item.id}><img style={{maxWidth: 150, maxHeight: 150, objectFit: "scale-down"}} alt={""}
                                            src={'data:image/png;base64,' + item.image}></img></Link></p>
                                    <p>{item.name}</p>
                                    {printInformation(item)}
                                </div>
                            )):<h3>No points added in this layer.</h3>
                            }
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default ArtworkPagePoints;