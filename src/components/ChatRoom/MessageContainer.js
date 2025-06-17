import { Table } from "react-bootstrap";

const MessageContainer = ({ messages }) => {
    return <div>
        {
            messages.map((msg, index) => 
                <Table striped bordered>
                    <tr key={index} data-cy="message">
                        <td>{msg.msg} - {msg.username}</td>
                    </tr>

                </Table>)
        }
    </div>
}

export default MessageContainer;