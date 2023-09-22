import "./assets/index.css";
const	URL = "http://localhost:3000";
import { io } from "socket.io-client";
import Home from "./components/ChatHome"
import ConnectState from "../TestBall/Component/ConnectState";
import socketIO from 'socket.io-client';
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../Redux/hooks/redux-hooks";
import { logOffUser } from "../../Redux/store/controllerAction";
import React from 'react';
import ChatPage from "./components/ChatPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Http } from "@mui/icons-material";

const   Chat = () =>
{
    const
    [
        connected,
        setConnected
    ] = useState(false);

    const [userName, setUserName] = useState('');

    const   isSigned = useAppSelector((state) =>
    {
        return (state.controller.user.isLoggedIn);
    });

    const   dispatch = useAppDispatch();

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

    const	socketRef = useRef<SocketIOClient.Socket | null>(null);

    useEffect(() =>
    {
        const socket = io(URL,
        {
            autoConnect: false,
            reconnectionAttempts: 5,
        });

        socketRef.current = socket;
        
        const connect = () =>
		{
			// const	action = {
			// 	type: "GET_BOARD_SIZE"
			// };
			// socket.emit("info", action);
			setConnected(true);
		};

		const disconnect = () =>
		{
			// console.log("ws disconnected");
			setConnected(false);
		};

		const	connectError = (error: Error) =>
		{
			console.error("ws_connect_error", error);
		};
        socket.on("connect", connect);
		socket.on("disconnect", disconnect);
        socket.on("error", connectError);
        socket.connect();

        return (() =>
        {
            socket.off("connect", connect);
		    socket.off("disconnect", disconnect);
            socket.off("error", connectError);
        });
    }, []);

    // const   sendPseudoToServer = () =>
    // {
    //     const   action = {
    //         type: 'pseudo',
    //         payload: {
    //             chatPseudo: chat.pseudo
    //         }
    //     }
    //     socketRef.current?.emit("pseudo-message", action);
    // }

    const	displayStyle: React.CSSProperties = {
		textAlign: "center",
		fontSize: "8px"
	};


    const   Discussion = () =>
    {
        return (
            <>
                <h1>Discuss</h1>
                <button onClick={(e: any) =>
                {
                    e.preventDefault();
                    dispatch(logOffUser());
                }
                }>Disconnect</button>
            </>
        );
    }
    
    // console.log(chatMap);
    return (
        <>
            <div style={displayStyle}>
				<ConnectState connected={connected} />
			</div>
            <ChatPage socket={socketRef.current} />

        </>
    );
};
  
export default Chat;