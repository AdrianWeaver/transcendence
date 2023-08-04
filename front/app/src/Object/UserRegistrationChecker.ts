import UserRegistration from "./UserRegistration";
/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */

class	UserRegistrationChecker
{
	public	firstName: boolean;
	public	lastName: boolean;
	public	email: boolean;
	public	password: boolean;
	public	uniqueness: boolean;

	constructor()
	{
		this.firstName = false;
		this.lastName = false;
		this.email = false;
		this.password = false;
		this.uniqueness = false;
	}

	public checkData(data: UserRegistration)
	{
		this.resetError();
		if (data.firstName === undefined
			|| data.firstName.length === 0)
			this.firstName = true;
		if (data.lastName === undefined
			|| data.lastName.length === 0)
			this.lastName = true;
		if (data.emailAddress === undefined
			|| data.emailAddress.length === 0)
			this.email = true;
		if (data.password === undefined
			|| data.passwordConfirm === undefined
			|| data.password.length === 0
			|| data.passwordConfirm.length === 0
			|| data.password !== data.passwordConfirm)
			this.password = true;
		if (data.uniquenessPassword !== "AgreeWithUniquenessOfPassword")
			this.uniqueness = true;
		const	emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
		this.email = !(emailRegex.test(data.emailAddress));
	}

	public	resetError = () =>
	{
		this.firstName = false;
		this.lastName = false;
		this.email = false;
		this.password = false;
		this.uniqueness = false;
	};

	public	getPlainObject = () =>
	{
		return ({
			firstName: this.firstName,
			lastName: this.lastName,
			email: this.email,
			password: this.password,
			uniqueness: this.uniqueness,
		});
	};
}

export default UserRegistrationChecker;
