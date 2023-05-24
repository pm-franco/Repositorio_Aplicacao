import {
    ImageOverlay,
    MapContainer,
    Marker,
    useMapEvents
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import "./LeafLet.css"
import React, {useEffect, useRef, useState} from "react";
import L, {CRS, LatLngBounds} from 'leaflet';

// @ts-ignore
function T({handlePos}){

    //const [position, setPosition] = useState({ latitude: 0, longitude: 0 });

    useMapEvents({
        click(event) {
            const { lat, lng } = event.latlng;
            handlePos(lat, lng);
            //setPosition({latitude: lat, longitude:lng});
        },
    });
    return (
        <div/>
    );
}

function AddPointLeafLet(props:any){

    const x = props.x
    const y = props.y
    const posX = props.positionX
    const posY = props.positionY
    const map = useRef(null)

    const icon = L.icon({
        iconSize: [25, 41],
        iconAnchor: [10, 41],
        popupAnchor: [2, -40],
        iconUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-icon.png"
    });

    const yx = L.latLng;

    const xy = function(x:number, y:number) {
        if (Array.isArray(x)) {    // When doing xy([x, y]);
            return yx(x[1], x[0]);
        }
        return yx(y, x);  // When doing xy(x, y);
    };

    const bounds = new LatLngBounds ([0,0], xy(x,y));
    const center = xy(x/2, y/2);

    const [position, setPosition] = useState({ latitude: 0, longitude: 0 });

    useEffect(() => {
        if(posX && posY)
            setPosition({latitude: posX, longitude: posY})
        },[posX, posY])

    const handlePos = (lat:number, long:number) => {
        setPosition({latitude: lat, longitude:long});
        props.handlePosition(lat, long);
    };

    return (
        <div className={"Teste"}>
            <main>
                <section>
                    <MapContainer ref={map} center={center} zoom={y>1700?-3:y>900?-2:-1} minZoom={-5} maxZoom={0} dragging={false} doubleClickZoom={false} scrollWheelZoom={false} crs={CRS.Simple}>
                        <ImageOverlay
                            url={props.img}
                            bounds={bounds}
                        />
                        {position.latitude !== 0 ? (
                            <Marker
                                position={[position.latitude, position.longitude]}
                                interactive={false}
                                icon={icon}
                            />
                        ) : null}
                        <T handlePos={handlePos}/>
                    </MapContainer>
                    <div className={"Coordenadas"}>
                        <>Coordenadas: <p/>
                            Latitude {position.latitude} <p/>
                            Longitude {position.longitude}
                        </>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default AddPointLeafLet;