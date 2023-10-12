/* eslint-disable curly */
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
	setRegistered,
	setUserLoggedIn } from "../../../Redux/store/controllerAction";
import UserSecurity from "../../../Object/UserSecurity";
import UserSecurityChecker from "../../../Object/UserSecurityChecker";
import axios from "axios";

/* eslint-disable max-lines-per-function */
const	SecondStepFormContent = () =>
{
	const	dispatch = useAppDispatch();
	const	user = useAppSelector((state) =>
	{
		return (state.controller.user.phoneNumber);
	});

	const	[
		errorValidation,
		setErrorValidation
	] = useState(new UserSecurityChecker());

	const	[
		required,
		setRequired
	] = useState(false);

	const
	[
		displayInput,
		setDisplayInput
	] = useState(false);

	const
	[
		buttonSendSms,
		setButtonSendSms
	] = useState(false);

	const
	[
		twoAuthCode,
		setTwoAuthCode
	] = useState("");
	const	handleSubmit = (event: React.FormEvent<HTMLFormElement>) =>
	{
		event.preventDefault();
		const	data = new FormData(event.currentTarget);
		const	user = new UserSecurity(data);

		user.check();
		setErrorValidation(user.checker);
		const	phone = user.getPlainObject();
		if (required)
		{
			dispatch(setDoubleAuth(required));
			// if (phone.valid)
			// {
				dispatch(setPhoneNumber(phone.phoneNumber));
				setDisplayInput(true);
				// NEED TO IMPLEMENT TWILIO DOUBLE AUTH 
				// dispatch(setRegistered(true));
				// dispatch(setUserLoggedIn());
			// }
		}
		else
		{
			dispatch(setDoubleAuth(required));
			dispatch(setPhoneNumber("undefined"));
			dispatch(setRegistered(true));
			dispatch(setUserLoggedIn());
		}
	};

	const	handleSwitch = (event: any) =>
	{
		const	checked = event.target?.checked;

		setRequired(checked);
		dispatch(setDoubleAuth(checked));
		console.log(required);
	};

	const	handleChangeTwoAuthCode = (event: any) =>
	{
		event.preventDefault();
		console.log(event.target.value);
		setTwoAuthCode(event.target.value);
	};

	let	fieldPhone;
	if (displayInput === false)
	{
		fieldPhone = (
			<Grid item xs={12} sm={12}>
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
		);
	}
	else
	{
		const handleSendSMS = () =>
		{
			console.log("the value of phone " + user);
			// action poour une route /user/validateAuth BODY url encoded : phone number / Header token : verifie son id 
		};

		const button = (
			<Button
				type="submit"
				fullWidth
				variant="contained"
				sx={
				{
					mt: 3,
					mb: 2
				}}
				onClick={handleSendSMS}
			>
				Send SMS
			</Button>
		);
		const textField = (
			<TextField
				name="twoAuthCode"
				required={true}
				label="Your code received by phone"
				value={twoAuthCode}
				onChange={handleChangeTwoAuthCode}
			/>
		);
		fieldPhone = (
			<Grid item xs={12} sm={12}>
				<Grid item xs={12}>
					{
						(displayInput)
						? button
						: textField
					}
				</Grid>
			</Grid>
		);
	}

	const finishButton = (
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
	);
	return (
		<Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }} >
			<Grid container spacing={2} textAlign="center">
				<Grid item xs={12} sm={12} >
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
				{
					(required)
					? fieldPhone
					: <></>
				}
			</Grid>
			{
				// (!required && )
				// ? finishButton
				// : <></>
				finishButton
			}
		</Box>
	);
};

export default SecondStepFormContent;
