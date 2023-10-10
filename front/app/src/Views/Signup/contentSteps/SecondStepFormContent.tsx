/* eslint-disable max-statements */
import { Box, Button, Grid, Link, TextField } from "@mui/material";
import UserRegistration from "../../../Object/UserRegistration";
import { useState } from "react";
import UserRegistrationChecker from "../../../Object/UserRegistrationChecker";
import { useAppDispatch } from "../../../Redux/hooks/redux-hooks";
import { setUserLoggedIn } from "../../../Redux/store/controllerAction";
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

	const	handleSubmit = (event: React.FormEvent<HTMLFormElement>) =>
	{
		event.preventDefault();
		dispatch(setUserLoggedIn);
	};

	const	checkPhone = () =>
	{
		// check format +33622143240
	};

	return (
		<Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
			<Grid container spacing={2}>
			<Grid item xs={12}>
					<TextField
						name="phone-number"
						required
						fullWidth
						id="phone-number"
						label="Phone Number"
						// value={props.username}
						error={errorValidation.phoneNumber}
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
				Log in
			</Button>
			<Grid container justifyContent="flex-end">
				<Grid item>
				<Link href="/login" variant="body2">
					Already have an account? Sign in
				</Link>
				</Grid>
			</Grid>
			</Box>
	);
};

export default SecondStepFormContent;
