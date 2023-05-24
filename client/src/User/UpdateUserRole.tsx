import React, {useCallback, useEffect, useState} from 'react';
import "../Extra/LayerNamePage.css";
import {useNavigate} from "react-router-dom";

function UpdateUserRole() {

    const [email, setEmail] = useState("")
    const [newRole, setNewRole] = useState("student")
    const [pwRole, setPwRole] = useState("user")

    const [error, setError] = useState("")
    const navigate = useNavigate();

    const [emailLogged, setEmailLogged] = useState(localStorage.getItem("email"))
    const [roleLogged, setRoleLogged] = useState(localStorage.getItem("role"))

    useEffect(() => {
        setEmailLogged(localStorage.getItem("email"))
        setRoleLogged(localStorage.getItem("role"))
    }, [emailLogged, roleLogged])

    useEffect(() => {
        if (roleLogged !== "admin")
            navigate("/")
    }, [])

    const updateUserRole = useCallback(() => {
        fetch('http://localhost:8080/user/edit/' + email, {
            method: "put",
            mode: "cors",
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                "email": emailLogged,
                "password": pwRole,
                "role": newRole
            })
        })
            .then(response => {
                if (response.status === 200) {
                    alert("Role changed.")
                    navigate("/")
                } else {
                    return response.text()
                }
            }).then(r => r && setError(r))
            .catch(r => console.log(r))
    }, [email, emailLogged, pwRole, newRole])

    return (
        <div className="LayerName">
            <main>
                <section>
                    <div className={"horizontal-form"}>
                        <div className={"form-section"}>
                            <h1>Update User Role</h1>
                            <p>
                                <label className={"required"}>User Email</label>
                            </p>
                            <p>
                                <input type={"text"} placeholder={"user email"} value={email}
                                       onChange={e => setEmail(e.target.value)}/>
                            </p>
                            <p>
                                <label className={"required"}>New Role</label>
                            </p>
                            <p>
                                <select style={{width: 190}} name="select" id="selectedUser" value={newRole}
                                        onChange={e => setNewRole(e.target.value)}>
                                    <option value="student"> Student</option>
                                    <option value="researcher"> Researcher</option>
                                    <option value="admin"> Admin</option>
                                </select>
                            </p>
                            <p>
                                {(newRole === "researcher" || newRole === "admin") ?
                                    <label>Secret Password</label> : null}
                                {(newRole === "researcher" || newRole === "admin") ?
                                    <input type={"password"} placeholder={"secret password"}
                                           onChange={e => setPwRole(e.target.value)}/> : null}
                            </p>
                            <div className={"prevs"}>
                                <button disabled={email === ""} onClick={() => {
                                    updateUserRole()
                                }}>Update User Role
                                </button>
                                <p className="error">
                                    {error.length > 0 && setTimeout(
                                        () => setError(""),
                                        2000
                                    ) && error}</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default UpdateUserRole;
