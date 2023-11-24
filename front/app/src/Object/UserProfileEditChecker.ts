/* eslint-disable max-lines-per-function */
// import { Public } from "@mui/icons-material";
import UserProfileEdit from "./UserProfileEdit";
/* eslint-disable max-statements */


class	UserProfileEditChecker
{
	public	uniqueness: boolean;
	public	username: boolean;
	public	phoneNumber: boolean;

	constructor()
	{
		this.uniqueness = false;
		this.username = false;
		this.phoneNumber = false;
	}

	public checkData(data: UserProfileEdit)
	{
		this.resetError();
		if (data.username === undefined || data.username === "undefined"
			|| data.username.length === 0 )
			this.username = true;
		const	validChar = /^[A-Za-z][A-Za-z0-9_]{3,8}$/;
		this.username = !(validChar.test(data.username));
		if (data.doubleAuth)
		{
			let	tmp;

			tmp = data.phoneNumber;
			if (data.phoneNumber === undefined || data.phoneNumber === null
					|| data.phoneNumber === "undefined")
					this.phoneNumber = true;
			if (data.phoneNumber[0] === "0" || data.phoneNumber[0] !== "+")
				this.phoneNumber = true;
			if (data.phoneNumber?.length < 10 || data.phoneNumber?.length > 15)
				this.phoneNumber = true;
			if (tmp[0] === "+")
				tmp = tmp.slice(1, tmp.length);
			if (isNaN(Number(tmp)))
				this.phoneNumber = true;
		}
		else
			this.phoneNumber = false;
	}

	public	resetError = () =>
	{
		this.uniqueness = false;
		this.username = false;
		this.phoneNumber = false;
	};

	public	getPlainObject = () =>
	{
		return ({
			uniqueness: this.uniqueness,
			username: this.username,
			phoneNumer: this.phoneNumber,
		});
	};
}

export default UserProfileEditChecker;
