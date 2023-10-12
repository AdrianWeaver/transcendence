/* eslint-disable max-statements */
import { ChatUserModel } from "../Redux/models/redux-models";
import UserLogin from "./UserLogin";

class UserLoginChecker
{
	public	username: boolean;
	public	password: boolean;
	public	user: boolean;
	public	notValid: boolean;

	constructor()
	{
		this.username = false;
		this.password = false;
		this.user = false;
		this.notValid = false;
	}

	public	checkData(data: UserLogin)
	{
		if (data.username === undefined || data.username.length === 0)
			this.username = true;
		if (data.password === undefined
			|| data.password.length === 0)
			this.password = true;
		// if (!(this.password === true && this.username === true))
		// {
		// 	const	searchUser = data.users.find((elem) =>
		// 	{
		// 		return (data.username === elem.name);
		// 	});

		// 	if (searchUser !== undefined)
		// 	{
		// 		if (data.password !== searchUser.password)
		// 			this.notValid = true;
		// 	}
		// 	else
		// 		this.notValid = true;
		// }
	}

	public getPlainObject()
	{
		return (this);
	}
}

export default UserLoginChecker;
