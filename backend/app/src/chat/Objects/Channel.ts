/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-len */
import Chat from "./Chat";
import User from "./User";
import { Server, Socket } from "socket.io";

class Channel
{
    public admin: string | undefined;
    public admins: string[] = [];
    public blocked: string[] = [];
    public name: string;
    public users: string[] = [];
    public mode: string;
    public members: number;
    public chat: Chat | undefined;
    public password: string | undefined;

    public isAdmin: (id: string) => boolean;
    public addAdmin: (id: string) => void;
    public addToBlocked: (id: string) => void;

    public constructor(name: string, client: Socket, mode: string, password: string)
    {
        this.name = name;
        this.members = 0;
        this.mode = mode;
        this.chat = undefined;
        this.members++;
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

                if (client.id === user)
                    return (true);

            return (false);
        };
        this.addAdmin = (id: string) =>
        {
            this.admins.push(client.id);
        };
        this.addToBlocked = (id: string) =>
        {
            this.blocked.push(client.id);
        };
    }
}

export default Channel;
