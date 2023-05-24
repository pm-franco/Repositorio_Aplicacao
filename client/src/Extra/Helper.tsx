import React from "react";

export const ARTWORK = "artwork";
export const POINT = "point";
export const RESEARCHER = "researcher";
export const ADMIN = "admin";
export const insts = ["FCT", "Teste", "ABC"]
export const GREETING = "Digital Twin Collection";
export const ArtTypes = ['Painting', 'Sculpture', 'Enamel', 'Glazed Painted Ceramic'];

export interface ImageSize {
    width: number,
    height: number
}


export const handleFloats = (setFunc:any, target:any) =>{
    if(target === "")
        return setFunc("");
    else
        return setFunc(parseFloat(target));
}

export function checkText(array: String[], type: String) {
    if(!array) return ;
    if (array.length === 0)
        return <>No {type}s added yet.</>
    else if (array.length === 1)
        return <>1 {type} inserted.</>
    else
        return <>{array.length} {type}s inserted.</>
}

export function setHeight(height: number, width: number) {
    if (height > width) {
        return 200;
    } else {
        return 190;
    }
}

export function setWidth(height: number, width: number) {
    if (width > height) {
        return 200;
    } else {
        return 190;
    }
}