/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
import { useEffect, useState } from "react";
// import { useAbortRequest } from "../../Router/Hooks/useAbortRequest";
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
	] = useState("You'll be redirected soon, please wait... (delay)");

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

	const	routeToHome = registration.requestHomeLink;

	// send request Here to the back for anonymous user deletion
	setTimeout(() =>
	{
		setMessage("Redirect now...");
		if (registration.startedRegister === true
			&& registration.abortRequested === true)
			dispatch(resetRegistration());
		if (routeToHome)
			navigate("/");
		else
			navigate(prevPage);
	}, 1500);
	return (<p>{message}</p>);
};

export default CancelRegister;
