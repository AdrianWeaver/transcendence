/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
import { BadRequestException, Injectable } from "@nestjs/common";
import
{
	AdminResponseModel,
	UserModel,
	UserRegisterResponseModel,
} from "./user.interface";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class UserService
{
	private user: Array<UserModel> = [];

	public	getUserArray(): AdminResponseModel
	{
		const	modifiedArray = this.user.map((elem) =>
		{
			return ({
				...elem,
				// TEST
				password: "[hidden information]"
			});
		});
		const	response = {
			numberOfClient: this.user.length,
			array: modifiedArray
		};
		return (response);
	}

	public	register(uuid: string)
		: {res: UserRegisterResponseModel, toDB: UserModel}
	{
		const	searchUser = this.user.find((user) =>
		{
			return (user.uuid === uuid);
		});
		if (searchUser === undefined)
		{
			const newUser: UserModel = {
				uuid: uuid,
				password: uuidv4(),
				token: "no token",
				lastConnection: "never connected",
				userCreatedAt: Date().toString(),
				revokeConnectionRequest: false
			};
			this.user.push(newUser);
			const	response: UserRegisterResponseModel = {
				message: "Your session has been created, you must loggin",
				uuid: newUser.uuid,
				password: newUser.password,
				creationDate: newUser.userCreatedAt,
				statusCode: 200
			};
			return (
			{
				res: response,
				toDB: newUser
			});
		}
		else
			throw new BadRequestException("UUID already exists");
	}
}
