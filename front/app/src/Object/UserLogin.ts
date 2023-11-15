/* eslint-disable max-statements */
// import { ChatUserModel } from "../Redux/models/redux-models";
import UserLoginChecker from "./UserLoginChecker";

class	UserLogin
{
	public	data: FormData;
	public	checker: UserLoginChecker;
	public	username: string;
	public	password: string;
	// public	users: ;

	constructor(data: FormData)
	{
		this.data = data;
		this.username = this.form("username");
		this.password = this.form("password");
		this.checker = new UserLoginChecker();
		// this.users = users;
	}

	public	form(field: string)
	{
		return (this.data.get(field) as string);
	}

	public	check()
	{
		this.checker.checkData(this);
	}

	public	getPlainObject()
	{
		return (this);
	}

}

export default UserLogin;
