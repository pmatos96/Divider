import React from "react";
import "./grid.css";

const NewGameButton = (props) => {

    return (
        <div className="btnContainer">
            <div className="btn newGameBtn" onClick={props.newGameFunction}>Novo Jogo</div>
        </div>
    )
}

export default NewGameButton;