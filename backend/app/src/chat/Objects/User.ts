/* eslint-disable max-len */
/* eslint-disable curly */
/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
import Chat from "./Chat";
import Channel from "./Channel";
import { Socket } from "socket.io";
import { type } from "os";

type	FriendsModel = {
	id: number,
	name: string,
	profileId: string
};

type	ProfileModel = {
	pseudo: string,
	lastName: string,
	firstName: string,
	avatar: string,
};

type	StatsModel = {
	rank: number,
	total: number,
	victories: number,
	perfect: number
};

type MemberSocketIdModel ={
	memberSocketId: string,
	profileId: string
};
class User
{
	public profileId: string;
    public name: string;
	public profile: ProfileModel;
	public stats: StatsModel;
    // socket id
	public id: string;
    public channels: Channel[] = [];
	public blocked: MemberSocketIdModel[] = [];
	public friends: FriendsModel[] = [];
	public chat: Chat | undefined;
	// this one must be initialisez when reconstructed or when reconnected with id 
	public client: Socket | null;
	public unlockChannel: (password: string, chanName: string) => void;
	public joinChannel: (chanName: string) => void;
	public leaveChannel: (chanName: string) => void;
	public createProfile: (pseudo: string, data: any) => void;
	public changePseudo: (pseudo: string) => void;
	public changeAvatar: (avatar: string) => void;
	public changeSocket: (client: Socket) => void;
	public isFriend: (socketId: string) => boolean;

    public constructor(name: string, client: Socket | null, profileId: string)
    {
        this.name = name;
		this.client = client;
		this.profileId = profileId;
		// console.log("")
		if (client === null)
		{
			// NEED TO SEE WHAT WE DO HERE
			this.id = "to_implement";
			this.client = null;
		}
		else
			this.id = client.id;
        this.chat = undefined;
		this.joinChannel = (chanName: string) =>
		{
			if (this.client === null)
				return ;
			if (this.chat && this.chat.server)
			{
				for (const channel of this.channels)
				{
					if (channel.name === chanName)
					{
						if (channel.mode === "private")
							console.log("This channel is private");
						else
						{
							this.client.join(chanName);
							this.chat.server.to(chanName).emit("Say hello to " + this.name + " !");
						}
					}
				}
			}
		};
		this.leaveChannel = (chanName: string) =>
		{
			if (this.client === null)
				return ;
			if (this.chat)
			{
				for (const channel of this.channels)
				{
					if (channel.name === chanName)
					{
						channel.members--;
						this.client.leave(chanName);
						if (channel.members === 0)
							this.chat.deleteChannel(chanName);
						break ;
					}
				}
			}
		};
        this.unlockChannel = (password: string, chanName: string) =>
        {
			if (this.client === null)
				return ;
            if (this.chat)
            {
                for (const channel of this.chat.channels)
                {
					if (channel.name === chanName)
					{
						if (channel.password === password && this.chat.server)
						{
							this.client.join(chanName);
							this.chat.server.to(chanName).emit("Say hello to " + this.name + " !");
						}
					}
                }
            }
        };
		this.changePseudo = (pseudo: string) =>
		{
			let	found;

			found = false;
			if (this.chat)
			{
				if (this.chat.users !== undefined)
				{
					for (const taken of this.chat.users)
					{
						if (taken.profile.pseudo === pseudo)
						{
							console.log("DEBUG Pseudo already taken");
							found = true;
						}
					}
					if (found === false)
						this.profile.pseudo = pseudo;
				}
			}
		};

		this.changeAvatar = (avatar: string) =>
		{
			this.profile.avatar = avatar;
		};

		this.changeSocket = (client: Socket) =>
		{
			this.client = client;
			this.id = client.id;
		};

		this.isFriend = (profileId: string) =>
		{
			let toReturn: boolean;
			toReturn = false;
			this.friends.forEach((friend) =>
			{
				if (friend.profileId === profileId)
					toReturn = true;
			});
			return (toReturn);
		};
    }

	public parseForDatabase()
	{
		const	channels: any[] = [];

		this.channels.forEach((channel) =>
		{
			const	data = channel.parseForDatabase();
			channels.push(data);
		});
		const	dbObject = {
			channels: channels,
			name: this.name,
			profile: this.profile,
			stats: this.stats,
			id: this.id,
			blocked: this.blocked,
			friends: this.friends,
			profileId: this.profileId,
		};
		// const	retValue = JSON.stringify(serializedObject);
		return (dbObject);
	}
}

export default User;
