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

    // eslint-disable-next-line max-params
    public constructor(
        name: string,
        client: Socket | null,
        mode: string,
        password: string,
        kind: string,
        profileId: string)
    {
        this.kind = kind;
        this.name = name;
        this.members = 0;
        this.mode = mode;
        this.chat = undefined;
        this.members++;

        // this has caused us a lot of trouble
        // if (client === null)
        //     return ;

        const memberSockId = client === null ? "undefined" : client.id;
        const obj: MemberSocketIdModel = {
            memberSocketId: memberSockId,
            profileId: profileId
        };
        if (this.members === 1)
        {
            this.admins.push(obj);
            this.owner = obj;
            // this.admins.push(client.id, -1);
        }
        this.users.push(obj);
        if (client !== null)
            this.sockets.push(client);
        this.mode = mode;
        if (password !== undefined)
            this.password = password;
        else
            this.password = undefined;

        this.isAdmin = (id: string) =>
        {
            for (const user of this.admins)
            {
                if (id === user.memberSocketId)
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
            for (const user of this.users)
            {
                if (user.memberSocketId === id)
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

            this.admins.push(obj);
        };

        this.addToBanned = (id: string, profileId: string) =>
        {
            const newBanned: MemberSocketIdModel = {
                memberSocketId: id,
                profileId: profileId,
            };
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
            admins: this.admins,
            banned: this.banned,
            // chat: this.chat,
            kind: this.kind,
            members: this.members,
            messages: this.messages,
            mode: this.mode,
            name: this.name,
            owner: this.owner,
            password: this.password,
            users: this.users,
        };
        const retValue = JSON.stringify(dbObject);
        return (retValue);
    }
}

export default Channel;
