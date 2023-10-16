/* eslint-disable max-depth */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
/* eslint-disable curly */

import { UseMediaQueryOptions } from "@mui/material";
import UserSecurityChecker from "./UserSecurityChecker";
import { UserModel } from "../Redux/models/redux-models";

/* eslint-disable max-len */
class	UserSecurity
{
	private	data: FormData;
	public	phoneNumber: string;
	public	doubleAuth: boolean;
	public	checker: UserSecurityChecker;
	public	valid: boolean;

	public	constructor(data: FormData, user: UserModel)
	{
		this.data = data;
		this.doubleAuth = user.doubleAuth;
		this.phoneNumber = this.form("phoneNumber");
		if (this.phoneNumber === undefined)
			this.phoneNumber = "undefined";
		this.checker = new UserSecurityChecker();
		this.valid = false;
	}

	public	check = () =>
	{
		this.checker.checkNumber(this);
	};

	public	form = (field: string) =>
	{
		return (this.data.get(field) as any);
	};

	public	getPlainObject = () =>
	{
		return (
		{
			phoneNumber: this.phoneNumber,
			doubleAuth: this.doubleAuth,
			valid: this.valid
		});
	};
}

export default UserSecurity;
