/* eslint-disable curly */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-len */
import { type } from "os";
import Channel from "./Channel";
import Message from "./Message";
import User from "./User";
import { Server, Socket } from "socket.io";
import { Public } from "@prisma/client/runtime/library";

type ChanMapModel = {
	id: number,
	name: string,
	mode: string
};

type Score = {
	playerOne: number,
	playerTwo: number
}

type MatchHistory = {
	playerOne: string,
	playerTwo: string,
	score: Score,
	moves: number
};
class Chat
{
	public channels: Channel[] = [];
	public privateMessage: Channel[] = [];
	public chanMap: Array<ChanMapModel> = [];
	public privateMessageMap: Array<ChanMapModel> = [];
	public users: User[] = [];
	public server: Server | undefined;
	public activeMembers: number;
	public memberSocketIds: string[] = [];
	public message: Message[];
	public matchHistory: MatchHistory;
	public deleteChannel: (name: string) => void;
	public addUserToChannel: (name: string, id: string) => void;
	public displayMessage: (message: Message) => void;

	public constructor ()
	{
		this.server = undefined;
		this.deleteChannel = (name: string) =>
		{
			for (const channel of this.channels)
			{
				if (channel.name === name)
				{
					const chanIndex = this.channels.findIndex((element) =>
					{
						return (element === channel);
					});
					this.channels.splice(chanIndex, 1);
				}
			}
		};
	}
}

export default Chat;
