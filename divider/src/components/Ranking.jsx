import React from "react";
import "./grid.css";

const Ranking = (props) => {

    return (
        <div className="rankingBoard">
            <h1>Game Over</h1>
            {props.insertNameStep && 
            <>
            <input type="text" placeholder="Insira seu nome" name="nameInput" value={props.playerName} onChange={(e)=>{props.setPlayerNameFunction(e.target.value)}}/>
            {props.playerName && props.playerName.length && 
                <div className="rankingBtnContainer">
                    <div className="btn" onClick={props.handleRankingFunction}>Confirmar</div>
                </div>
            }
            </>
            }
            <ol>
            {(props.ranking || []).map(item => <li>{item.name} - <b>Score</b>: {item.score}</li>).slice(0,10)}
            </ol>
        </div>
    )
}

export default Ranking;