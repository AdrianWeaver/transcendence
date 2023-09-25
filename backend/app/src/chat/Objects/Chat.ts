/* eslint-disable curly */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-len */
import Channel from "./Channel";
import Message from "./Message";
import User from "./User";
import { Server, Socket } from "socket.io";

class Chat
{
    public channels: Channel[] = [];
    public chanMap: {id: number, name: string};
    public users: User[] = [];
    public server: Server | undefined;
    public activeMembers: number;
    public memberSocketIds: string[] = [];
    public message: Message[];
    public createAndJoin: (name: string, client: Socket, mode: string, pass: string) => void;
    public deleteChannel: (name: string) => void;
    public addUserToChannel: (name: string, id: string) => void;
    public displayMessage: (message: Message) => void;

    public constructor ()
    {
        this.server = undefined;
        this.createAndJoin = (name: string, client: Socket, mode: string, pass: string) =>
        {
            const newChan = new Channel(name, client, mode, pass);
            if (this.server)
            {
                client.join(newChan.name);
                this.server.to(newChan.name).emit("chan-message", "Welcome to your brand new chat");
            }
        };

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
