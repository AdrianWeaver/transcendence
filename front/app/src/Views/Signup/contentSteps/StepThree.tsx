/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable semi */
import { useNavigate } from "react-router-dom";
import {
	useAppDispatch,
	useAppSelector } from "../../../Redux/hooks/redux-hooks";
import { useSavePrevPage } from "../../../Router/Hooks/useSavePrevPage";
import { Button } from "@mui/material";

const	StepThree = () =>
{
	// const	dispatch = useAppDispatch();
	const	navigate = useNavigate();
	// const	savePrevPage = useSavePrevPage();
	const	user = useAppSelector((state) =>
	{
		return (state.controller.user);
	});

	const	handleLogin = () =>
	{
		navigate("/");
	}


	return (
		<>
			<Button
				onClick={handleLogin}
				fullWidth
				variant="contained"
				sx={
				{
					mt: 3,
					mb: 2
				}}
			>
				Log in !
			</Button>
		</>
	);
};

export default StepThree;
