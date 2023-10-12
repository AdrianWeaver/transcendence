/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
import { UserModel } from "../Redux/models/redux-models";
import UserProfileEditChecker from "./UserProfileEditChecker";

class	UserProfileEdit
{
	private	data: FormData;
	public	emailAddress: string;
	public	password: string;
	public	passwordConfirm: string;
	public	uniquenessPassword: string;
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
		this.emailAddress = this.form("email");
		if (this.emailAddress.length === 0)
			this.emailAddress = user.email;
		this.password = this.form("password");
		if (this.password.length === 0)
			this.password = user.password;
		this.passwordConfirm = this.form("passwordConfirm");
		if (this.passwordConfirm.length === 0)
			this.passwordConfirm = user.password;
		this.uniquenessPassword = this.form("uniquePassword");
		this.errorTable = new UserProfileEditChecker();
		if (doubleAuth)
			if (this.form("phoneNumber").length === 0
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
			emailAddress: this.emailAddress,
			password: this.password,
			passwordConfirm: this.passwordConfirm,
			uniquenessPassword: this.uniquenessPassword,
			phoneNumber: this.phoneNumber,
			doubleAuth: this.doubleAuth
		});
	};
}

export default UserProfileEdit;
