/* eslint-disable curly */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-depth */
// import { Public } from "@mui/icons-material";
import UserSecurity from "./UserSecurity";
/* eslint-disable max-statements */


class	UserSecurityChecker
{
	public	phoneNumber: boolean;

	constructor()
	{
		this.phoneNumber = false;
	}

	public checkNumber(data: UserSecurity)
	{
		this.resetError();
		if (data.doubleAuth)
		{
			let	tmp;
			tmp = data.phoneNumber;
			if (data.phoneNumber === undefined || data.phoneNumber === null
					|| data.phoneNumber.length === 0
					|| data.phoneNumber === "undefined")
				this.phoneNumber = true;
			else
			{
				if (data.phoneNumber?.length < 9
						|| data.phoneNumber?.length > 15)
					this.phoneNumber = true;
				if (data.phoneNumber[0] !== "+")
				{
					tmp = tmp.slice(0, 1);
					this.phoneNumber = true;
				}
			}
		}
	}

	public	resetError = () =>
	{
		this.phoneNumber = false;
	};

	public	getPhoneNumberCheck = () =>
	{
		return (this.phoneNumber);
	};
}

export default UserSecurityChecker;
