/* eslint-disable no-nested-ternary */
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
		return (state.controller.user);
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
		sendSMS,
		setSendSMS
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
		const	userPhone = new UserSecurity(data, user);

		userPhone.check();
		setErrorValidation(userPhone.checker);

		const	isNotValid = userPhone.checker.getPhoneNumberCheck();
		console.log("isNotValid", isNotValid);
		if (user.doubleAuth)
		{
			dispatch(setDoubleAuth(true));
			if (!isNotValid)
			{
				dispatch(setPhoneNumber(userPhone.phoneNumber));
				setDisplayInput(true);
			}
				// NEED TO IMPLEMENT TWILIO DOUBLE AUTH 
				// dispatch(setRegistered(true));
				// dispatch(setUserLoggedIn());
			// }
		}
		else
		{
			dispatch(setDoubleAuth(false));
			dispatch(setPhoneNumber("undefined"));
			dispatch(setRegistered(true));
			dispatch(setUserLoggedIn());
		}
	};

	const	handleSwitch = (event: any) =>
	{
		const	checked = event.target?.checked;

		// doesnt seem to set
		setRequired(checked);
		dispatch(setDoubleAuth(checked));
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
					name="phoneNumber"
					required={required}
					fullWidth
					id="phoneNumber"
					label="Phone Number"
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
		const textField = (
			<TextField
				name="twoAuthCode"
				required={true}
				label="Enter the code"
				value={twoAuthCode}
				onChange={handleChangeTwoAuthCode}
			/>
		);
		fieldPhone = (
			<Grid item xs={12} sm={12}>
				<Grid item xs={12}>
					{
						textField
					}
				</Grid>
			</Grid>
		);
	}

		const handleSendCode = () =>
		{
			console.log("the value of phone " + user);
			// action poour une route /user/validateAuth BODY url encoded : phone number / Header token : verifie son id 
		};

		const	handleSendSMS = () =>
		{
			setSendSMS(true);
		};

		const sendTheCode = (
			<Button
				type="submit"
				fullWidth
				variant="contained"
				sx={
				{
					mt: 3,
					mb: 2
				}}
				onClick={handleSendCode}
			>
				finish the Authentification
			</Button>
		);
		const sendButton = (
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
				Receive a SMS
			</Button>
		);
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
						value="doubleAuthentification"
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
					: finishButton
				}
				{
					(required)
					? (!sendSMS)
						? sendButton
						: sendTheCode
					: <></>
				}
				{/* {
					(required && sendSMS)
					? sendTheCode
					: <></>
				} */}
			</Grid>
		</Box>
	);
};

export default SecondStepFormContent;
