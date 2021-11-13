import React from "react";
import "./grid.css";

const Ranking = (props) => {

    return (
        <div className="rankingBoard">
            <h1>Game Over</h1>
            {props.insertNameStep && 
            <>
            <input type="text" placeholder="Insira seu nome" name="nameInput" value={props.playerName} onChange={(e)=>{props.setPlayerNameFunction(e.target.value)}}/>
            {props.playerName && props.playerName.length && <button onClick={props.handleRankingFunction}>Confirmar</button>}
            </>
            }
            <ol>
            {(props.ranking || []).map(item => <li>{item.name} - Score: {item.score}</li>)}
            </ol>
        </div>
    )
}

export default Ranking;