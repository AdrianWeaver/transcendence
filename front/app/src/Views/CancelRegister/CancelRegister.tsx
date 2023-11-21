/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../Redux/hooks/redux-hooks";
import { resetController } from "../../Redux/store/controllerAction";
import { resetServer, setAuthApiLinks } from "../../Redux/store/serverAction";
import { resetGameEngine } from "../../Redux/store/gameEngineAction";
import { resetAnonymousUser } from "../../Redux/store/anonymousUserAction";

/**
 * 
 * Must send information to the back that the Anonymous user 
 * cancel register
 * 
 */
const	CancelRegister = () =>
{
	const
	[
		message,
		setMessage
	] = useState("You'll be redirected soon, please wait... ");

	const	registration = useAppSelector((state) =>
	{
		return (state.controller.registration);
	});
	const	prevPage = useAppSelector((state) =>
	{
		return (state.controller.previousPage);
	});
	const	dispatch = useAppDispatch();
	const	navigate = useNavigate();

	// send request Here to the back for anonymous user deletion
	useEffect( () =>
	{
		setTimeout(() =>
		{
			setMessage("Redirect now...");
			// localStorage.clear();
			dispatch(resetController());
			dispatch(resetServer());
			dispatch(resetGameEngine());
			dispatch(resetAnonymousUser());
			dispatch(setAuthApiLinks());
			navigate("/");
		}, 1500);
	});
	return (<p>{message}</p>);
};

export default CancelRegister;
