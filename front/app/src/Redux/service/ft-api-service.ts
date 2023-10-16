/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
import { AxiosRequestConfig } from "axios";
import Api from "../store/Api";

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
		console.log("Hello token");
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
				// console.log("register front");
				// console.log(data.data);
				console.log(data);
				return ("OKay");
			})
			.catch((error) =>
			{
				console.error("error from verify token");
				// console.error(error);
				return ("ERROR");
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
		(token: string, hostname: string, numero: string)
	{
		console.log("receive validation code");
		const	config: AxiosRequestConfig = {
			headers:
			{
				"Content-Type": "application/x-www-form-urlencoded",
				Authorization: token
			}
		};
		const	data = {
			numero: numero
		};

		return (
			Api(hostname)
			.post("/user/double-auth/twilio", data, config)
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
	}
};

export default UserServices;
