import { Col, Row, Container } from 'react-bootstrap'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import WaitingRoom from './components/waitingroom';
import { useState } from 'react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import GameRoom from './components/GameRoom';
import * as signalR from '@microsoft/signalr';


function App() {
    const [conn, setConnection] = useState();
    const [messages, setMessages] = useState([]);
    const [myConnectionId, setMyConnectionId] = useState(null);
    const [mySymbol, setMySymbol] = useState(null);
    const [myTurn, setMyTurn] = useState(false);
    const [joinError, setJoinError] = useState(null);
    const [playerCount, setPlayerCount] = useState(1);
    const [roomCode, setRoomCode] = useState('');


    const joinTicTacToeGameRoom = async (ticTacToeGameRoom) => {
        try {
            // 1. Get current user
            const res = await fetch("https://localhost:7142/api/user/me", { //.
                credentials: "include"
            });

            if (!res.ok) {
                throw new Error("User not logged in or session expired.");
            }

            const { username } = await res.json();
            //setUsername(username);

            // 2. Setup connection
            const conn = new HubConnectionBuilder()
                .withUrl("https://localhost:7142/ReactTicTacToe", {
                    withCredentials: true,
                    transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling
                })
                .configureLogging(LogLevel.Information)
                .build();

            conn.on("JoinSpecificTicTacToeGameRoom", (user, msg, myConnectionId) => {
                console.log(`${user}: ${msg} : ${myConnectionId}`);
                const code = msg.split(' ').pop();
                setRoomCode(code);
            });

            conn.on("ReceiveSpecificMessage", (user, msg) => {
                setMessages(prev => [...prev, { username: user, msg }]);
            });

            conn.on("AssignSymbol", (symbol) => {
                console.log("assignsymbol received in App.js:", symbol);
                setMySymbol(symbol);               
            });

            conn.on("RoomFull", () => {
                alert("This room is full! Please create or join another room.");
                conn.stop();
                setConnection(null);
                setJoinError("Room is full. Please try another code.");
            });

            conn.on("PlayerLeft", (username) => {
                setMessages(prev => [...prev, {
                    username: 'system',
                    msg: `${username} has left the game`
                }]);
            });

            conn.on("PlayerCountUpdate", (count) => {
                setPlayerCount(count);
            });

            // 4. Start the connection
            await conn.start();
            console.log("SignalR Connected!");

           

            // 5. Get the connection ID from the hub
            const connectionId = await conn.invoke("GetConnectionId");
            setMyConnectionId(connectionId);
            
            console.log("Connection ID:", connectionId);
            

            conn.on("UpdateTurn", ({ connectionId: turnConnId }) => {
                setMyTurn(turnConnId === connectionId);
                console.log("myTurn", myTurn);

            });

            //if (!myConnectionId) {
            //    throw new Error("Connection ID is missing!");
            //}

            // 6. Join the room
            await conn.invoke("JoinSpecificTicTacToeGameRoom", ticTacToeGameRoom, username);

            //await conn.invoke("JoinSpecificTicTacToeGameRoom", 
            //    ticTacToeGameRoom,
            //    username,
            //    connectionId
            //);

            // 7. Save connection in state
            setConnection(conn);

        } catch (err) {
            console.error("Failed to join room:", err.message || err);
            setJoinError(err.message);
        }
    };

    const sendMessage = async (message) => {
        try {
              await conn.invoke("SendMessage", message)
        } catch (e) {
            console.log(e);
        }
    }

  return (
      <div>
          <main>
              <Container>
                  <Row className='px-5 my-5'>
                      <Col sm='12'>
                        <h1 className='font-weight-light'>Welcome to TicTacToe</h1>
                      </Col>
                  </Row>
                  {!conn
                      ? <WaitingRoom joinTicTacToeGameRoom={joinTicTacToeGameRoom} error={joinError} ></WaitingRoom>
                      : <GameRoom messages={messages}
                          sendMessage={sendMessage}
                          conn={conn}
                          myConnectionId={myConnectionId}
                          mySymbol={mySymbol}
                          myTurn={myTurn}
                          playerCount={playerCount}
                          roomCode={roomCode}
                      />
                  }
              </Container>
        </main>    
    </div>
  );
}

export default App;
