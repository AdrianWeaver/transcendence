/* eslint-disable max-statements */
import UserLogin from "./UserLogin";

class UserLoginChecker
{
	public	username: boolean;
	public	password: boolean;

	constructor()
	{
		this.username = false;
		this.password = false;
	}

	public	checkData(data: UserLogin)
	{
		if (data.username === undefined || data.username.length === 0)
			this.username = true;
		if (data.password === undefined
			|| data.passwordConfirm === undefined
			|| data.password.length === 0
			|| data.passwordConfirm.length === 0
			|| data.password !== data.passwordConfirm)
			this.password = true;
	}

	public getPlainObject()
	{
		return (this);
	}
}

export default UserLoginChecker;
