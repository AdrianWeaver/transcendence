// /* eslint-disable max-lines-per-function */
// /* eslint-disable max-len */
// /* eslint-disable max-statements */
// /* eslint-disable curly */
// import { IoAdapter } from "@nestjs/platform-socket.io";
// import { Server } from "socket.io";
// import Channel from "src/chat/Objects/Channel";
// import Message from "src/chat/Objects/Message";
// import User from "src/chat/Objects/User";
// import { io } from "socket.io-client";

// type FriendsMapModel = {
//     id: number,
//     name: string,
// 	blocked: boolean
// };

// type ChanMapModel = {
//     id: number,
//     name: string,
//     mode: string
// };

// class Profile
// {
// 	public userRef: User;
//     public pseudo: string;
//     public login: string;
//     public ft: boolean;
//     public lastName: string;
//     public firstName: string;
//     public id: string;
//     public avatar: string;
//     public email: string;
//     public allUsers: User[] = [];
//     public users: string[] = [];
//     public server: Server | undefined;
//     public friendsSocketIds: string[] = [];
//     public deleteFriend: (name: string) => void;
//     public addFriend: (userId: string) => void;
// 	public fillProfile: (pseudo: string, data: any) => void;
//     public constructor (user: User)
//     {
// 		this.userRef = user;
//         this.pseudo = "";
//         this.login = "ehickey";
//         this.ft = true;
//         this.lastName = "Hickey";
//         this.firstName = "Earl";
//         this.id = "";
//         this.avatar = "https://pbs.twimg.com/profile_images/956695054126665728/0zl_Ejq2_400x400.jpg";
//         this.server = undefined;
//         this.deleteFriend = (name: string) =>
//         {
// 			for (const friend of this.userRef?.friends)
// 			{
// 				if (friend.name === name)
// 				{
// 					const friendIndex = this.userRef.friends.findIndex((element) =>
// 					{
// 						return (element === friend);
// 					});
// 					this.userRef.friends.splice(friendIndex, 1);
// 				}
// 			}
//         };
//         this.addFriend = (userId: string) =>
//         {
// 			let	found;

// 			found = false;
// 			const	user = this.allUsers.find((elem) =>
// 			{
// 				return (elem.id === userId);
// 			});
// 			if (user === undefined)
// 			{
// 				this.server?.emit("The user does not exist");
// 				return ;
// 			}
//             for (const friend of this.friends)
//             {
//                 if (friend.id === userId)
//                 {
// 					found = true;
//                     this.server?.emit("You can't be more friends than you already are");
//                 }
//             }
// 			if (found === false)
// 			{
// 				this.friends.push(user);
// 				this.server?.emit("Congrats, you're friends");
// 			}
//         };
// 		this.fillProfile = (pseudo: string, data: any) =>
// 		{
// 			let	found;
// 			found = false;
// 			if (this.allUsers !== undefined)
// 			{
// 				for (const taken of this.allUsers)
// 				{
// 					if (taken.profile?.pseudo === pseudo)
// 					{
// 						console.log("DEBUG Pseudo already taken");
// 						found = true;
// 					}
// 				}
// 				if (found === false)
// 				{
// 					this.pseudo = pseudo;
// 					this.login = data.login;
// 					this.lastName = data.lastName;
// 					this.id = data.id;
// 					this.avatar = data.avatar;
// 					this.email = data.email;
// 				}
// 			}
// 		};
//     }
// }

// export default Profile;
