

const	URL = "http://localhost:3000";
import { io } from "socket.io-client";

const   Chat = () =>
{
    const   message = [
        {
            idSender: 1,
            content: "Spam"
        },
        {
            idSender: 1,
            content: "Spam"
        },
        {
            idSender: 1,
            content: "Spam"
        }
    ];

    const   chatMap =  message.map((elem, index) =>
    {
        <p key={index}>
            Sender #{elem.idSender}: {elem.content}
        </p>
    }); 
    return (
        <>
            {chatMap}
        </>
    );
};

export default Chat;