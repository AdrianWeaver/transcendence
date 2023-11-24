/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
/* eslint-disable curly */
/* eslint-disable max-statements */
/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */
import { useEffect, useState } from "react";
import { useSavePrevPage } from "../../Router/Hooks/useSavePrevPage";
import MenuBar from "../../Component/MenuBar/MenuBar";
import { Box, Button, Grid, TextField } from "@mui/material";
import UserLoginChecker from "../../Object/UserLoginChecker";
import UserLogin from "../../Object/UserLogin";
import { useAppDispatch, useAppSelector } from "../../Redux/hooks/redux-hooks";
import { GetCode, receiveCode, receiveValidationCode, setUserLoggedIn, userSignIn } from "../../Redux/store/controllerAction";
import { useNavigate } from "react-router-dom";

const	SigninDoubleAuth = () =>
{
	const	savePrevPage = useSavePrevPage();
	const	dispatch = useAppDispatch();
	const	navigate = useNavigate();

	const	user = useAppSelector((state) =>
	{
		return (state.controller.user);
	});

	// const	allUsers = useAppSelector((state) =>
	// {
	// 	return (state.controller.allUsers);
	// });

	useEffect(() =>
	{
		savePrevPage("/signin");
	}, []);

	useEffect(() =>
	{
		if ((!user.doubleAuth) && !user.isLoggedIn)
		{
			navigate("/signin");
		}
	}, [user.doubleAuth]);

	useEffect(() =>
	{
		if (user.isLoggedIn === true)
		{
			navigate("/");
		}
	}, [
		user.isLoggedIn,
		navigate
	]);

	const	[
		errorValidation,
		setErrorValidation
	] = useState(new UserLoginChecker());

	const	[
		passwordValue,
		setPasswordValue
	] = useState("");

	const	[
		twilioCode,
		setTwilioCode
	] = useState("");

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

	const	handlePasswordChangeValue = (
		event: React.ChangeEvent<HTMLInputElement>
	) =>
	{
		event.preventDefault();
		setPasswordValue(event.target.value);
	};

	const	handleEnterCode = (
		event: React.ChangeEvent<HTMLInputElement>
	) =>
	{
		event.preventDefault();
		setTwilioCode(event.target.value);
	};

	const	handleSubmit = (event: React.FormEvent<HTMLFormElement>) =>
	{
		event.preventDefault();
		const	data = new FormData(event.currentTarget);
		const	userLogIn = new UserLogin(data);
		userLogIn.check();
		setErrorValidation(userLogIn.checker);
		const	asArray = Object.entries(userLogIn.checker.getPlainObject());
		const	filtered = asArray.filter(
			([
				key,
				value
			]
			) =>
			{
				key;
				return (value === true);
			});
			// verifier toute les informations
			if (filtered.length === 0)
			{
				dispatch(userSignIn(userLogIn.username, userLogIn.password));
			}
	};

	const handleSendCode = () =>
	{
		if (twilioCode.length)
		{
			setSendCode(true);
			dispatch(GetCode(twilioCode, user.bearerToken));
		}
	};

	const	handleReceiveCode = () =>
	{
		dispatch(receiveCode(user.bearerToken));
		setSendSMS(true);
	};

	const handleFinishToRegister = () =>
	{
		if (user.codeValidated)
		{
			dispatch(setUserLoggedIn());
			navigate("/");
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
			send the code
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
				Log in
			</Button>
	);

	return (
		<>
			<MenuBar />
			<Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<TextField
							name="username"
							required
							fullWidth
							id="username"
							label="Username"
							error={errorValidation.username}
							helperText={
									errorValidation.username
									? "Username is required"
									: ""
							}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							required
							fullWidth
							name="password"
							label="Password"
							type="password"
							id="password"
							autoComplete="new-password"
							value={passwordValue}
							onChange={handlePasswordChangeValue}
							error={errorValidation.password}
							helperText={
								errorValidation.password
									? "Please check password"
									: ""
							}
						/>
					</Grid>
					<Grid item xs={12}>
						{
							(!sendSMS)
							? <></>
							: <TextField
								required
								fullWidth
								name="twilioCode"
								label="Enter Code"
								type="twilioCode"
								id="twilioCode"
								autoComplete="twilio-code"
								value={twilioCode}
								onChange={handleEnterCode}
							/>
						}
						{
							(!sendSMS)
							? sendSmsButton
							: (!sendCode)
								? sendTheCode
								: finishButton
						}
					</Grid>
				</Grid>
			</Box>
		</>
	);
};

export default SigninDoubleAuth;
