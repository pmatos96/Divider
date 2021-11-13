import React from "react";
import "./grid.css";

const Operations = (props) => {

    return (
        <div className="operationsContainer">
            {props.helpOps && props.helpOps.length ? <b>Operações bônus</b> : ''}
            {props.helpOps.filter(op => op === '+').length > 0 && <button className="btn" onClick={()=>{props.changeOpFunction('+')}}>{props.helpOps.filter(op => op === '+').length} + </button>}
            {props.helpOps.filter(op => op === '-').length > 0 && <button className="btn" onClick={()=>{props.changeOpFunction('-')}}>{props.helpOps.filter(op => op === '-').length} - </button>}
            {props.score > 10 && <><b>Operação atual</b> <div className="currentOp">{props.currentOp}</div></>} 
            {/* <button onClick={()=>{props.changeOpFunction('/')}}> / </button> */}
        </div>
    )
}

export default Operations;