import React, {useCallback, useEffect} from "react";
import {Link} from 'react-router-dom';
import "./Home.css";
import {ADMIN, RESEARCHER} from "../Extra/Helper";

function NavBar(props:any){

    const logout = useCallback( () => {
        props.handleData("", "", "")
        }, [props])

    useEffect(() => {
        fetch('http://localhost:8080/user/email/'+props.email, {
            method: 'get',
            mode: "cors",
        })
            .then(response => response.json())
            .then(data =>  {
                props.handleData(data["role"], data["email"], data["name"]);
            })
            .catch(r => console.log(r))
    }, [props])

    return (
        <nav className={"navBar"}>
            <Link to="/">Home</Link>&emsp;&emsp;
            {props.role === ADMIN && <><Link to={"/layer_name"}>Layer Names</Link>&emsp;&emsp;<Link to={"/update_role"}>Update User Role</Link>&emsp;&emsp;<Link to={"/secrets"}>Secrets</Link>&emsp;&emsp;</>}
            {props.email !== "" && (props.role === RESEARCHER || props.role === ADMIN) && <><Link to={"/insert_artwork"}>Insert Artwork</Link>&emsp;&emsp;</>}
            <Link to={"/artworks"}>Artwork's Gallery</Link>&emsp;&emsp;
            {(props.email === null || props.email === "" ?<><Link to="/login">Sign In</Link>&emsp;&emsp;<Link to="/register">Sign Up</Link>&emsp;&emsp;</>:<>            <Link to={"/person/" + props.email}>{props.name+ "'s Profile"}</Link>&emsp;&emsp; <Link to="/" onClick={() => logout()}>Logout</Link>
            </>)}
        </nav>
    );
}

export default NavBar;