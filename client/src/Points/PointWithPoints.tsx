import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import "../Artworks/ArtworkPagePoints.css";
import LeafLet from "../LeafLet/LeafLet";
import {ADMIN, RESEARCHER} from "../Extra/Helper";

function PointWithPoints(){

    const [point, setPoint] = useState()
    const [points, setPoints] = useState([])
    const {id} = useParams();
    const [layerNames, setLayerNames] = useState([])

    const [filter, setFilter] = useState("")

    const [roleLogged, setRoleLogged] = useState(localStorage.getItem("role"))

    useEffect(() => {
        setRoleLogged(localStorage.getItem("role"))
    },[roleLogged])

    useEffect(() => {
        fetch('http://localhost:8080/zoom_point/id/'+id, {
            method: 'GET',
            mode: "cors"
        })
            .then(response => {
                return response.json()
            })
            .then(data =>setPoint(data))
            .catch(r => r)

        fetch('http://localhost:8080/layer/all/', {
            method: 'GET',
            mode: "cors"
        })
            .then(response => {
                return response.json()
            })
            .then(data =>{ setLayerNames(data);
                if(filter === "")
                    setFilter(data[0]["layerName"])})
            .catch(r => console.log(r))
    },[point, id, filter])

    useEffect(() => {
        fetch('http://localhost:8080/zoom_point/zoom_point_id/'+id, {
            method: 'GET',
            mode: "cors"
        })
            .then(response => {
                if(response.ok)
                    return response.json();
                else
                    return Promise.reject(response);
            })
            .then(data => setPoints(data))
            .catch(r => console.log(r))
    },[points, id])

    const filteredRows = filterRows(points, filter)

    function filterRows(rows:any, filter:any) {
        if (!filter || filter.length === 0) return rows

        return rows.filter((row:any) => {
            return (row.layerName.toLowerCase()).includes(filter.toLowerCase())
        })
    }

    return(
        <div className={"ArtworkPagePoints"}>
            <main>
                <section>
                    <div className={"row"}>
                        <div className={"column"}>
                            <Link to={"/artwork_points/" + (point && point["artworkId"])}>Go Back</Link>
                            <h3>Available points for zoom point {point && point["name"]}</h3>
                            <select onChange={e => setFilter(e.target.value)}>
                                {layerNames && layerNames.map((k) => <option key={k["layerName"]}>{k["layerName"]}</option>)}
                            </select>
                            <div className={"leaf"}>
                                {point && <LeafLet markers={filteredRows} layer={filter} img={'data:image/png;base64,'+ point["image"]} x={point["pixelWidth"]} y={point["pixelHeight"]} id={null}/>}
                                <p>{(roleLogged === RESEARCHER || roleLogged === ADMIN) && <><Link to={"/edit_point/"+id} state={point && {img:'data:image/png;base64,'+ point["image"], x:point["pixelWidth"], y:point["pixelHeight"], point:point}}>{"Edit Point Data"+ id}</Link></>}</p>
                            </div>
                        </div>
                        <div className={"boxes"}>
                            { filteredRows.map((item:any) => (
                                <div key={item.id.valueOf()} className="box">
                                    <p><Link to={"/point_zoom/"+ item.id} state={point && {img:'data:image/png;base64,' + point["image"],id:item.id, x:point["pixelWidth"], y:point["pixelHeight"]}}><img height={150} width={150} alt={""} src={'data:image/png;base64,' + item.image}></img></Link></p>
                                    <p>{item.name}</p>
                                    {item.author? item.author: "Unknown Author"}
                                </div>
                            ))
                            }
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default PointWithPoints;