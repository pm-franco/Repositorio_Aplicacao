import React, {useEffect, useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import "./Profile.css";
import emailIcon from "../MediaFiles/email.svg";
import instIcon from "../MediaFiles/institution.svg";
import {ADMIN, RESEARCHER, setHeight, setWidth} from "../Extra/Helper";

function Profile(prop:any){

    const navigate = useNavigate();
    let emailStorage = localStorage.getItem("email")

    const [person, setPerson] = useState()
    const [artworks, setArtworks] = useState<[]>()

    useEffect(() => {
        if(emailStorage === null || emailStorage === "" )
            navigate("/")
    },[emailStorage, navigate])

    useEffect(() => {
        fetch('http://localhost:8080/user/email/'+emailStorage, {
            method: 'get',
            mode: "cors"
        })
            .then(response => response.json())
            .then(data =>  setPerson(data))
            .catch(r => console.log(r))
    }, [person,emailStorage])

    useEffect(() => {
        fetch('http://localhost:8080/artwork/user/'+emailStorage, {
            method: 'get',
            mode: "cors"
        })
            .then(response => {
                if (response.status===200)
                    return response.json()
                else
                    { // @ts-ignore
                        setArtworks(null)
                    }
            })
            .then(data =>  setArtworks(data))
            .catch(r => console.log(r))
    }, [artworks,emailStorage])


    function printArtworks(){
        if(person && (person["role"] === ADMIN || person["role"] === RESEARCHER)) {
            if (artworks === undefined || artworks?.length === 0)
                return <><h2>Inserted Artworks</h2>No artworks added yet.</>
            else {
                return <><h2>Inserted Artworks</h2>
                    <div className={"boxes"}>
                        {artworks.map((item: any) => (
                            <div key={item.id.valueOf()} className="box">
                                <p><Link to={"/artwork/" + item.id}
                                         state={{img: 'data:image/png;base64,' + item.image, id: item.id}}>
                                    <img height={setHeight(item.pixelHeight, item.pixelWidth)}
                                         width={setWidth(item.pixelHeight, item.pixelWidth)}
                                         src={'data:image/png;base64,' + item.image}></img>
                                </Link></p>
                                <p>{item.name}</p>
                                <p>{item.artType}</p>
                                {item.author ? item.author : "Unknown Author"}
                            </div>
                        ))
                        }
                    </div>
                </>
            }
        }
        return <></>
    }

    return(
        <div className={"PersonInfo"}>
            <main>
                <section>
                    <header>
                        <h2>{person && person["name"]}'s Profile</h2>
                        <p>{person && person["role"]}</p>
                        <Link to={"/edit_person/"+emailStorage} state={person && {name:person["name"],university:person["university"], role:person["role"]}}>Edit User Profile</Link>
                    </header>
                    <div className={"icons"}>
                        <p><img src={emailIcon} alt={""}/><span>{person&& person["email"]}</span></p>
                        <p><img src={instIcon} alt={""}/><span>{person && person["university"]}</span></p>
                    </div>
                    {printArtworks()}
                </section>
            </main>
        </div>
    );
}

export default Profile;