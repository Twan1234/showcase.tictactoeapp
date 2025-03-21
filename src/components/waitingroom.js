import { useState } from "react";
import { Form, Button, Col, Row, Card, Alert } from "react-bootstrap";

const WaitingRoom = ({ joinTicTacToeGameRoom, error: propError }) => {
    const [roomCode, setRoomCode] = useState('');
    const [localError, setLocalError] = useState('');

    const generateRoomCode = () => {
        return Math.random().toString(36).substr(2, 5).toUpperCase();
    };

    const handleJoin = (e) => {
        e.preventDefault();
        setLocalError('');


        if (roomCode && roomCode.length !== 5) {
            setLocalError('Room code must be 5 characters');
            return;
        }

        let finalCode = roomCode;

        if (finalCode.length === 0) {
            finalCode = generateRoomCode();
            setRoomCode(finalCode);
        }

        joinTicTacToeGameRoom(finalCode);
    };

    return (
        <Card className="mx-auto mt-5" style={{ maxWidth: '500px' }}>
            <Card.Body>
                <Card.Title className="text-center mb-4">Join Tic Tac Toe Game</Card.Title>
                {propError && <Alert variant="danger">{propError}</Alert>}
                {localError && <Alert variant="danger">{localError}</Alert>}
                <Form onSubmit={handleJoin}>
                    <Row className="mb-3">
                        <Col sm={12}>
                            <Form.Group controlId="formRoomCode">
                                <Form.Label>Enter Room Code (optional)</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Leave blank to create new room"
                                    value={roomCode}
                                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                                    maxLength={5}
                                />
                                <Form.Text className="text-muted">
                                    If creating new room, a code will be generated automatically
                                </Form.Text>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="mt-4">
                        <Col sm={12} className="d-grid">
                            <Button variant="primary" type="submit" size="lg">
                                {roomCode ? 'Join Existing Room' : 'Create New Room'}
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default WaitingRoom;
