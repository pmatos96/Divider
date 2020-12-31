import React, { useState } from "react";
import anime from 'animejs/lib/anime.es.js';
import _ from "lodash";
import "./grid.css";


const Grid = () =>{

    const [numRows, setNumRows] = useState(9);

    let row = [];
    let matrix =[];



    _.times(numRows, (i) =>{
        _.times(numRows, (j) =>{row.push(<div id={"" + Number(i+1) + Number(j+1)} className={"square" + (j+1 === 1 || i+1 === 1 || j+1 === numRows || i+1 === numRows ? " borderSquare" : "")}><div className="number">{i+1}{j+1}</div></div>)});
        matrix[i] = <div className="row">{row}</div>
        row = [];
    })
    

    return(
        
        <div className="grid">
            {matrix}
        </div>
    )
}

export default Grid;