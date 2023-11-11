import React, {Fragment, useCallback, useState} from "react";
import "./Overlay.css";
import {API_BASE_URL} from "./Helper";

function Overlay({ isOpen, onClose, deleteFunction, email}:any) {

    const [password, setPassword] = useState<string>("")
    const [error, setError] = useState("")

    const handleDelete = useCallback(() => {
        fetch(API_BASE_URL+'secrets/match', {
            method: "post",
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                "type": "delete",
                "value": password,
                "user": email
            })
        })
            .then(response => {
                if (response.status === 200) {
                    setPassword("");
                    onClose();
                    deleteFunction();
                } else {
                    return response.text()
                }
            }).then(r => r && setError(r))
            .catch(r => console.log(r))
    }, [password, email, deleteFunction, onClose])

    return (
        <Fragment>
            {isOpen && (
                <div className="overlay">
                    <div className="overlay__background" onClick={onClose} />
                    <div className="overlay__container_password">
                    <>
                        </>
                        <div className={"data"}>
                            <h3>Delete Confirmation</h3>
                            <p>
                                <input type={"password"} placeholder={"Password to delete"} value={password} onChange={ e=> setPassword(e.target.value)}/>
                                <button color={"red"} disabled={password===""} onClick={handleDelete}>Confirm Delete</button>
                            </p>
                            <p className="error">
                                    {error.length > 0 && setTimeout(
                                        () => setError(""),
                                        2000
                                    ) && error}</p>
                        </div>
                    </div>
                </div>
            )}
        </Fragment>
    );
}

export default Overlay;