import React, { useEffect, useState } from "react";
import anime from 'animejs/lib/anime.es.js';
import { create, all, round, random, matrix, help } from "mathjs";
import _ from "lodash";
import firebase from "firebase";
import "./grid.css";
import Score from "./Score";
import NewGameButton from "./NewGameButton";
import Operations from "./Operations";
import Ranking from "./Ranking";


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
    const [helpOps, setHelpOps] = useState([]);
    const [currentOp, setCurrentOp] = useState('/');
    const [insertNameStep, setInsertNameStep] = useState(false);
    const [gameIsOver, setGameIsOver] = useState(false);
    const [ranking, setRanking] = useState([]);
    const [playerName, setPlayerName] = useState('');

    console.log(numbers);
    console.log(centralPosition);

    const newGame = () => {
        setNumRows(5);
        setGameStarted(false);
        setNumbers(math.zeros(numRows, numRows));
        setActivePosition([centralPosition, centralPosition]);
        setActiveNumber(3);
        setScore(0);
        setCurrentOp('/');
        setHelpOps([]);
        setGameIsOver(false);
        setInsertNameStep(false);
        setRanking([]);
        setPlayerName('');
    }

    const randomNumber = (lim) => {
        let number;
        number = round(random(1,lim),0);
        return number;
    }

    const insertRankingScore = () => {

        let firebaseApp;

        const firebaseConfig = {
            apiKey: "AIzaSyCIQ0_33rYSexhy7URacbKYfNm4GAR_mDc",
            authDomain: "divider-game.firebaseapp.com",
            projectId: "divider-game",
            storageBucket: "divider-game.appspot.com",
            messagingSenderId: "1019366920932",
            appId: "1:1019366920932:web:80ce4c0e3ec4392d3c52f1"
        };

        
        if (firebase.apps.length === 0) {
            firebaseApp = firebase.initializeApp(firebaseConfig);
        }
        else{
            firebaseApp = firebase.apps[0];
        }

        var db = firebaseApp.firestore();
        
        db.collection("userScores").add({
            "name": playerName,
            "score": score
        })
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });

        db.collection("userScores").get().then((querySnapshot)=>{

            let rankingData = [];

            querySnapshot.forEach((doc) => {
                console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
                rankingData.push(doc.data());
            });

            (rankingData || []).sort( (a,b) => {
                // Ordena o ranking pela pontuação
                if ( a.score < b.score ){
                    return 1;
                }
                if ( a.score > b.score ){
                    return -1;
                }
                return 0;
            })

            setRanking(rankingData);
        });
    }

    const checkGameOver = () => {

        if (
            numbers._data[centralPosition][centralPosition - 1] && numbers._data[centralPosition][centralPosition + 1] &&
            numbers._data[centralPosition - 1][centralPosition] && numbers._data[centralPosition + 1][centralPosition]
            && checkGameOverDivisionConditions() && (!helpOps || !helpOps.length)
        )
        {
            setGameIsOver(true);
            setInsertNameStep(true);
            
        }
    }

    const checkGameOverDivisionConditions = () => {
        return (
            numbers._data[centralPosition][centralPosition - 1] % (activeNumber + 1) !== 0 &&
            numbers._data[centralPosition][centralPosition + 1] % (activeNumber + 1) !== 0 &&
            numbers._data[centralPosition + 1][centralPosition] % (activeNumber + 1) !== 0 &&
            numbers._data[centralPosition + 1][centralPosition] % (activeNumber + 1) !== 0
        )
    }

    const handleRanking = () => {

        setInsertNameStep(false);
        insertRankingScore();
    } 

    const newNumber = () => {
        setCurrentOp('/');
        setActiveNumber(activeNumber + 1);
        checkGameOver();
    }

    const scoreUp = () => {
        setScore(score + 1);
        if(score > 0 && score % 10 === 0){
            setHelpOps([...helpOps, randomNumber(2) === 1 ? '+' : '-']);
        }
    }

    const isNextBorder = (nextI, nextJ) => {
        if(nextJ+1 === 1 || nextI+1 === 1 || nextJ+1 === numRows || nextI+1 === numRows){
            return true;
        }
        else{
            return false;
        }
    }

    const subtract = (nextI,nextJ,borderNumber) => {
        let subtractedNumber =  activeNumber > borderNumber ? activeNumber - borderNumber : borderNumber - activeNumber;
        if(subtractedNumber !== 0){
            if(isNextBorder(nextI, nextJ)){
                setNumbers(numbers.subset(math.index(nextI,nextJ), subtractedNumber));
                setActivePosition([centralPosition, centralPosition]);
                newNumber();
                scoreUp();
            }
            else{
                setNumbers(numbers.subset(math.index(nextI,nextJ), null));
                setActivePosition([nextI, nextJ]);
                setActiveNumber(subtractedNumber);
                setCurrentOp('/');
            }
        }
    }

    const sum = (nextI,nextJ,borderNumber) => {
        let summedNumber =  activeNumber + borderNumber;
        if(isNextBorder(nextI, nextJ)){
            setNumbers(numbers.subset(math.index(nextI,nextJ), summedNumber));
            setActivePosition([centralPosition, centralPosition]);
            newNumber();
            scoreUp();
        }
        else{
            setNumbers(numbers.subset(math.index(nextI,nextJ), null));
            setActivePosition([nextI, nextJ]);
            setActiveNumber(summedNumber);
            setCurrentOp('/');
        }
    }

    const divide = (nextI,nextJ,borderNumber) => {
        setNumbers(numbers.subset(math.index(nextI,nextJ), activeNumber/borderNumber));
        setActivePosition([centralPosition, centralPosition]);
        newNumber();
        scoreUp();
    }

    const addBorder = () => {
        setNumbers(numbers.subset(math.index(activePosition[0],activePosition[1]), activeNumber));
        // setAditionalBorders(...aditionalBorders, [activePosition]);
        setActivePosition([centralPosition, centralPosition]);
        newNumber();
    }

    const opsCounter = () => {
        let sumNumber = helpOps.filter(op => op === '+').length;
        let subtractNumber = helpOps.filter(op => op === '-').length;
        return {
            sum: sumNumber,
            subtract: subtractNumber
        }
    }

    const changeOp = (op) => {
        // if(op === '/'){
        //     setCurrentOp('/')
        //     return;
        // }
        let ops = helpOps;
        let index = helpOps.indexOf(op);
        ops.splice(index, 1);
        setHelpOps(ops);
        setCurrentOp(op);
    }

    const handleMove = (nextI, nextJ) => {
        let borderNumber = numbers._data[nextI][nextJ];
        if(borderNumber){
            if(currentOp === '-'){
                subtract(nextI,nextJ,borderNumber);
            }
            else if(currentOp === '+'){
                sum(nextI,nextJ,borderNumber);
            }
            else if(activeNumber % borderNumber === 0){
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
            default:
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
                let number = randomNumber(10);
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
        <>
        <div className="grid">
            <Score score={score}/>
            {initBoard()}
            <br></br>
        </div>
        <NewGameButton newGameFunction={newGame}/>
        <Operations 
            helpOps={helpOps} 
            currentOp={currentOp} 
            changeOpFunction={changeOp} 
            score={score}
        />
        {gameIsOver && 
        <Ranking 
            insertNameStep={insertNameStep}
            playerName={playerName}
            setPlayerNameFunction={setPlayerName}
            handleRankingFunction={handleRanking}
            ranking={ranking}
        />
        }
        </>
    )
}

export default Grid;