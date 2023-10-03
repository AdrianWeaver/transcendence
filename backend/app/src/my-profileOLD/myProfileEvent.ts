/* eslint-disable max-len */
/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
import
{
	ConnectedSocket,
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { MyProfileService } from "./myProfile.service";

type	ActionSocket = {
	type: string,
	payload?: any
};


type	FriendsModel =
{
	id: number,
	name: string
}

@WebSocketGateway(
	{
		cors:
		{
			origin: "*"
		}
	}
)

export class MyProfileEvent
{
	@WebSocketServer()
	server: Server;

	public	constructor(private readonly myProfileService: MyProfileService)
	{
	}

	@SubscribeMessage("my-profile-info")
	handleMyProfile(
		@MessageBody() data: ActionSocket,
		@ConnectedSocket() client: Socket
	)
	{
		// if (data.type === "friends-list")
		// {
		// 	const user = this.myProfileService.searchUser(data.payload.userId);
		// 	if (user === undefined)
		// 		return ;
		// 	const	friendsList: FriendsModel[] = [];
		// 	for(const friend of user.friends)
		// 	{
		// 		const newFriend: FriendsModel = {
		// 			id: friendsList.length + 1,
		// 			name: friend.name,
		// 		};
		// 		friendsList.push(newFriend);
		// 	}
		// 	const	action = {
		// 		type: "display-friends",
		// 		payload: {
		// 			friendsList: friendsList,
		// 		}
		// 	};
		// 	client.emit("my-profile-info", action);
		// }

		// if (data.type === "change-pseudo")
		// {
		// 	const taken = this.myProfileService.isPseudoTaken(data.payload.pseudo);

		// 	const	action = {
		// 		type: "change-pseudo",
		// 		payload: taken
		// 	};
		// 	client.emit("change-pseudo", action);
		// }
	}
}
