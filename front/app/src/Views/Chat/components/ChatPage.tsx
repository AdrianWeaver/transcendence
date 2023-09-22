import React, { MutableRefObject, useEffect, useState } from 'react';
import ChatBar from './ChatBar';
import ChatBody from './ChatBody';
import ChatFooter from './ChatFooter';
import { Socket } from 'socket.io-client';
import RightChatBar from './RightChatBar';

type ChatPageProps =
{
  socket?: SocketIOClient.Socket | null;
}

const ChatPage = (props: ChatPageProps) =>
{
  const [messages, setMessages] : any[] = useState([]);

  useEffect(() =>
  {
    props.socket?.current?.on('messageResponse', (data : any) =>
    {
      setMessages([...messages, data])
    });
  }, [props.socket, messages]);

  return (
    <div className="chat">
      <ChatBar />
      <div className="chat__main">
        <ChatBody messages={messages} />
        <ChatFooter socket={props.socket} />
      </div>
      <RightChatBar />
    </div>
  );
};

export default ChatPage;
