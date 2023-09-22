import Channel from "./Channel";
import User from "./User";
import { Server, Socket } from "socket.io";

class Chat
{
    public channels: Channel[] = [];
    public users: User[] = [];
    public server: Server | undefined;
    public activeMembers: number;
    public memberSocketIds: string[] = [];
    public createAndJoin: (name: string, client: Socket, mode: string, password: string);
    public deleteChannel: (name: string);
    public addUserToChannel: (name: string, id: string);

    public constructor ()
    {
        this.server = undefined;
        this.createAndJoin = (name: string, client: Socket, mode: string, password: string) =>
        {
            const newChan = new Channel(name, client, mode, password);
            if (this.server)
            {
                client.join(newChan.name);
                this.server.to(newChan.name).emit("chan-message", "Welcome to your brand new chat");
            }
        }

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
        }
    }
};

export default Chat;