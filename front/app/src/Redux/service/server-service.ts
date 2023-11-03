/* eslint-disable max-lines-per-function */
import { AxiosRequestConfig } from "axios";
import Api from "../store/Api";
import
{
	AnonymousUserLoginResponseModel,
	AnonymousUserRegisterResponseModel
}	from "../models/redux-models";

const	ServerService = {
	async getConnection(serverLocation: string)
	{
		return (
			Api(serverLocation)
				.get("/server-status")
				.then((res) =>
				{
					return (
					{
						...res.data,
						success: true
					});
				})
				.catch((error) =>
				{
					return (
					{
						success: false,
						errorMessage: "Server not available",
						fullError: {...error}
					});
				})
		);
	},
	async	register(uuid: string, serverLocation: string)
	{
		const	config:AxiosRequestConfig = {
			headers:
			{
				"Content-Type": "application/x-www-form-urlencoded"
			}
		};

		const	data = {uuid: uuid};

		// TEST : 
		// 	* already used uuidd
		// 	* nothing in data
		// 	* see postman doc example for error handling
		// const	dataTestFailure = {
		// 	uuid: "9c787e15-59f5-454d-a56f-99cd99333873"
		// };

		return (
			Api(serverLocation)
				.post("/anonymous-user/register", data, config)
				.then((res) =>
				{
					return (res.data);
				})
				.then((data) =>
				{
					if (data.statusCode, data.statusCode === 200)
					{
						const response: AnonymousUserRegisterResponseModel = {
							statusCode: data.statusCode,
							message: data.message,
							password: data.password,
							creationDate: data.creationDate,
							uuid: data.uuid
						};
						return (response);
					}
					// 401 : not implemented yet
					return ({statusCode: 501});
				})
				.catch((error) =>
				{
					// To do : implement errors 
					console.log(error);
					return ({statusCode: 501});
				})
		);
	},
	async	loginAnonymousUser(
		uuid: string,
		password: string,
		serverLocation: string)
	{
		const	config:AxiosRequestConfig = {
			headers:
			{
				"Content-Type": "application/x-www-form-urlencoded"
			}
		};

		const	data = {
			uuid: uuid,
			password: password
		};
		return (
			Api(serverLocation)
				.post("/anonymous-user/login", data, config)
				.then((res) =>
				{
					return (res.data);
				})
				.then((data) =>
				{
					console.log("Login data", data);
					const response : AnonymousUserLoginResponseModel
						= {
							statusCode: 200,
							expireAt: data.expireAt,
							message: data.message,
							token: data.token
						};
					console.log("data login: ", data);
					return (response);
				})
				.catch((error) =>
				{
					console.error("login anonymous error");
					return ({statusCode: 501});
				})
		);
	},
	async	verifyTokenAnonymousUser(token: string, serverLocation: string)
	{
		const	config:AxiosRequestConfig = {
			headers:
			{
				"Content-Type": "application/x-www-form-urlencoded",
				"Authorization": token
			}
		};
		console.log("the token -->", token);
		return (
			Api(serverLocation)
				.post("anonymous-user/verify-token", {}, config)
				.then((res) =>
				{
					return (res.data);
				})
				.then((data) =>
				{
					// console.log(data);
					return ("SUCCESS");
				})
				.catch((error) =>
				{
					console.log(error);
					return ("ERROR");
				})
		);
	}
};

export default ServerService;
