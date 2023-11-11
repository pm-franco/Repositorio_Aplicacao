import {
    ImageOverlay,
    MapContainer,
    Marker,
    LayersControl,
    Popup,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import "./LeafLet.css"
import React, {useEffect, useRef, useState} from "react";
import L, {CRS, LatLngBounds} from 'leaflet';
import {API_BASE_URL} from "../Extra/Helper";

function LeafLet(props: any) {

    const map = useRef(null)
    const [layers, setLayers] = useState([])
    const artId = props.id;
    const x = props.x
    const y = props.y

    useEffect(() => {
        if(artId) {
            fetch(API_BASE_URL+'image_layer/artwork_id/' + artId, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'},
            })
                .then(response => {
                    if (response.status === 200)
                        return response.json()
                    return response.text()
                })
                .then(data => setLayers(data))
                .catch(r => console.log(r))
        }
    }, [layers, artId])

    const icon = L.icon({
        iconSize: [25, 41],
        iconAnchor: [10, 41],
        popupAnchor: [2, -40],
        iconUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-shadow.png"
    });

    let yx = L.latLng;

    let xy = function (x: number, y: number) {
        if (Array.isArray(x)) {    // When doing xy([x, y]);
            return yx(x[1], x[0]);
        }
        return yx(y, x);  // When doing xy(x, y);
    };

    const bounds = new LatLngBounds([0, 0], xy(x, y));
    const center = xy(x / 2, y / 2);

    function AddMarkers() {
        return (
            <>{props.markers.map((item: any) => (
                <Marker key={item.id} position={xy(item.positionX, item.positionY)} icon={icon} eventHandlers={{
                    popupclose: (e) => {
                        // @ts-ignore
                        map.current.setView(center, setZoom());
                    }
                }}>
                    <Popup>
                        {"name: " + item.name}
                    </Popup>
                </Marker>
            ))}</>
        )
    }

    function AddLayers() {
        if (layers.length > 0)
            return (
                <><LayersControl position="topright">
                    {layers.map((item: any) => (
                        <LayersControl.Overlay key={item["id"]} name={"depth " + item["depth"]} >
                            <ImageOverlay key={item["id"]}
                                url={'data:image/png;base64,' + item["image"]}
                                bounds={bounds}
                            />
                        </LayersControl.Overlay>
                    ))}
                </LayersControl>
                </>
            )
    }

    function setZoom() {
        if (y > 1700) {
            return -3;
        } else if (y > 900) {
            return -2;
        } else {
            return -1;
        }
    }

    return (
        <MapContainer ref={map} center={center} zoom={setZoom()} minZoom={-5} dragging={false} doubleClickZoom={false}
                      scrollWheelZoom={false} crs={CRS.Simple}>
            <ImageOverlay
                url={props.img}
                bounds={bounds}
            />
            {AddLayers()}
            {AddMarkers()}
        </MapContainer>

    );
}

export default LeafLet;