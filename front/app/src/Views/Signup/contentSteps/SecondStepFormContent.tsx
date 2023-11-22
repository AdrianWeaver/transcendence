/* eslint-disable no-nested-ternary */
/* eslint-disable curly */
/* eslint-disable max-len */
/* eslint-disable max-statements */
import { Box, Button, FormControlLabel, Grid, Switch, TextField } from "@mui/material";
// import UserRegistration from "../../../Object/UserRegistration";
import React, { useState } from "react";
// import UserRegistrationChecker from "../../../Object/UserRegistrationChecker";
import {
	useAppDispatch,
	useAppSelector } from "../../../Redux/hooks/redux-hooks";
import {
	GetValidationCode,
	addFrontUser,
	// getIpAddress,
	receiveValidationCode,
	registerNumberForDoubleAuth,
	setAllUsers,
	setAvatar,
	setDoubleAuth,
	setOnline,
	setPhoneNumber,
	setProfileMyView,
	setRegistered,
	setStatus,
	setUserLoggedIn } from "../../../Redux/store/controllerAction";

import MuiPhone from "../component/MuiPhone";
import { useNavigate } from "react-router-dom";

/* eslint-disable max-lines-per-function */
const	SecondStepFormContent = () =>
{
	const	dispatch = useAppDispatch();
	const	user = useAppSelector((state) =>
	{
		return (state.controller.user);
	});
	const	navigate = useNavigate();

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
		sendSMS,
		setSendSMS
	] = useState(false);

	const
	[
		sendCode,
		setSendCode
	] = useState(false);

	const
	[
		twoAuthCode,
		setTwoAuthCode
	] = useState("");

	const
	[
		muiPhone,
		setMuiPhone
	] = useState("+33");

	const
	[
		numberRegistered,
		setNumberRegistered
	] = useState(false);


	const	formattingPhoneNumber = (num: string) =>
	{
		let	newNum;

		newNum = num;
		newNum = newNum.replace(/\s/g, "");
		return (newNum);
	};

	const	handleSubmit = (event: React.FormEvent<HTMLFormElement>) =>
	{
		event.preventDefault();
		if (user.doubleAuth)
		{
			dispatch(setDoubleAuth(true));
			if (numberRegistered)
			{
				const numberFormat = formattingPhoneNumber(muiPhone);
				dispatch(setPhoneNumber(numberFormat));
				setDisplayInput(true);
			}
		}
		else
		{
			dispatch(setDoubleAuth(false));
			dispatch(setPhoneNumber("undefined"));
			dispatch(setRegistered());
			dispatch(setUserLoggedIn());
			dispatch(setProfileMyView());
			dispatch(addFrontUser(user));
			dispatch(setOnline(true, user));
			dispatch(setStatus("online", user));
			dispatch(setAvatar(user.avatar));
			dispatch(setAllUsers());
			navigate("/");
		}
	};

	const	handleSwitch = (event: any) =>
	{
		const	checked = event.target?.checked;

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
				<MuiPhone value={muiPhone} onChange={setMuiPhone} />
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
			if (twoAuthCode.length)
			{
				setSendCode(true);
				dispatch(GetValidationCode(twoAuthCode, user.bearerToken));
			}
		};

		const	handleRegisterNumber = () =>
		{
			let	tmp, valid;

			valid = true;
			tmp = muiPhone;
			tmp = tmp.replace(/\s/g, "");
			if (muiPhone === undefined || muiPhone === null
					|| muiPhone.length === 0
					|| muiPhone === "undefined")
				valid = false;
			else
			{
				if (tmp.length < 9
						|| tmp.length > 15)
					valid = false;
				if (muiPhone[0] !== "+")
					valid = false;
				else
					tmp = tmp.slice(1, tmp.length);
				if (isNaN(Number(tmp)))
					valid = false;
			}
			if (valid)
			{
				dispatch(registerNumberForDoubleAuth(formattingPhoneNumber(muiPhone), user.bearerToken));
				setNumberRegistered(true);
			}
		};

		const	handleReceiveCode = () =>
		{
			if (numberRegistered && muiPhone)
			{
				console.log("mui phone ", muiPhone);
				dispatch(receiveValidationCode(formattingPhoneNumber(muiPhone), user.bearerToken));
				setSendSMS(true);
			}
		};

		const handleFinishToRegister = () =>
		{
			console.log("valid ", user.codeValidated);
			if (user.codeValidated)
			{
				dispatch(setUserLoggedIn());
				dispatch(setRegistered());
				dispatch(setAllUsers());
				dispatch(addFrontUser(user));
			}
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

		const sendSmsButton = (
			<Button
				type="submit"
				fullWidth
				variant="contained"
				sx={
				{
					mt: 3,
					mb: 2
				}}
				onClick={handleReceiveCode}
			>
				Receive the code
			</Button>
		);
		const registerNumButton = (
			<Button
				type="submit"
				fullWidth
				variant="contained"
				sx={
				{
					mt: 3,
					mb: 2
				}}
				onClick={handleRegisterNumber}
			>
				register phone number (format +33612345678)
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
					onClick={handleFinishToRegister}
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
				<Grid item xs={12} sm={12}>
				{
					(required)
					? fieldPhone
					: finishButton
				}
				{
					(required)
					? (!numberRegistered)
						? registerNumButton
						: (!sendSMS)
							? sendSmsButton
							: (!sendCode)
								? sendTheCode
								: finishButton
					: <></>
				}
				</Grid>
			</Grid>
		</Box>
	);
};

export default SecondStepFormContent;
