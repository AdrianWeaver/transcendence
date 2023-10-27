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
import { Public, raw } from "@prisma/client/runtime/library";

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

type MemberSocketIdModel = {
	memberSocketId: string,
	profileId: string
};

type MessageModel =
{
	sender: string,
	message: string,
	id: number,
    username: string,
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
	// public message: Message[];
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
	public parseForDatabase: () => void;
	public databaseToObject: (rawObj: any) => void;

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
				channel.messages.forEach((message: MessageModel) =>
				{
					message.sender = client.id;
				});
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
		this.parseForDatabase = () =>
		{
			const	channels: any = [];
			const	privateMessage: any = [];
			const	users: any= [];

			this.channels.forEach((channel) =>
			{
				const data = channel.parseForDatabase();
				channels.push(data);
			});
			this.privateMessage.forEach((elem) =>
			{
				const	data = elem.parseForDatabase();
				privateMessage.push(data);
			});
			this.users.forEach((elem) =>
			{
				const	data = elem.parseForDatabase();
				users.push(data);
			});
			const	databaseObj = {
				channels: channels,
				privateMessage: privateMessage,
				chanMap: this.chanMap,
				privateMessageMap: this.privateMessageMap,
				users: users,
				activeMembers: this.activeMembers,
				memberSocketIds: this.memberSocketIds,
				matchHistory: this.matchHistory,
			};
			return (databaseObj);
		};
		this.databaseToObject = (rawObj: any) =>
		{
			const	rawChannels = rawObj.channels;
			const	rawPrivateMessages = rawObj.privateMessage;
			const	rawUsers = rawObj.users;

			rawChannels.forEach((raw: any) =>
			{
				console.log("here !!");
				const	newChannel = new Channel(raw.name);
				// newChannel.setClient(null, raw.owner.profileId);
				newChannel.setOwner({...raw.owner});
				newChannel.setFromDatabaseAdmins([...raw.admins]);
				newChannel.setKind(raw.kind);
				newChannel.setPassword(raw.password);
				newChannel.setMode(raw.mode);
				newChannel.id = raw.id;
				newChannel.users = [...raw.users];
				console.log("--> raw channel", raw);
				console.log("new channel : ", newChannel);
				this.channels.push(newChannel);
			});
			rawPrivateMessages.forEach((raw: any) =>
			{
				const	newPrivateMessage = new Channel(raw.name);
				newPrivateMessage.setOwner(raw.owner);
				newPrivateMessage.setFromDatabaseAdmins(raw.admins);
				newPrivateMessage.setKind(raw.kind);
				newPrivateMessage.setPassword(raw.password);
				newPrivateMessage.id = raw.id;
				newPrivateMessage.setMode(raw.mode);
				console.log("--> raw private msg", raw);
				console.log("new private msg", newPrivateMessage);
				this.privateMessage.push(newPrivateMessage);
			});
			rawUsers.forEach((raw: any) =>
			{
				const	newUser = new User(raw.name, raw.profileId);
				const	chanArray = [...raw.channels];
				const	newChanArray: string[] = [];
				chanArray.forEach((elem) =>
				{
					if (elem !== null)
						newChanArray.push(elem);
				});
				newUser.id = raw.id;
				newUser.blocked = [...raw.blocked];
				newUser.friends = [...raw.friends];
				newUser.channels = [...newChanArray];
				console.log("raw user", raw);
				console.log("new user", newUser);
				this.users.push(newUser);
			});
			this.chanMap = [...rawObj.chanMap];
			this.privateMessageMap = [...rawObj.privateMessageMap];
			this.memberSocketIds = [...rawObj.memberSocketIds];
		};
	}
}

export default Chat;
