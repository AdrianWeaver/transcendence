/* eslint-disable max-statements */
/* eslint-disable no-multi-spaces */
/* eslint-disable curly */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-len */
import { type } from "os";
import Channel from "./Channel";
import Message from "./Message";
import User from "./User";
import { Server, Socket } from "socket.io";
import { UserModel } from "src/user/user.interface";
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
    playerOne: UserModel,
    playerTwo: UserModel,
    score: Score,
    moves: number,
    outStanding: boolean
};

type MemberSocketIdModel ={
	memberSocketId: string,
	profileId: string
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
	// public memberSocketIds: string[] = [];
	public memberSocketIds: Array<MemberSocketIdModel> = [];
	public message: Message[];
	public matchHistory: MatchHistory[];
	public deleteChannel: (name: string) => void;
	public addUserToChannel: (name: string, id: string) => void;
	public displayMessage: (message: Message) => void;
	public setServer: (server: Server) => void;
	public updateMemberSocketId: (newSocketId: string, profileId: string) => void;
	public getProfileIdFromSocketId: (socketId: string) => string;
	public updateChannelsAdminSocketId: (newSocketId : string, profileId:string) => void;
	public updateChannelOwner: (newSocketId: string, profileId: string) => void;
	public updateUserInChannels: (newSocketId: string, profileId: string) => void;
	public updateUserInChat: (newSocketId: string, profileId: string) => void;
	public updateUserSocketInChannels: (client: Socket) => void;
	public updateFriendList: (newSocketId: string, profileId: string) => void;
	public updateBannedInChannel: (newSocketId: string, profileId: string) => void;

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

		this.setServer = (server: Server) =>
		{
			console.log("YES WE CAN");
			this.server = server;
		};

		this.updateMemberSocketId = (newSocketId: string, profileId: string) =>
		{
			const index = this.memberSocketIds.findIndex((elem) =>
			{
				return (elem.profileId === profileId);
			});
			if (index === -1)
				return ;
			else
				this.memberSocketIds[index].memberSocketId = newSocketId;
		};

		this.getProfileIdFromSocketId = (socketId: string) : string =>
		{
			const	index = this.memberSocketIds.findIndex((elem) =>
			{
				return (elem.memberSocketId === socketId);
			});
			if (index === -1)
				return ("undefined");
			else
				return (this.memberSocketIds[index].profileId);
		};

		this.updateChannelsAdminSocketId = (newSocketId : string, profileId:string) =>
		{
			this.channels.forEach((channel) =>
			{
				channel.admins.forEach((admin) =>
				{
					if (admin.profileId === profileId)
						admin.memberSocketId = newSocketId;
				});
			});
		};

		this.updateChannelOwner = (newSocketId: string, profileId: string) =>
		{
			this.channels.forEach((channel) =>
			{
				if (channel.owner.profileId === profileId)
					channel.owner.memberSocketId = newSocketId;
			});
		};

		this.updateUserInChannels = (newSocketId: string, profileId: string) =>
		{
			this.channels.forEach((channel) =>
			{
				channel.users.forEach((user) =>
				{
					if (user.profileId === profileId)
						user.memberSocketId = newSocketId;
				});
			});
		};

		this.updateUserInChat = (newSocketId: string, profileId: string) =>
		{
			this.users.forEach((user) =>
			{
				if (user.profileId === profileId)
					user.id = newSocketId;
			});
		};

		this.updateUserSocketInChannels = (client: Socket) =>
		{
			this.channels.forEach((channel) =>
			{
				channel.sockets.push(client);
			});
		};

		this.updateBannedInChannel = (newSocketId: string, profileId: string) =>
		{
			this.channels.forEach((channel) =>
			{
				channel.banned.forEach((bannedUser) =>
				{
					if (bannedUser.profileId === profileId)
						bannedUser.memberSocketId = newSocketId;
				});
			});
		};
	}
}

export default Chat;
