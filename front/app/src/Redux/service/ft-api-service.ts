/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
import { AxiosRequestConfig } from "axios";
import Api from "../store/Api";
import { useAppDispatch } from "../hooks/redux-hooks";
import { setAvatar } from "../store/controllerAction";

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
				// console.log("register front");
				// console.log("here ", data.data);
				// const dispatch = useAppDispatch();

				// dispatch(setAvatar(data.data.avatar.link));
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
			.post("/user/verify-token", {}, config,)
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
	}
};

export default UserServices;
