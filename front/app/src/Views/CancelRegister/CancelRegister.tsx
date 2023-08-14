/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../Redux/hooks/redux-hooks";
import { resetRegistration } from "../../Redux/store/controllerAction";

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
	] = useState("You'll be redirected soon, please wait... (delayed)");

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
			if (registration.startedRegister === true
				&& registration.abortRequested === true)
				dispatch(resetRegistration());
			navigate(prevPage);
		}, 1500);
	});
	return (<p>{message}</p>);
};

export default CancelRegister;
