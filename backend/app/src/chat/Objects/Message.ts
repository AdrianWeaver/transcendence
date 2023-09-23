/* eslint-disable curly */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-len */
import { Public } from "@prisma/client/runtime/library";
import Channel from "./Channel";
import User from "./User";
import { Server, Socket } from "socket.io";

class Message
{
    public	sender: string;
	public	content: string;
	public	time: string;

    public constructor ()
    {
       
    }
};

export default Message;