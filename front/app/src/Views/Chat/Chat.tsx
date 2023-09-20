import "./assets/index.css";
import Home  from "../Home/Home";

const	URL = "http://localhost:3000";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

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

    // console.log(message);
    
    const   chatMap =  message.map((elem) =>
    {
        return (
            <p>
                Sender #{elem.idSender}: {elem.content}
            </p>
        );
    });
    // console.log(chatMap);
    return (
        <>
            {chatMap}
        </>
    );
};

export default Chat;