import "./assets/index.css";
const	URL = "http://localhost:3000";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import Home from "./components/Home"

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
    
    const   chatMap =  message.map((elem, index) =>
    {
        return (
            <p key={index}>
                Sender #{elem.idSender}: {elem.content}
            </p>
        );
    });
    // console.log(chatMap);
    return (
        <>
            <Home />
            {chatMap}
        </>
    );
};

export default Chat;