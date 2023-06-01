import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import "./ArtworkGallery.css";
import {Pagination} from "../Extra/Pagination";
import {ADMIN, ArtTypes, RESEARCHER, setHeight, setWidth} from "../Extra/Helper";

function ArtworkGallery() {

    const [artworks, setArtworks] = useState([])
    const emailLogged = localStorage.getItem("email")
    const roleLogged = localStorage.getItem("role")

    useEffect(() => {
        fetch('http://localhost:8080/artwork/all', {
            method: 'GET',
            mode: 'cors',
            headers: {'Content-Type':'application/json'},
        })
            .then(response => {
                return response.json()
            })
            .then(data => setArtworks(data))
            .catch(r => console.log(r))
    }, [artworks])

    const [activePage, setActivePage] = useState(1)
    const [filter, setFilter] = useState()
    const [filterSelect, setFilterSelect] = useState()
    const rowsPerPage = 8

    const filteredRows = filterRows(artworks, filter, filterSelect)

    const calculatedRows = filteredRows.slice(
        (activePage - 1) * rowsPerPage,
        activePage * rowsPerPage
    )
    const count = filteredRows.length
    const totalPages = Math.ceil(count / rowsPerPage)

    const handleSearch = (value: any, type: any) => {
        setActivePage(1)

        if (type === "input") {
            if (value) {
                setFilter(value);
            } else
                // @ts-ignore
                setFilter();
        }
        if (type === "select") {
            if (value && value !== "default")
                setFilterSelect(value);
            else
                // @ts-ignore
                setFilterSelect();
        }
    }

    function filterRows(rows: any, filter: any, filterSelect: any) {
        if ((!filter || filter.length === 0) && (!filterSelect || filterSelect.length === 0)) return rows

        if (filter && !filterSelect) {
            return rows.filter((row: any) => {
                return (row.name.toLowerCase()).includes(filter.toLowerCase())
            })
        }
        if (filterSelect && !filter) {
            return rows.filter((row: any) => {
                return (row.artType.toLowerCase()).includes(filterSelect.toLowerCase())
            })
        }
        if (filterSelect && filter) {
            return rows.filter((row: any) => {
                return (row.artType.toLowerCase()).includes(filterSelect.toLowerCase()) && (row.name.toLowerCase()).includes(filter.toLowerCase())
            })
        }
    }

    return (
        <div className={"ArtworkGallery"}>
            <main>
                <section>
                    <div className={"row"}>
                        <input type={"search"} placeholder={"Search Artwork Name"}
                               onChange={event => handleSearch(event.target.value, "input")}/>&emsp;&emsp;
                        <select onChange={e => handleSearch(e.target.value, "select")}>
                            <option key={"default"} value={"default"}>No Filter</option>
                            {ArtTypes.map((k) => <option key={k} value={k}>{k}</option>)}
                        </select>
                    </div>
                    <div className={"boxes"}>
                        {calculatedRows.map((item: any) => (
                            <div key={item.id.valueOf()} className="box">
                                <p>{emailLogged !== "" && (roleLogged === RESEARCHER || roleLogged === ADMIN) && <><Link
                                    to={"/insert_point/" + item.id}>Insert New Point</Link></>}</p>
                                <p><Link to={"/artwork/" + item.id}>
                                    <img height={setHeight(item.pixelHeight, item.pixelWidth)}
                                         width={setWidth(item.pixelHeight, item.pixelWidth)}
                                         src={'data:image/png;base64,' + item.image} alt={""}></img>
                                </Link></p>

                                <p>{item.name}</p>
                                <p>{item.artType}</p>
                                {item.author ? item.author : "Unknown Author"}
                            </div>
                        ))
                        }
                    </div>
                    <Pagination
                        activePage={activePage}
                        count={count}
                        rowsPerPage={rowsPerPage}
                        totalPages={totalPages}
                        setActivePage={setActivePage}
                    />
                </section>
            </main>
        </div>
    );
}

export default ArtworkGallery;