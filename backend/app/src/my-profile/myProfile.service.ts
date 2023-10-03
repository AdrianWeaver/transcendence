/* eslint-disable max-len */
import { Injectable } from "@nestjs/common";
import Profile from "./Objects/Profile";

@Injectable()
export class myProfileService
{
	private	profile: Profile;

	public	searchUser(clientId: string)
	{
		const searchUser = this.profile.friends.find((element) =>
		{
			return (element.id === clientId);
		});
		return (searchUser);
	}

	public	searchUserIndex(clientId: string)
	{
		const	userIndex = this.profile.friends.findIndex((element) =>
		{
			return (element.id === clientId);
		});
		return (userIndex);
	}

	public	searchSocketIndex(clientId: string)
	{
		const	searchSocket = this.profile.friendsSocketIds.findIndex((element) =>
		{
			return (element === clientId);
		});
		return (searchSocket);
	}

}
