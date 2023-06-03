import React from 'react';
import {Link} from 'react-router-dom';
import "./Buttons.css";

function Buttons({id, btn1, btn2, btn3, type, artId, pointId}:any) {

    function checkBack(){
        if(artId === null){
            return(
                <>
                    <Link to={"/point/" + pointId}>Go Back</Link>
                </>
            )
        }
        else{
            return (
                <>
                    <Link to={"/artwork_points/" + artId}>Go Back</Link>
                </>
            )
        }
    }

    function buttons(){
        if (type === "artwork"){
            return(
                <>
                <div className={"buttons"}>
                    <Link to={"/artwork/" + id}><button className={`${btn1}`}>Artwork Information</button></Link>
                    <Link to={"/artwork_points/" + id}><button className={`${btn2}`}>Artwork Points</button></Link>
                    <Link to={"/artwork_extra/" + id}><button className={`${btn3}`}>Artwork Extra Information</button></Link>
                </div></>
            )
        }
        else{
            return (
                <>
                    <div className={"back-button"}>
                        {checkBack()}
                    </div>
                <div className={"buttons2"}>
                    <Link to={"/point_zoom/" + id}><button className={`${btn1}`}>Point Information</button></Link>
                    <Link to={"/point_equipment/" + id}><button className={`${btn2}`}>Equipment Information</button></Link>
                </div></>
            )
        }
    }


    return (
        <div>
            {buttons()}
        </div>
    );
}

export default Buttons;