import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import TicTacToe from "./TicTacToe/TicTacToe";
import ChatRoom from "./ChatRoom/ChatRoom";

const GameRoom = ({ messages, sendMessage, conn, myConnectionId, mySymbol, myTurn, playerCount, roomCode }) => {

    return (
        <div>
            <main>
                <Container>
                    <Row className='px-5 my-3'>
                        <Col sm='12'>
                            <h1 className='font-weight-light'>Welcome to Room: {roomCode}</h1>
                            {playerCount === 1 && (
                                <Alert variant="info" className="mt-3">
                                    Waiting for another player to join... (Share room code: {roomCode})
                                </Alert>
                            )}
                        </Col>
                    </Row>
                    <Row className='px-5 my-5'>
                        <Col sm={6}>
                            <ChatRoom messages={messages} sendMessage={sendMessage} />
                        </Col>
                        <Col sm={6}>
                            <TicTacToe
                                conn={conn}
                                myConnectionId={myConnectionId}
                                mySymbol={mySymbol}
                                myTurn={myTurn && playerCount === 2}
                                roomCode={roomCode}
                            />
                        </Col>
                    </Row>
                </Container>
            </main>
        </div>
    );
};

export default GameRoom;