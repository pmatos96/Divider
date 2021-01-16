import React, { useEffect, useState } from "react";
import anime from 'animejs/lib/anime.es.js';
import { create, all, round, random, matrix } from "mathjs";
import _ from "lodash";
import "./grid.css";


const Grid = () =>{

    const config = { };
    const math = create(all, config);

    const [numRows, setNumRows] = useState(5);
    const [gameStarted, setGameStarted] = useState(false);
    const [numbers, setNumbers] = useState(math.zeros(numRows, numRows));
    const [aditionalBorders, setAditionalBorders] = useState([]);
    const centralPosition = math.floor(numRows/2);
    const [activePosition, setActivePosition] = useState([centralPosition, centralPosition]);
    const [activeNumber, setActiveNumber] = useState(3);
    const [score, setScore] = useState(0);

    console.log(numbers);
    
    const [ai, setAi] = useState(3);



    const newGame = () => {
        setNumRows(5);
        setGameStarted(false);
        setNumbers(math.zeros(numRows, numRows));
        setActivePosition([centralPosition, centralPosition]);
        setActiveNumber(3);
        setScore(0);
    }

    const randomNumber = () => {
        let number;
        number = round(random(1,10),0);
        return number;
    }

    const newNumber = () => {
        setActiveNumber(activeNumber + 1);
    }

    const divide = (nextI,nextJ,borderNumber) => {
        setNumbers(numbers.subset(math.index(nextI,nextJ), activeNumber/borderNumber));
        setActivePosition([centralPosition, centralPosition]);
        newNumber();
        setScore(score + 1);
    }

    const addBorder = () => {
        setNumbers(numbers.subset(math.index(activePosition[0],activePosition[1]), activeNumber));
        // setAditionalBorders(...aditionalBorders, [activePosition]);
        setActivePosition([centralPosition, centralPosition]);
        newNumber();
    }

    const handleMove = (nextI, nextJ) => {
        let borderNumber = numbers._data[nextI][nextJ];
        if(borderNumber){
            if(activeNumber % borderNumber === 0){
                divide(nextI,nextJ,borderNumber);
            }
            else{
                return;
            }
        }
        else{
            setActivePosition([nextI, nextJ]);
        }
        return;
    }



    const move = (e) => {

        let nextI;
        let nextJ;
        console.log(e.key);
        let direction = e.type === 'keydown' ? e.key : e.target.name;
        
        switch(direction){
            
            case 'ArrowUp':
                nextI = activePosition[0] - 1;
                nextJ = activePosition[1]
                handleMove(nextI, nextJ);
                break;
            case 'ArrowDown':
                nextI = activePosition[0] + 1;
                nextJ = activePosition[1];
                handleMove(nextI, nextJ);
                break;
            case 'ArrowLeft':
                nextI = activePosition[0];
                nextJ = activePosition[1] - 1;
                handleMove(nextI, nextJ);
                break;
            case 'ArrowRight':
                nextI = activePosition[0];
                nextJ = activePosition[1] + 1;
                handleMove(nextI, nextJ);
                break;
            case 'Enter':
                console.log(activePosition, [centralPosition, centralPosition]);
                if(activePosition[0] !== centralPosition || activePosition[1] !== centralPosition){
                    addBorder();
                }
                break;
        }


    }

    const initBoard = () => {
        let row = [];
        let matrix = [];
        _.times(numRows, (i) =>{
            _.times(numRows, (j) =>{
                row.push(<div id={"" + Number(i+1) + Number(j+1)} 
                            className={"square" + 
                            // (j+1 === 1 || i+1 === 1 || j+1 === numRows || i+1 === numRows ? " borderSquare" : "") +
                            (numbers._data[i][j] &&  !(i === activePosition[0] && j === activePosition[1]) ? " borderSquare" : "") +
                            (i === activePosition[0] && j === activePosition[1] ? " activeSquare" : "")}>
                            <div className="number">
                                {numbers._data[i][j] || j+1 === 1 || i+1 === 1 || j+1 === numRows || i+1 === numRows ? numbers._data[i][j] : 
                                (i === activePosition[0] && j === activePosition[1] ? activeNumber : "")}
                            </div>
                        </div>)
            });
            matrix[i] = <div className="row">{row}</div>
            row = [];
        });
        return matrix;
    }
    
    if(!gameStarted){
        _.times(numRows, (i) =>{
            _.times(numRows, (j) =>{
                let number = randomNumber();
                setNumbers(numbers.subset(math.index(i,j), 
                j+1 === 1 || i+1 === 1 || j+1 === numRows || i+1 === numRows ? number : null));
            });
        });
        console.log(numbers);
        setGameStarted(true);
    }   

    useEffect(()=>{
        window.addEventListener('keydown', move);

        return () => {
            window.removeEventListener('keydown', move);
        };
    });


    return(
        
        <div className="grid">
            <div className="score">{score}</div>
            {initBoard()}
            <button name ='ArrowUp' onClick={move} >up</button>
            <button onClick={move} name ='ArrowDown'>down</button>
            <button onClick={move} name ='ArrowLeft'>left</button>
            <button onClick={move} name ='ArrowRight'>right</button>
            <button onClick={newGame}>Novo Jogo</button>
        </div>
    )
}

export default Grid;