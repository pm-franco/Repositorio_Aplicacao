import React, {Fragment, useState} from "react";
import "./Overlay.css";
import {Pagination} from "./Pagination";

function Overlay({ isOpen, onClose, setList, name, array, deleteFromArray}:any) {

    const [data, setData] = useState("")

    function handleClick(){
        setList(data)
        setData("")
    }

    function handleDelete(index:number){
        deleteFromArray(index)
    }

    const [activePage, setActivePage] = useState(1)
    const rowsPerPage = 6
    const count = array.length
    const totalPages = Math.ceil(count / rowsPerPage)
    const calculatedRows = array.slice((activePage - 1) * rowsPerPage, activePage * rowsPerPage)

    return (
        <Fragment>
            {isOpen && (
                <div className="overlay">
                    <div className="overlay__background" onClick={onClose} />
                    <div className="overlay__container">
                    <>
                        </>
                        <div className={"data"}>
                            <h3>Insert {name}</h3>
                            <p>
                                <input type={"text"} placeholder={"write value"} value={data} onChange={ e=> setData(e.target.value)}/>
                                <button disabled={data===""} onClick={handleClick}>Add it</button>
                            </p>
                        </div>
                        <div className={"data_move"}>
                            {array.length===0?"No data inserted yet.":<>
                            {/*<table border={2} cellPadding={20}>
                                <thead>
                                <tr>
                                    <th>Value</th>
                                    <th>Remove</th>
                                </tr>
                                </thead>
                                <tbody>
                                { calculatedRows.map((value:any, index:number) => {
                                    return (
                                        <tr key={index}>
                                            <td>{value}</td>
                                            <td><button onClick={() => handleDelete(index)}>Delete</button></td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </table>
                                */}
                                {calculatedRows.map((value:any, index:number) => {
                                    return (
                                        <ul key={index}>
                                            <li> {value} <button onClick={() => handleDelete(index)}>Delete</button></li>
                                        </ul>
                                    )
                                })}
                            <Pagination
                                activePage={activePage}
                                count={count}
                                rowsPerPage={rowsPerPage}
                                totalPages={totalPages}
                                setActivePage={setActivePage}
                            /></>}
                        </div>
                    </div>
                </div>
            )}
        </Fragment>
    );
}

export default Overlay;