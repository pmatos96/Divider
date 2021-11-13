import React from "react";
import "./grid.css";

const Score = (props) => {

    return (
        <div className="score mainFont">
            Score 
            <br></br>
            {props.score}
        </div>
    )
}

export default Score;