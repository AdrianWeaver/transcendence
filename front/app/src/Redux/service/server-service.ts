/* eslint-disable max-params */
/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */
import { AxiosRequestConfig } from "axios";
import Api from "../store/Api";
import
{
	AnonymousUserLoginResponseModel,
	AnonymousUserRegisterResponseModel,
	GameServeStatus
}	from "../models/redux-models";
import Game from "../../Views/TestBall/Objects/Game";

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
	async	getAuthApiLinks(serverLocation: string)
	{
		return (
			Api(serverLocation)
				.get("/autLink")
				.then((res) =>
				{
					return ({
						...res.data,
						success: true,
					});
				})
				.catch((error: any) =>
				{
					return ({
						success: false,
						error: error,
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
					return ({
						statusCode: 501,
						error: error});
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
					console.log(data);
					return ("SUCCESS");
				})
				.catch((error) =>
				{
					console.log(error);
					return ("ERROR");
				})
		);
	},
	async	getMyActiveGame(token: string, serverLocation: string)
	{
		const	config: AxiosRequestConfig = {
			headers:
			{
				"Authorization": token
			}
		};
		return	(
			Api(serverLocation)
				.post("api/game/instance/myActiveGame", {}, config)
				.then((res) =>
				{
					return ({
						...res.data,
						success: true
					});
				})
				.catch((error: any) =>
				{
					return ({
						success: false,
						error: error});
				})
		);
	},
	async	revokeGameWithUuid(
		token: string,
		serverLocation: string,
		uuid: string
	)
	{
		const	config: AxiosRequestConfig = {
			headers:
			{
				"Content-Type": "application/x-www-form-urlencoded",
				"Authorization": token
			}
		};
		const data = {
			uuid: uuid
		};
		return (
			Api(serverLocation)
				.post("/api/game/instance/revokeGame", data, config)
				.then((res) =>
				{
					return (
						{
							...res.data,
							success: true
						}
					);
				})
				.catch((error) =>
				{
					return ({
						success: false,
						error: error});
				})
		);
  },
	async	getMyStats(token: string, serverLocation: string)
	{
		const	config:AxiosRequestConfig = {
			headers:
			{
				"Content-Type": "application/x-www-form-urlencoded",
				"Authorization": token
			}
		};
		return (
			Api(serverLocation)
				.post("/user/my-stats", {}, config)
				.then((res) =>
				{
					return (res.data);
				})
				.then((data) =>
				{
					return (
						{
							success: true,
							data: data
						}
					);
				})
				.catch((error) =>
				{
					console.log(error);
					return ({
						success: false,
						data: undefined
					});
				})
		);
	},
	async	getStats(token: string, userProfileId: string,
		userAvatar: string, serverLocation: string)
	{
		const	config:AxiosRequestConfig = {
			headers:
			{
				"Content-Type": "application/x-www-form-urlencoded",
				"Authorization": token
			}
		};
		const	data = {
			userProfileId: userProfileId,
			userAvatar: userAvatar,
		};
		return (
			Api(serverLocation)
				.post("/user/stats", data, config)
				.then((res) =>
				{
					return (res.data);
				})
				.then((data) =>
				{
					console.log("DATA", data.data);
					return (
						{
							success: true,
							data: data
						}
					);
				})
				.catch((error) =>
				{
					console.log(error);
					return ({
						success: false,
						data: undefined
					});
				})
		);
	},
	async	getAllStats(token: string, serverLocation: string)
	{
		const	config:AxiosRequestConfig = {
			headers:
			{
				"Content-Type": "application/x-www-form-urlencoded",
				"Authorization": token
			}
		};
		return (
			Api(serverLocation)
				.post("/user/global-stats", {}, config)
				.then((res) =>
				{
					return (res.data);
				})
				.then((data) =>
				{
					console.log("DATA", data.data);
					return (
						{
							success: true,
							data: data
						}
					);
				})
				.catch((error) =>
				{
					console.log(error);
					return ({
						success: false,
						data: undefined
					});
				})
		);
	}
};

export default ServerService;
