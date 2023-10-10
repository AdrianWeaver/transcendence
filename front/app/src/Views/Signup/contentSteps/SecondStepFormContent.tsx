/* eslint-disable max-len */
/* eslint-disable max-statements */
import { Box, Button, FormControlLabel, Grid, Link, Switch, TextField } from "@mui/material";
import UserRegistration from "../../../Object/UserRegistration";
import { useState } from "react";
import UserRegistrationChecker from "../../../Object/UserRegistrationChecker";
import {
	useAppDispatch,
	useAppSelector } from "../../../Redux/hooks/redux-hooks";
import {
	setDoubleAuth,
	setPhoneNumber,
	setUserLoggedIn } from "../../../Redux/store/controllerAction";
import UserSecurity from "../../../Object/UserSecurity";
import UserSecurityChecker from "../../../Object/UserSecurityChecker";

/* eslint-disable max-lines-per-function */
const	SecondStepFormContent = () =>
{
	const	dispatch = useAppDispatch();

	const	[
		errorValidation,
		setErrorValidation
	] = useState(new UserSecurityChecker());

	const	[
		required,
		setRequired
	] = useState(false);

	const	handleSubmit = (event: React.FormEvent<HTMLFormElement>) =>
	{
		event.preventDefault();
		const	data = new FormData(event.currentTarget);
		const	user = new UserSecurity(data);
		console.log("data: ", data);
		user.check();
		setErrorValidation(user.checker);
		const	phone = user.getPlainObject();
		if (phone.doubleAuth)
		{
			dispatch(setDoubleAuth);
			if (phone.valid)
				dispatch(setPhoneNumber);
		}
		if (phone.valid)
			dispatch(setUserLoggedIn);
	};

	const	handleSwitch = (event: any) =>
	{
		const	checked = event.target?.checked;

		setRequired(checked);
		dispatch(setDoubleAuth(checked));
		console.log(required);
	};


	return (
		<Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
			<Grid container spacing={2}>
			<Grid item xs={12} sm={6}>
			<FormControlLabel
			value="double-authenfication"
			control={
				<Switch color="primary"
				onClick={handleSwitch} />
			}
			label="Double Authentification"
			labelPlacement="start"
        />
				</Grid>
			<Grid item xs={12} sm={6}>
					<TextField
						name="phone-number"
						required={required}
						fullWidth
						id="phone-number"
						label="Phone Number"
						// value={props.username}
						error={errorValidation.phoneNumber}
						helperText={
							errorValidation.phoneNumber
								? "phone number is required"
								: ""
						}
					/>
				</Grid>
				</Grid>
			<Button
				type="submit"
				fullWidth
				variant="contained"
				sx={
				{
					mt: 3,
					mb: 2
				}}
			>
				Finish to register
			</Button>
		</Box>
	);
};

export default SecondStepFormContent;
