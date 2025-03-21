import React from 'react';
import './TicTacToe.css';
import circle_icon from '../Assets/circle.png';
import cross_icon from '../Assets/cross.png';
import { useState, useRef, useEffect } from 'react';

const TicTacToe = ({ conn, myConnectionId, mySymbol, myTurn, roomCode }) => {

    let [data, setData] = useState(["", "", "", "", "", "", "", "", ""]);
    let [count, setCount] = useState(0);
    const [winner, setWinner] = useState(null);
    let [lock, setLock] = useState(false);

    const [showEndGameModal, setShowEndGameModal] = useState(false);
    const [gameResult, setGameResult] = useState(null);
    const [showResetConfirmation, setShowResetConfirmation] = useState(false);


    let titleRef = useRef(null);
    let box1 = useRef(null);
    let box2 = useRef(null);
    let box3 = useRef(null);
    let box4 = useRef(null);
    let box5 = useRef(null);
    let box6 = useRef(null);
    let box7 = useRef(null);
    let box8 = useRef(null);
    let box9 = useRef(null);

    let box_array = [box1, box2, box3, box4, box5, box6, box7, box8, box9];

    useEffect(() => {
        if (!conn || !myConnectionId) return;

        console.log("conn:", conn);
        console.log("myConnectionId:", myConnectionId);

        conn.on("ReceiveMove", ({ index, symbol }) => {
            updateBox(index, symbol, false);
            updateTitle(symbol === "x" ? "o" : "x");         
        });

        conn.on("ResetGame", () => {
            resetValues();
        });

        conn.on("GameWon", (symbol) => {
            setWinner(symbol);
            setLock(true);
            setGameResult({ status: 'won', winner: symbol });
            setShowEndGameModal(true);
            titleRef.current.innerHTML = `Winner is <img src='${symbol === "x" ? cross_icon : circle_icon}'>`;
        });

        conn.on("GameDraw", () => {
            setWinner("draw");
            setLock(true);
            setGameResult({ status: 'draw' });
            setShowEndGameModal(true);
            titleRef.current.innerHTML = "It's a draw!";
        });

        conn.on("ConfirmResetRequest", () => {
            setShowResetConfirmation(true);
        });

        conn.on("ResetRequestRejected", () => {
            alert("Reset request was rejected");
        });

        conn.on("RematchRequested", () => {
            setShowEndGameModal(true);
            setGameResult({ ...gameResult, rematchRequested: true });
        });

        conn.on("RematchAccepted", () => {
            resetValues();
            setShowEndGameModal(false);
        });

        conn.on("RedirectToLobby", () => {
            conn.stop();
            window.location.reload(); // Or handle state to return to lobby
        });

        return () => {
            conn.off("ReceiveMove");
            conn.off("GameWon");
            conn.off("GameDraw");
            conn.off("ResetGame");
            conn.off("NotYourTurn");
            conn.off("ConfirmResetRequest");
            conn.off("ResetRequestRejected");
            conn.off("RematchRequested");
            conn.off("RematchAccepted");
            conn.off("RedirectToLobby");
        };
    }, [data, conn, myConnectionId]);


    const updateTitle = (symbol) => {
        if (winner) return; // Don't update the title if there's already a winner
        if(titleRef.current) {
            titleRef.current.innerHTML = `It's Player ${symbol.toUpperCase()}'s turn`;
        };
    };

    const updateBox = (index, symbol, send = true) => {
        if (lock || data[index] !== "") return;

        const updatedData = [...data];
        updatedData[index] = symbol;
        setData(updatedData);
        setCount(prev => prev + 1);

        box_array[index].current.innerHTML = `<img src='${symbol === "x" ? cross_icon : circle_icon}'>`;

        if (send && conn) {
            conn.invoke("SendMove", {
                index,
                symbol
            });
        }
    };

    const handleResetConfirmation = async (confirm) => {
        setShowResetConfirmation(false);
        if (conn && roomCode) {
            await conn.invoke("ConfirmReset", roomCode, confirm);
            if (confirm) resetValues();
        }
    };

    const handleRematch = async () => {
        if (conn && roomCode) {
            await conn.invoke("RequestRematch", roomCode);
        }
    };



    const toggle = (e, num) => {
        if (lock || data[num] !== "" || !myTurn) return;



        const symbol = mySymbol;
        updateBox(num, symbol);
    };


    const resetValues = () => {
        setLock(false);
        setCount(0);
        setData(["", "", "", "", "", "", "", "", ""]);
        setWinner(null);
        updateTitle("x");
        //titleRef.current.innerHTML = 'Tic Tac Toe';
        box_array.forEach(box => box.current.innerHTML = "");
    }

    const reset = () => {
        if (conn && roomCode) {
            conn.invoke("RequestReset", roomCode);
        }
    };

    const EndGameModal = () => (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>
                    {gameResult?.status === 'won' && `Player ${gameResult.winner.toUpperCase()} wins!`}
                    {gameResult?.status === 'draw' && "Game Draw!"}
                </h3>
                <button onClick={() => window.location.reload()}>Back to Lobby</button>
                <button onClick={handleRematch}>
                    {gameResult?.rematchRequested ? "Accept Rematch" : "Request Rematch"}
                </button>
            </div>
        </div>
    );

    const ResetConfirmationModal = () => (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Another player wants to reset the game. Accept?</h3>
                <button onClick={() => handleResetConfirmation(true)}>Yes</button>
                <button onClick={() => handleResetConfirmation(false)}>No</button>
            </div>
        </div>
    );

    return (
        <div className="container">
            <h1 className="title" ref={titleRef}>Tic Tac Toe</h1>
            <h2>You are Player: {mySymbol ? mySymbol.toUpperCase() : "Waiting..."}</h2>
            <div className="board">
                <div className="row1">
                    <div className="boxes" ref={box1} onClick={(e) => { toggle(e, 0) }}></div>
                    <div className="boxes" ref={box2} onClick={(e) => { toggle(e, 1) }}></div>
                    <div className="boxes" ref={box3} onClick={(e) => { toggle(e, 2) }}></div>
                </div>
                <div className="row2">
                    <div className="boxes" ref={box4} onClick={(e) => { toggle(e, 3) }}></div>
                    <div className="boxes" ref={box5} onClick={(e) => { toggle(e, 4) }}></div>
                    <div className="boxes" ref={box6} onClick={(e) => { toggle(e, 5) }}></div>
                </div>
                <div className="row3">
                    <div className="boxes" ref={box7} onClick={(e) => { toggle(e, 6) }}></div>
                    <div className="boxes" ref={box8} onClick={(e) => { toggle(e, 7) }}></div>
                    <div className="boxes" ref={box9} onClick={(e) => { toggle(e, 8) }}></div>
                </div>
            </div>
            <button className="reset" onClick={() => { reset() }}>Reset</button>
            {showEndGameModal && <EndGameModal />}
            {showResetConfirmation && <ResetConfirmationModal />}
        </div>
    )
}

export default TicTacToe