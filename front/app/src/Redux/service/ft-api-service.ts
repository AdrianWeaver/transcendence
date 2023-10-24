/* eslint-disable max-params */
/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
import { AxiosRequestConfig } from "axios";
import Api from "../store/Api";
import { BackUserModel } from "../models/redux-models";

const	UserServices = {
	async	register(code: string, hostname: string)
	{
		// console.log("test");
		const	config: AxiosRequestConfig = {
			headers:
			{
				"Content-Type": "application/x-www-form-urlencoded"
			}
		};

		const	data = {
			code: code
		};
		return (
			Api(hostname)
			.post("/user/register", data, config)
			.then((data) =>
			{
				console.log("register front");
				console.log(data.data);
				return (data.data);
			})
			.catch((error) =>
			{
				console.error("error from api redux ");
				// console.error(error);
				return ("ERROR");
			})
		);
	},
	async	verifyToken(token: string, hostname: string)
	{
		console.log("verify token");
		const	config: AxiosRequestConfig = {
			headers:
			{
				"Content-Type": "application/x-www-form-urlencoded",
				"Authorization": token
			}
		};

		return (
			Api(hostname)
			.post("/user/verify-token", {}, config)
			.then((data) =>
			{
				console.log(data);
				return ("OKay");
			})
			.catch(() =>
			{
				console.error("error from verify token");
				return ("ERROR");
			})
		);
	},
	async	revokeToken(token: string, hostname: string)
	{
		console.log("Revoke token");
		const	config: AxiosRequestConfig = {
			headers:
			{
				"Content-Type": "application/x-www-form-urlencoded",
				"Authorization": token
			}
		};

		return (
			Api(hostname)
			.post("/user/revoke-token", {}, config)
			.then((data) =>
			{
				console.log(data);
				return ("OKay");
			})
			.catch((error) =>
			{
				console.error("error from verify token", error);
				return ("ERROR");
			})
		);
	},
	async	getAllTheUsers(hostname: string)
	{
		console.log("Get all users route");
		return (
			Api(hostname)
			.get("/user/get-all-users", {})
			.then((data) =>
			{
				console.log("get all users route ", data.data);
				return (data.data);
			})
			.catch((error) =>
			{
				console.error(error);
				return ("error");
			})
		);
	},
	async	getNumberForDoubleAuth
		(numero: string, token: string, hostname: string)
	{
		console.log("Double Auth front way");
		const	config: AxiosRequestConfig = {
			headers:
			{
				"Content-Type": "application/x-www-form-urlencoded",
				"Authorization": token
			}
		};
		const	data = {
			numero: numero
		};

		return (
			Api(hostname)
			.post("/user/double-auth", data, config)
			.then((data) =>
			{
				console.log("ft-api-service double auth :", data.data);
				return (data.data);
			})
			.catch((error) =>
			{
				console.log("ft-api-service double auth error", error);
				return ("error");
			})
		);
	},

	async	receiveValidationCodeFromTwilio
		(numero: string, token: string, hostname: string)
	{
		console.log("receive validation code");
		const	config: AxiosRequestConfig = {
			headers: {
				"content-type": "application/x-www-form-urlencoded",
				"Authorization": token,
			},
		};
		const	data = {
			numero: numero
		};

		return (
			Api(hostname)
			.post("/user/double-auth-twilio", data, config)
			.then((data) =>
			{
				console.log("ft-api-service double auth TWILIO ", data.data);
				return (data.data);
			})
			.catch((error) =>
			{
				console.log("ft-api-service double auth TWILIO error: ", error);
				return ("error");
			})
		);
	},

	async	getValidationCodeFromTwilio
	(numero: string, otpCode: string, token: string, hostname: string)
	{
		console.log("get validation code");
		const	config: AxiosRequestConfig = {
			headers: {
				"content-type": "application/x-www-form-urlencoded",
				"Authorization": token,
			},
		};

		const	data = {
			to: numero,
			otpCode: otpCode
		};

		return (
			Api(hostname)
			.post("/user/get-code", data, config)
			.then((data) =>
			{
				console.log("ft-api-service get code TWILIO ", data);
				return (data);
			})
			.catch((error) =>
			{
				console.log("ft-api-service get code error: ", error);
				return ("error");
			})
		);
	},
	async	registerInfosInBack
	(token: string, info: string, field: string, hostname: string)
	{
		console.log("register username in backend");
		const	config: AxiosRequestConfig = {
			headers: {
				"content-type": "application/x-www-form-urlencoded",
				"Authorization": token,
			},
		};

		const	data = {
			info: info,
			field: field
		};

		return (
			Api(hostname)
			.post("/user/change-infos", data, config)
			.then((data) =>
			{
				console.log("ft-api-service register infos in backend ", data);
				return ("okay");
			})
			.catch((error) =>
			{
				console.log("ft-api-service register infos in backend error: ", error);
				return ("error");
			})
		);
	},
	async	hashPassword(token: string, password: string, hostname: string)
	{
		console.log("Hash password");
		const	config: AxiosRequestConfig = {
			headers: {
				"content-type": "application/x-www-form-urlencoded",
				"Authorization": token,
			},
		};

		const	data = {
			password: password
		};
		return (
			Api(hostname)
			.post("user/hash-password", data, config)
			.then((data) =>
			{
				console.log(data);
				return (data.data);
			})
			.catch((error) =>
			{
				console.error(error);
				return ("ERROR");
			})
		);
	},
	async	decodePassword(token: string, password: string, id: any, email: string, hostname: string)
	{
		console.log("Decode password");
		const	config: AxiosRequestConfig = {
			headers: {
				"content-type": "application/x-www-form-urlencoded",
				"Authorization": token,
			},
		};

		const	data = {
			password: password,
			id: id,
			email: email
		};
		return (
			await Api(hostname)
			.post("user/decode-password", data, config)
			.then((data) =>
			{
				console.log(data);
				return (data.data);
			})
			.catch(() =>
			{
				return ("error");
			})
		);
	},
	async	addUserAsFriend(token: string, friendId: string, hostname: string)
	{
		console.log("Add User as friend");
		const	config: AxiosRequestConfig = {
			headers: {
				"content-type": "application/x-www-form-urlencoded",
				"Authorization": token,
			},
		};

		const	data = {
			friendId: friendId
		};
		return (
			Api(hostname)
			.post("user/add-friend", data, config)
			.then((data) =>
			{
				console.log(data);
				return ("OK");
			})
			.catch((error) =>
			{
				console.error(error);
				return ("ERROR");
			})
		);
	},
};

export default UserServices;
