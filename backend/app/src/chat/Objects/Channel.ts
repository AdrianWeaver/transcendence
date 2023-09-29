/* eslint-disable curly */
/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-len */
import Chat from "./Chat";
import User from "./User";
import { Server, Socket } from "socket.io";

type MessageModel =
{
	sender: string,
	message: string,
	id: number
}

class Channel
{
    public kind: string;
    public owner: string;
    public admin: string | undefined;
    public admins: string[] = [];
    public banned: string[] = [];
    public name: string;
    public users: string[] = [];
    public mode: string;
    public members: number;
    public chat: Chat | undefined;
    public password: string | undefined;
    public messages: MessageModel[] = [];
    public isMember: (id: string) => boolean;
    public isOwner: (id: string) => boolean;
    public isAdmin: (id: string) => boolean;
    public isBanned: (id: string) => boolean;
    public addAdmin: (id: string) => void;
    public addToBanned: (id: string) => void;
    public addNewMessage: (message: MessageModel) => void;
    public leaveChannel: (client: Socket) => void;

    public constructor(name: string, client: Socket, mode: string, password: string, kind: string)
    {
        this.kind = kind;
        this.name = name;
        this.members = 0;
        this.mode = mode;
        this.chat = undefined;
        this.members++;
        this.owner = client.id;
        if (this.members === 1)
            this.admins.push(client.id);
        this.users.push(client.id);
        this.mode = mode;
        if (password !== undefined)
            this.password = password;
        else
            this.password = undefined;

        this.isAdmin = (id: string) =>
        {
            for (const user of this.admins)
            {
                if (id === user)
                    return (true);
            }
            return (false);
        };

        this.isOwner = (id: string) =>
        {
            if (id === this.owner)
                return (true);
            return (false);
        };

        this.isBanned = (id: string) =>
        {
            for (const user of this.banned)
            {
                if (id === user)
                    return (true);
            }
            return (false);
        };

        this.isMember = (id: string) =>
        {
            for (const user of this.users)
            {
                if (user === id)
                    return (true);
            }
            return (false);
        };

        this.addAdmin = (id: string) =>
        {
            this.admins.push(id);
        };

        this.addToBanned = (id: string) =>
        {
            this.banned.push(id);
        };

        this.addNewMessage = (message: MessageModel) =>
        {
            this.messages.push(message);
        };

        this.leaveChannel = (client: Socket) =>
        {
            client.leave(this.name);
            this.members--;
            const index = this.users.findIndex((element) =>
            {
                return (element === client.id);
            });
            this.users.splice(index, 1);
        };
    }
}

export default Channel;
