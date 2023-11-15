/* eslint-disable curly */
/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-len */
import { randomBytes } from "crypto";
import Chat from "./Chat";
import User from "./User";
import { Server, Socket } from "socket.io";

type MessageModel =
{
	sender: string,
	message: string,
	id: number,
	username: string,
}

// type profileSocketIdModel = {
//     socketId: string,
//     profileId: string,
// }
type MemberSocketIdModel ={
	memberSocketId: string,
	profileId: string
};

class Channel
{
	public id: string;
	public kind: string;
	public owner: MemberSocketIdModel;
	// public admins: string[] = [];
	public admins: MemberSocketIdModel[] = [];
	public banned: MemberSocketIdModel[] = [];
	public name: string;
	public users: MemberSocketIdModel[] = [];
	public mode: string;
	public members: number;
	public password: string | undefined;
	public messages: MessageModel[] = [];
	public chat: Chat | undefined;
	public sockets: Socket[] = [];
	public isMember: (id: string) => boolean;
	public isOwner: (id: string) => boolean;
	public isAdmin: (id: string) => boolean;
	public isBanned: (id: string) => boolean;
	public addAdmin: (id: string) => void;
	public addToBanned: (id: string, profileId: string) => void;
	public addNewMessage: (message: MessageModel) => void;
	public leaveChannel: (client: Socket) => void;
	public findClientById: (socketId: string) => Socket | undefined;
	public setName: (name: string) => void;
	public setClient: (client: Socket | null, profileId: string) => void;
	public setMode: (mode: string) => void;
	public setKind: (kind: string) => void;
	public setPassword: (password: string) => void;
	public setId: () => void;
	public setOwner: (owner: MemberSocketIdModel) => void;

	// eslint-disable-next-line max-params
	public constructor(name: string)
	{
		// this.kind = kind;
		this.name = name;
		this.members = 0;
		this.chat = undefined;
		this.members++;
		this.setId = () =>
		{
			if (this.id === "undefined" || this.id === undefined)
			{
				const newId = randomBytes(16).toString("hex");
				this.id = newId;
			}
		};
		this.setOwner = (owner: MemberSocketIdModel) =>
		{
			// if (owner.profileId === undefined)
			// 	throw new Error("this.setOwner = (owner: MemberSocketIdModel) =>");
			this.owner = owner;
		};
		this.setName = (name: string) =>
		{
			this.name = name;
		};
		this.setMode = (mode: string) =>
		{
			this.mode = mode;
		};
		this.setClient = (client: Socket | null, profileId: string) =>
		{
			const obj: MemberSocketIdModel = {
				memberSocketId: "undefined",
				profileId: profileId,
			};
			if (client !== null)
				obj.memberSocketId = client.id;
			if (this.members === 1)
			{
				this.admins.push(obj);
				this.owner = obj;
				this.setId();
			}
			this.users.push(obj);
			if (client !== null)
			{
				this.sockets.push(client);
				// this.client = client;
			}
		};
		this.setPassword = (password: string) =>
		{
			// NEED TO HASH
			if (password !== undefined)
				this.password = password;
			else
				this.password = undefined;
		};
		this.setKind = (kind: string) =>
		{
			this.kind = kind;
		};

		this.isAdmin = (id: string) =>
		{
			for (const user of this.admins)
			{
				if (id === user.profileId)
					return (true);
			}
			return (false);
		};

		this.isOwner = (id: string) =>
		{
			if (id === this.owner.memberSocketId)
				return (true);
			return (false);
		};

		this.isBanned = (id: string) =>
		{
			for (const user of this.banned)
			{
				if (id === user.memberSocketId)
					return (true);
			}
			return (false);
		};

		this.isMember = (id: string) =>
		{
			const	profileId = this.chat?.getProfileIdFromSocketId(id);
			if (profileId === undefined || profileId === "undefined")
				return (false);
			for (const user of this.users)
			{
				if (user.memberSocketId === id)
					return (true);
				if (profileId === user.profileId)
					return (true);
			}
			return (false);
		};

		this.addAdmin = (id: string) =>
		{
			const obj: MemberSocketIdModel = {
				memberSocketId: id,
				profileId: this.chat?.getProfileIdFromSocketId(id) as string,
			};
			if (obj.profileId === undefined)
				throw new Error("this.addAdmin = (id: string) =>");
			this.admins.push(obj);
		};

		this.addToBanned = (id: string, profileId: string) =>
		{
			const newBanned: MemberSocketIdModel = {
				memberSocketId: id,
				profileId: profileId,
			};
			if (newBanned.profileId === undefined)
				throw new Error("this.addToBanned = (id: string, profileId: string) =>");
			this.banned.push(newBanned);
		};

		this.addNewMessage = (message: MessageModel) =>
		{
			this.messages.push(message);
		};

		this.leaveChannel = (client: Socket) =>
		{
			this.members--;
			const index = this.users.findIndex((element) =>
			{
				return (element.memberSocketId === client.id);
			});
			this.users.splice(index, 1);
		};

		this.findClientById = (socketId: string) =>
		{
			for (const client of this.sockets)
			{
				if (client.id === socketId)
					return (client);
			}
			return (undefined);
		};
	}
	public parseForDatabase()
	{
		const	dbObject = {
			admins: [...this.admins],
			banned: [...this.banned],
			kind: this.kind,
			members: this.members,
			messages: [...this.messages],
			mode: this.mode,
			name: this.name,
			owner: this.owner,
			password: this.password,
			users: [...this.users],
			id: this.id
		};
		// const retValue = JSON.stringify(dbObject);
		return (dbObject);
	}

	public	setFromDatabaseAdmins(admins :MemberSocketIdModel[])
	{
		this.admins = [...admins];
	}
}

export default Channel;
