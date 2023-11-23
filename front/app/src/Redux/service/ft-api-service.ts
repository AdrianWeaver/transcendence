/* eslint-disable max-params */
/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
import { AxiosRequestConfig } from "axios";
import Api from "../store/Api";
// import { BackUserModel } from "../models/redux-models";

const	UserServices = {
	async	register(code: string, hostname: string)
	{
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
				return (data.data);
			})
			.catch((error) =>
			{
				return ({msg: "ERROR",
					err: error.response.data});
			})
		);
	},
	async	registerFortyThree(hostname: string)
	{
		const	config: AxiosRequestConfig = {
			headers:
			{
				"Content-Type": "application/x-www-form-urlencoded"
			}
		};
		return (
			Api(hostname)
			.post("/user/register-forty-three", {}, config)
			.then((data) =>
			{
				return (data.data);
			})
			.catch((error) =>
			{
				console.error("error 43 user from api redux ");
				console.error(error);
				return ("ERROR");
			})
		);
	},
	async	verifyToken(token: string, hostname: string)
	{
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
			.then((_data) =>
			{
				return ("OKay");
			})
			.catch((error) =>
			{
				return ("ERROR");
			})
		);
	},
	async	getAllTheUsers(hostname: string)
	{
		return (
			Api(hostname)
			.get("/user/get-all-users", {})
			.then((data) =>
			{
				return (data.data);
			})
			.catch((error) =>
			{
				return ("error");
			})
		);
	},
	async	getNumberForDoubleAuth
		(numero: string, token: string, hostname: string)
	{
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
				return (data.data);
			})
			.catch((_error) =>
			{
				return ("error");
			})
		);
	},

	async	receiveValidationCodeFromTwilio
		(numero: string, token: string, hostname: string)
	{
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
				return (data.data);
			})
			.catch((error) =>
			{
				return ("error");
			})
		);
	},

	// when logging in
	async	receiveCode
		(profileId: string, token: string, hostname: string)
	{
		const	config: AxiosRequestConfig = {
			headers: {
				"content-type": "application/x-www-form-urlencoded",
				"Authorization": token,
			},
		};
		const	data = {
			profileId: profileId
		};

		return (
			Api(hostname)
			.post("/user/login-receive-code", data, config)
			.then((data) =>
			{
				return (data.data);
			})
			.catch((error) =>
			{
				return ("error");
			})
		);
	},

	async	getValidationCodeFromTwilio
	(numero: string, otpCode: string, token: string, hostname: string)
	{
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
				return (data);
			})
			.catch((error) =>
			{
				return ("error");
			})
		);
	},

	// when logging in
	async	getValidationCode
	(profileId: string, otpCode: string, token: string, hostname: string)
	{
		const	config: AxiosRequestConfig = {
			headers: {
				"content-type": "application/x-www-form-urlencoded",
				"Authorization": token,
			},
		};

		const	data = {
			profileId: profileId,
			otpCode: otpCode
		};

		return (
			Api(hostname)
			.post("/user/login-get-code", data, config)
			.then((data) =>
			{
				return (data);
			})
			.catch((error) =>
			{
				return ("error");
			})
		);
	},

	async	registerInfosInBack
	(token: string, info: string, field: string, doubleAuth: boolean, hostname: string)
	{
		const	config: AxiosRequestConfig = {
			headers: {
				"content-type": "application/x-www-form-urlencoded",
				"Authorization": token,
			},
		};

		const	data = {
			info: info,
			field: field,
			doubleAuth: doubleAuth
		};
		return (
			Api(hostname)
			.post("/user/change-infos", data, config)
			.then((_data) =>
			{
				return ("okay");
			})
			.catch((_error) =>
			{
				return ("error");
			})
		);
	},
	async	hashPassword(token: string, password: string, hostname: string, id: string | number)
	{
		const	config: AxiosRequestConfig = {
			headers: {
				"content-type": "application/x-www-form-urlencoded",
				"Authorization": token,
			},
		};

		const	data = {
			password: password,
			id: id
		};
		return (
			Api(hostname)
			.post("user/hash-password", data, config)
			.then((data) =>
			{
				return (data.data);
			})
			.catch((error) =>
			{
				console.error(error);
				return ("ERROR");
			})
		);
	},
	async	decodePassword(token: string, password: string, username: string, hostname: string)
	{
		const	config: AxiosRequestConfig = {
			headers: {
				"content-type": "application/x-www-form-urlencoded",
				"Authorization": token,
			},
		};

		const	data = {
			password: password,
			username: username,
		};
		return (
			await Api(hostname)
			.post("user/decode-password", data, config)
			.then((data) =>
			{
				return (data.data);
			})
			.catch(() =>
			{
				return ("error");
			})
		);
	},
	async	addUserAsFriend(token: string, friendId: string, hostname: string, myId: string)
	{
		const	config: AxiosRequestConfig = {
			headers: {
				"content-type": "application/x-www-form-urlencoded",
				"Authorization": token,
			},
		};

		const	data = {
			friendId: friendId,
			myId: myId
		};
		return (
			Api(hostname)
			.post("user/add-friend", data, config)
			.then((_data) =>
			{
				return ("OK");
			})
			.catch((_error) =>
			{
				return ("ERROR");
			})
		);
	},
	async	registrationValidation(token: string, hostname: string)
	{
		const	config: AxiosRequestConfig = {
			headers: {
				"content-type": "application/x-www-form-urlencoded",
				"Authorization": token,
			},
		};
		return (
			Api(hostname)
			.post("user/validate-registration", {}, config)
			.then((_data) =>
			{
				return ("OK");
			})
			.catch((error) =>
			{
				return ("ERROR");
			})
		);
	},
	async	getAchievements(token: string, hostname: string, profileId: string)
	{
		const	config: AxiosRequestConfig = {
			headers: {
				"content-type": "application/x-www-form-urlencoded",
				"Authorization": token,
			},
		};
		const	data = {
			id: profileId,
		};
		return (
			Api(hostname)
			.post("user/get-achievements", data, config)
			.then((data) =>
			{
				return (data.data);
			})
			.catch(() =>
			{
				return ("error");
			})
		);
	},
	async	getUserBackFromDB(token: string, hostname: string)
	{
		const	config: AxiosRequestConfig = {
			headers: {
				"content-type": "application/x-www-form-urlencoded",
				"Authorization": token,
			},
		};
		return (
			Api(hostname)
			.get("/user/get-user-back", config)
			.then((data) =>
			{
				return (data.data);
			})
			.catch((_error) =>
			{
				return ("ERROR");
			})
		);
	},

	async	UserSignin(username: string, password:string, hostname: string)
	{
		const	config: AxiosRequestConfig = {
			headers: {
				"content-type": "application/x-www-form-urlencoded",
			},
		};
		const	data = {
			username: username,
			password: password
		};
		return (
			Api(hostname)
			.post("user/login", data, config)
			.then((data) =>
			{
				return (data.data);
			})
			.catch((_error) =>
			{
				return ("ERROR");
			})
		);
	},

	async	getPlayingStatus(profileId: string | number, token :string, hostname: string)
	{
		const	config: AxiosRequestConfig = {
			headers: {
				"content-type": "application/x-www-form-urlencoded",
				"Authorization": token
			},
		};
		const	data = {
			profileId: profileId,
		};
		return (
			Api(hostname)
			.post("user/user-playing", data, config)
			.then((data) =>
			{
				return (data.data);
			})
			.catch((_error) =>
			{
				return ("ERROR");
			})
		);
	},
};

export default UserServices;
