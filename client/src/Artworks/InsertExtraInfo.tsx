import React, {useCallback, useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import "./InsertExtraInfo.css";
import Overlay from "../Extra/Overlay";
import {API_BASE_URL, checkText} from "../Extra/Helper";

function InsertExtraInfo() {

    const {id} = useParams();
    const navigate = useNavigate();
    const [uploadedFile, setUploadedFile] = useState(null)
    const [links, setLinks] = useState<string[]>([]);
    const [infos, setInfos] = useState<string[]>([]);
    const [pdfName, setPdfName] = useState<String>("")
    const [pdfLink, setPdfLink] = useState<String | null>(null)
    const [aux, setAux] = useState(0)
    const [errorExtra, setErrorExtra] = useState("");
    const [errorPdf, setErrorPdf] = useState("")

    const [isOpenLinks, setIsOpenLinks] = useState(false);
    const [isOpenInfos, setIsOpenInfos] = useState(false);

    const [extraInfo, setExtraInfo] = useState()

    const [emailLogged, setEmailLogged] = useState(localStorage.getItem("email"))

    useEffect(() => {
        setEmailLogged(localStorage.getItem("email"))
    }, [emailLogged])

    useEffect(() => {
        const setData = () => {
            if (extraInfo && aux === 0) {
                let linksArray = extraInfo["links"];
                if (linksArray !== null)
                    setLinks(linksArray);
                let infosArray = extraInfo["info"];
                if (infosArray !== null)
                    setInfos(infosArray);
                setAux(1);
            }
        }
        setData();
    }, [extraInfo, aux])

    useEffect(() => {
        fetch(API_BASE_URL+'extra_info/artwork_id/' + id, {
            method: 'GET'
        })
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    return response.text();
                }
            })
            .then(data => setExtraInfo(data))
            .catch(r => console.log(r))
    }, [extraInfo, id])

    const toggleOverlayLinks = () => {
        setIsOpenLinks(!isOpenLinks);
    };

    const toggleOverlayInfos = () => {
        setIsOpenInfos(!isOpenInfos);
    };

    const InsertExtraInfo = useCallback(() => {
        if (extraInfo) {
            fetch(API_BASE_URL+'extra_info/' + extraInfo["id"], {
                method: 'put',
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify({
                    "artworkId": id,
                    "links": links,
                    "info": infos,
                    "user": emailLogged
                })
            })
                .then(response => {
                    if (response.status === 200) {
                        refreshPage()
                    } else {
                        return response.text();
                    }
                }).then(r => r && setErrorExtra(r))
                .catch(r => console.log(r))
        } else {
            fetch(API_BASE_URL+'extra_info/', {
                method: 'post',
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify({
                    "artworkId": id,
                    "links": links,
                    "info": infos,
                    "user": emailLogged
                })
            })
                .then(response => {
                    if (response.status === 201) {
                        refreshPage()
                    } else {
                        return response.text();
                    }
                }).then(r => r && setErrorExtra(r))
                .catch(r => console.log(r))
        }
    }, [id, links, infos, emailLogged, extraInfo])


    const InsertPdf = useCallback(() => {
        if (uploadedFile == null) {
            fetch(API_BASE_URL+'pdf/1', {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify({
                    "artworkId": id,
                    "name": pdfName,
                    "link": pdfLink,
                    "user": emailLogged
                })
            })
                .then(response => {
                    if (response.status === 201) {
                        refreshPage()
                    } else {
                        return response.text();
                    }
                }).then(r => r && setErrorPdf(r))
                .catch(r => console.log(r))
        } else {
            const formData = new FormData();
            formData.append("file", uploadedFile);
            formData.append("json", JSON.stringify({
                "artworkId": id,
                "name": pdfName,
                "link": pdfLink,
                "user": emailLogged
            }))
            fetch(API_BASE_URL+'pdf/', {
                method: 'POST',
                body: formData
            })
                .then(response => {
                    if (response.status === 201) {
                        refreshPage()
                    } else {
                        return response.text();
                    }
                }).then(r => r && setErrorPdf(r))
                .catch(r => console.log(r))
        }
    }, [id, emailLogged, pdfName, pdfLink, uploadedFile])

    const handleFileEvent = (e: any) => {
        if (e.target.files.length > 0)
            setUploadedFile(e.target.files[0])
    }

    function checkExtraInfo() {
        return links?.length === 0 && infos?.length === 0;
    }

    function checkPdfData() {
        if (pdfName?.length === 0)
            return true;
        if (uploadedFile == null) {
            if (pdfLink == null || pdfLink.length === 0)
                return true
        } else {
            if (pdfLink && pdfLink?.length > 0)
                return true
        }
        return false
    }

    function refreshPage() {
        window.location.reload();
    }

    const handleLinks = (link: any) => {
        // @ts-ignore
        setLinks([...links, link])
    }

    const handleInfos = (info: any) => {
        // @ts-ignore
        setInfos([...infos, info])
    }

    const deleteByIndexLinks = (index: number) => {
        setLinks((oldValues: any[]) => {
            return oldValues.filter((_, i) => i !== index)
        })
    }

    const deleteByIndexInfos = (index: number) => {
        setInfos((oldValues: any[]) => {
            return oldValues.filter((_, i) => i !== index)
        })
    }

    return (
        <div className={"InsertExtraInfo"}>
            <main>
                <section>
                    <div className={"horizontal-form"}>
                        <div className={"form-section"}>
                            <h3>Extra Information</h3>
                            <p>
                                <label>Links</label>
                            </p>
                            <div className={"space_top"}>
                                {checkText(links, "link")}
                            </div>
                            <div className={"space_top"}>
                                <button onClick={toggleOverlayLinks}>Manage Links</button>
                            </div>
                            <div className={"space_top"}>
                                <label>Information</label>
                            </div>
                            <div className={"space_top"}>
                                {checkText(infos, "info")}
                            </div>
                            <div className={"space_top"}>
                                <button onClick={toggleOverlayInfos}>Manage Information</button>
                            </div>
                        </div>
                    </div>
                    <div className={"prevs"}>
                        <button disabled={checkExtraInfo()} onClick={() => {
                            InsertExtraInfo()
                        }}>Update Extra Information
                        </button>
                        <p className="error">
                            {errorExtra.length > 0 && setTimeout(
                                () => setErrorExtra(""),
                                2000
                            ) && errorExtra}</p>
                    </div>
                </section>
                <div className={"move-top"}>
                    <button onClick={() => navigate(-1)}>Done</button>
                </div>
                <section>
                    <form className={"horizontal-form"}>
                        <div className={"form-section"}>
                            <h3>Pdf Information</h3>
                            {/*
                                <p>
                                    <label>File</label>
                                    <input id='fileUpload' type='file'
                                           accept='application/pdf, image/png, image/jpeg'
                                           onChange={handleFileEvent}/>
                                </p>
                            */}
                            <p>
                                <label className={"required"}>Name</label>
                                <input type="text" placeholder={"Pdf Name"} onChange={e => setPdfName(e.target.value)}/>
                            </p>
                            <p>
                                <label className={"required"}>Url Link</label>
                                <input type="text" placeholder={"If file is null."}
                                       onChange={e => setPdfLink(e.target.value)}/>
                            </p>
                        </div>
                    </form>
                    <div className={"prevs"}>
                        <button disabled={checkPdfData()} onClick={() => {
                            InsertPdf()
                        }}>Insert Pdf Information
                        </button>
                        <p className="error">
                            {errorPdf.length > 0 && setTimeout(
                                () => setErrorPdf(""),
                                2000
                            ) && errorPdf}</p>
                    </div>
                </section>
            </main>
            <Overlay isOpen={isOpenLinks} onClose={toggleOverlayLinks} name={"Links"} setList={handleLinks}
                     array={links} deleteFromArray={deleteByIndexLinks}></Overlay>
            <Overlay isOpen={isOpenInfos} onClose={toggleOverlayInfos} name={"Infos"} setList={handleInfos}
                     array={infos} deleteFromArray={deleteByIndexInfos}></Overlay>
        </div>
    );
}

export default InsertExtraInfo;