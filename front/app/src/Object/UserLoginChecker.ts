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
		let	valid;

		valid = 0;
		if (data.username === undefined || data.username.length === 0)
			this.username = true;
		else
			valid++;
		if (data.password === undefined
			|| data.passwordConfirm === undefined
			|| data.password.length === 0
			|| data.passwordConfirm.length === 0
			|| data.password !== data.passwordConfirm)
			this.password = true;
		else
			valid++;
		if (valid === 2)
			this.checkIfUserExists();
	}

	public	checkIfUserExists()
	{
		//
	}
}

export default UserLoginChecker;
