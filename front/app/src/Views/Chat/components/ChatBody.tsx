/* eslint-disable max-len */
/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */

import React from "react";
import { useNavigate } from "react-router-dom";
import Home from "./ChatHome";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks/redux-hooks";
import { logOffUser } from "../../../Redux/store/controllerAction";

type ChatBodyProps =
{
  messages: any[] | never[];
}

const ChatBody = (props: ChatBodyProps) =>
{
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const	controller = useAppSelector((state) =>
	{
		return (state.controller);
	});
  const handleLeaveChat = () =>
  {
    localStorage.removeItem("userName");
    navigate(controller.previousPage);
    dispatch(logOffUser());
  };

  return (
    <>
      <header className="chat__mainHeader">
        <p>42_transcendence chat</p>
        <button className="leaveChat__btn" onClick={handleLeaveChat}>
          LEAVE CHAT
        </button>
      </header>

      <div className="message__container">
        {
        props.messages.map((message) =>
          message.name === localStorage.getItem("userName") ? (
            <div className="message__chats" key={message.id}>
              <p className="sender__name">You</p>
              <div className="message__sender">
                <p>{message.text}</p>
              </div>
            </div>
          ) : (
            <div className="message__chats" key={message.id}>
              <p>{message.name}</p>
              <div className="message__recipient">
                <p>{message.text}</p>
              </div>
            </div>
          )
        )}
        <div>
          <button className="sendMessage__btn" onClick={handleLeaveChat}>
            SEND
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatBody;
