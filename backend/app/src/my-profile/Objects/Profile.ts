/* eslint-disable curly */
import { Server } from "socket.io";
import Channel from "src/chat/Objects/Channel";
import Message from "src/chat/Objects/Message";
import User from "src/chat/Objects/User";

type FriendsMapModel = {
    id: number,
    name: string,
	blocked: boolean
};

type ChanMapModel = {
    id: number,
    name: string,
    mode: string
};

class Profile
{
    public channels: Channel [] = [];
    public privateMessage: Channel[] = [];
    public chanMap: Array<ChanMapModel> = [];
    public privateMessageMap: Array<ChanMapModel> = [];
    public friends: User[] = [];
    public users: string[] = [];
    public friendsMap: Array<FriendsMapModel> = [];
    public server: Server | undefined;
    public friendsSocketIds: string[] = [];
    public deleteFriend: (name: string) => void;
    public addFriend: (name: string, id: string) => void;

    public constructor ()
    {
        this.server = undefined;
        this.deleteFriend = (name: string) =>
        {
            for (const friend of this.friends)
            {
                if (friend.name === name)
                {
                    const friendIndex = this.friends.findIndex((element) =>
                    {
                        return (element === friend);
                    });
                    this.friends.splice(friendIndex, 1);
                }
            }
        };
        // this.addFriend = (name: string, id: string) =>
        // {
        //     // const   newFriend = this.myProfileService.
        // };
    }
}

export default Profile;
