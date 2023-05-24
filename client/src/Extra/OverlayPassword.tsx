import React, {Fragment, useCallback, useState} from "react";
import "./Overlay.css";
import {Pagination} from "./Pagination";

function Overlay({ isOpen, onClose, deleteFunction, email}:any) {

    const [data, setData] = useState("")
    const [password, setPassword] = useState<string>("")
    const [error, setError] = useState("")

    const handleDelete = useCallback(() => {
        fetch('http://localhost:8080/secrets/match', {
            method: "post",
            mode: "cors",
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
    }, [password, email])

    return (
        <Fragment>
            {isOpen && (
                <div className="overlay">
                    <div className="overlay__background" onClick={onClose} />
                    <div className="overlay__container">
                    <>
                        </>
                        <div className={"data"}>
                            <h3><>Delete Confirmation</></h3>
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