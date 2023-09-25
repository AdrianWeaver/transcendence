/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable curly */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-len */
import { Public } from "@prisma/client/runtime/library";
import Channel from "./Channel";
import User from "./User";
import { Server, Socket } from "socket.io";

class Message
{
    public	sender: User;
	public	channel: Channel;
	public	content: string;
	public	time: string;
	public	setSender: (sender: User) => void;
	public	setChannel: (channel: Channel) => void;
	public	setContent: (content: string) => void;

    public constructor ()
    {
		this.setSender = (sender: User) =>
		{
			this.sender = sender;
		};

		this.setChannel = (channel: Channel) =>
		{
			this.channel = channel;
		};

		this.setContent = (content: string) =>
		{
			this.content = content;
		};
    }
}

export default Message;
