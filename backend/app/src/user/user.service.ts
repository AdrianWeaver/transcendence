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
import User from "src/chat/Objects/User";

@Injectable()
export class UserService
{
	private user: Array<UserModel> = [];

	public	getUserArray(): Array<UserModel>
	{
		return (this.user);
	}

	public	getAdminArray(): AdminResponseModel
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

	public	register(data: UserModel)
		: {res: UserRegisterResponseModel, toDB: UserModel}
	{
		const	searchUser = this.user.find((user) =>
		{
			return (user.uuid === data.uuid);
		});
		if (searchUser === undefined)
		{
			const newUser: UserModel = {
				ftApi: data.ftApi,
				// ftApi: {
				// 	accessToken: data.ft_api.accessToken,
				// 	tokenType: data.ft_api.tokenType,
				// 	expiresIn: data.ft_api.expiresIn,
				// 	refreshToken: data.ft_api.refreshToken,
				// 	scope: data.ft_api.scope,
				// 	createdAt: data.ft_api.createdAt,
				// 	secretValidUntil: data.ft_api.secretValidUntil
				// },
				retStatus: data.retStatus,
				date: data.date,
				id: data.id,
				email: data.email,
				login: data.login,
				firstName: data.firstName,
				lastName: data.lastName,
				url: data.url,
				avatar: data.avatar,
				location: data.location,
				uuid: data.uuid,
				// TEST anonymous user pw
				password: data.password,
				createdAt: data.createdAt
			};
			this.user.push(newUser);
			const	response: UserRegisterResponseModel = {
				message: "Your session has been created, you must loggin",
				uuid: newUser.uuid,
				password: newUser.password,
				creationDate: newUser.createdAt,
				statusCode: newUser.retStatus
			};
			console.log("user service newUser 78: ", newUser);
			console.log(" ");
			console.log("user service response 79: ", response);
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
