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

import { randomBytes } from "crypto";
import	* as jwt from "jsonwebtoken";

@Injectable()
export class UserService
{
	private user: Array<UserModel> = [];
	private	secret = randomBytes(64).toString("hex");

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
				createdAt: data.createdAt,
				authService:
				{
					token: "Bearer " + jwt.sign(
						{
							id: data.id,
							mail: data.email
						},
						this.secret,
						{
							expiresIn: "1d"
						}
					),
					expAt: Date.now() + (1000 * 60 * 60 * 24),
					doubleAuth:
					{
						lastIpClient: "undefined",
						phoneNumber: "undefined",
						phoneRegistered: false,
						validationCode: "undefined",
						valid: false,
					}
				}
			};
			this.user.push(newUser);
			const	response: UserRegisterResponseModel = {
				message: "Your session has been created, you must loggin",
				token: newUser.authService.token,
				statusCode: newUser.retStatus
				// uuid: newUser.uuid,
				// password: newUser.password,
				// creationDate: newUser.createdAt,
				// statusCode: newUser.retStatus
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
