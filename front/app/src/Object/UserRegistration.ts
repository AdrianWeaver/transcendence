/* eslint-disable max-statements */
import UserRegistrationChecker from "./UserRegistrationChecker";

class	UserRegistration
{
	private	data: FormData;
	public	firstName: string;
	public	lastName: string;
	public	emailAddress: string;
	public	password: string;
	public	passwordConfirm: string;
	public	uniquenessPassword: string;
	public	errorTable: UserRegistrationChecker;

	public	constructor(data: FormData)
	{
		this.data = data;
		this.firstName = this.form("firstName");
		this.lastName = this.form("lastName");
		this.emailAddress = this.form("email");
		this.password = this.form("password");
		this.passwordConfirm = this.form("passwordConfirm");
		this.uniquenessPassword = this.form("uniquePassword");
		this.errorTable = new UserRegistrationChecker();
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
			firstName: this.firstName,
			lastName: this.lastName,
			emailAddress: this.emailAddress,
			password: this.password,
			passwordConfirm: this.passwordConfirm,
			uniquenessPassword: this.uniquenessPassword
		});
	};
}

export default UserRegistration;
