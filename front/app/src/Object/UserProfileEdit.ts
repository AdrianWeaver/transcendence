/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
import { UserModel } from "../Redux/models/redux-models";
import UserProfileEditChecker from "./UserProfileEditChecker";

class	UserProfileEdit
{
	private	data: FormData;
	public	errorTable: UserProfileEditChecker;
	public	username: string;
	public	phoneNumber: string;
	public	doubleAuth: boolean;
	public	user: UserModel;

	public	constructor(data: FormData, doubleAuth: boolean, user: UserModel)
	{
		this.data = data;
		this.username = this.form("username");
		if (this.username.length === 0)
			this.username = user.username;
		this.errorTable = new UserProfileEditChecker();
		if (doubleAuth)
			if ((this.form("phoneNumber") === null
				|| this.form("phoneNumber").length === 0
				||this.form("phoneNumber") === undefined)
				&& user.phoneNumber !== undefined)
				this.phoneNumber = user.phoneNumber;
			else
				this.phoneNumber = this.form("phoneNumber");
		else
			this.phoneNumber = "undefined";
		this.doubleAuth = doubleAuth;
		this.user = user;
	}

	public	check = () =>
	{
		this.errorTable.checkData(this);
	};

	public	form = (field: string) =>
	{
		return (this.data.get(field) as string);
	};

	public	getPlainObject = () =>
	{
		return (
		{
			username: this.username,
			phoneNumber: this.phoneNumber,
			doubleAuth: this.doubleAuth
		});
	};
}

export default UserProfileEdit;
