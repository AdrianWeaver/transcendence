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

	public	constructor(data: FormData, user: UserModel)
	{
		this.data = data;
		this.phoneNumber = this.form("phoneNumber");
		this.doubleAuth = user.doubleAuth;
		this.checker = new UserSecurityChecker();
		console.log("dhdhdh ", this.phoneNumber);
	}

	public	check = () =>
	{
		this.checker.checkNumber(this);
	};

	public	form = (field: string) =>
	{
		return (this.data.get(field) as string);
	};

	public	getPlainObject = () =>
	{
		return (
		{
			phoneNumber: this.phoneNumber,
			doubleAuth: this.doubleAuth,
		});
	};
}

export default UserSecurity;
