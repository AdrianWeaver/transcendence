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
	name: string
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
class User
{
    public name: string;
	public profile: ProfileModel;
	public stats: StatsModel;
	public client: Socket;
    public id: string;
    public chat: Chat | undefined;
    public channels: Channel[] = [];
	public blocked: string[] = [];
	public friends: FriendsModel[] = [];
	public unlockChannel: (password: string, chanName: string) => void;
	public joinChannel: (chanName: string) => void;
	public leaveChannel: (chanName: string) => void;
	public createProfile: (pseudo: string, data: any) => void;
	public changePseudo: (pseudo: string) => void;

    public constructor(name: string, client: Socket)
    {
        this.name = name;
		this.client = client;
        this.id = client.id;
        this.chat = undefined;

		this.joinChannel = (chanName: string) =>
		{
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
			if (this.chat)
			{
				for (const channel of this.channels)
				{
					if (channel.name === chanName)
					{
						channel.members--;
						client.leave(chanName);
						if (channel.members === 0)
							this.chat.deleteChannel(chanName);
						break ;
					}
				}
			}
		};
        this.unlockChannel = (password: string, chanName: string) =>
        {
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
		// this.createProfile = (pseudo: string, data: any) =>
		// {
		// 	if (pseudo.length > 0 && data !== undefined)
		// 		this.profile?.fillProfile(pseudo, data);
		// };
    }
}

export default User;
