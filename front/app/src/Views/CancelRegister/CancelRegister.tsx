/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../Redux/hooks/redux-hooks";
import { persistor } from "../../Redux/store";

const	CancelRegister = () =>
{
	const
	[
		message,
		setMessage
	] = useState("You'll be redirected soon, please wait...");

	const	prevPage = useAppSelector((state) =>
	{
		return (state.controller.previousPage);
	});
	const	navigate = useNavigate();

	useEffect( () =>
	{
		setTimeout(() =>
		{
			setMessage("Redirect now...");
			persistor.purge();
			navigate(prevPage);
			window.location.reload();
		}, 1500);
	});
	return (<p>{message}</p>);
};

export default CancelRegister;
