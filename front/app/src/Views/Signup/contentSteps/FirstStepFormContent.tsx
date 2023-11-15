/* eslint-disable max-len */
/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
import { useState } from "react";
import {
	Alert,
	AlertTitle,
	FormControlLabel,
	Grid,
	Link,
	List,
	ListItem,
	TextField,
	Button,
	Checkbox,
	Box,
}	from "@mui/material";

import	UserRegistration from "../../../Object/UserRegistration";
import UserRegistrationChecker from "../../../Object/UserRegistrationChecker";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks/redux-hooks";
import {
	// hashPassword,
	// registerInfosInBack,
	setPassword,
	// setPseudo,
	userRegistrationStepThree,
	// userRegistrationStepTwo,
} from "../../../Redux/store/controllerAction";
import axios from "axios";

type PasswordAlertProps ={
	password: string,
	firstTrigger: boolean,
	passwordConfirm?: string
}

const	stringContainChar = (string: string, char: string) =>
{
	let	i;

	i = 0;
	console.log("last Char = ", char.charAt(char.length - 1));
	while (i < string.length)
	{
		if (string.charAt(i) >= char.charAt(0)
			&& string.charAt(i) <= char.charAt(char.length - 1))
			return (true);
		i++;
	}
	return (false);
};

const	stringContainCharOfString = (string: string, charset: string) =>
{
	let	i;
	let	j;

	i = 0;
	j = 0;
	while (i < string.length)
	{
		while (j < charset.length)
		{
			if (string.charAt(i) === charset.charAt(j))
				return (true);
			j++;
		}
		j = 0;
		i++;
	}
	return (false);
};

const	PasswordAlert = (props: PasswordAlertProps) =>
{
	const	message = [];
	const	digit = "0-9";
	const	uperCase = "A-Z";
	const	lowerCase = "a-z";
	const	specialChar = " !\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";

	if (props.password.length === 0 && props.firstTrigger === false)
		return (<></>);
	if (props.firstTrigger === false
		&& props.passwordConfirm)
		return (<></>);
	if (props.passwordConfirm !== undefined )
	{
		console.log(props);
		if (props.firstTrigger === false)
			return (<></>);
		if (props.password !== props.passwordConfirm)
			return (
				<Grid item xs={12}>
					<Alert
						severity="error"
					>
						Password mismatch
					</Alert>
				</Grid>
			);
		else
			return (<></>);
	}
	if (props.password.length < 8)
		message.push("minimum 8 character");
	if (stringContainChar(props.password, digit) === false)
		message.push("minimum 1 digit");
	if (stringContainChar(props.password, uperCase) === false)
		message.push("minimum 1 upercase");
	if (stringContainChar(props.password, lowerCase) === false)
		message.push("minimum 1 lowercase");
	if (stringContainCharOfString(props.password, specialChar) === false)
		message.push("minimum 1 special char : " + specialChar);
	if (message.length === 0)
		return (<></>);
	return (
		<Grid item xs={12}>
			<Alert
				severity="info"
			>
				<AlertTitle>You must have:</AlertTitle>
				<List
					sx={
					{
						m: 0,
						fontSize: "0.7rem"
					}}
				>
				{
					message.map((msg) =>
					{
						return (
							<ListItem key={msg}>
								{msg}
							</ListItem>
						);
					})
				}
				</List>
			</Alert>
		</Grid>
	);
};

type UniqueAlertProps = {
	isUnique: boolean
};

const UniqueAlert = (props: UniqueAlertProps) =>
{
	if (props.isUnique)
		return (
		<Alert severity="warning" >
			Faites Attention !
		</Alert>);
	else
		return (<></>);
};

type	FirstStepFormContentProps =
{
	readonly username: string
	readonly email: string
	readonly lastName: string
	readonly firstName: string
};

const	FirstStepFormContent = (props: FirstStepFormContentProps) =>
{
	const	dispatch = useAppDispatch();
	const	server = useAppSelector((state) =>
	{
		return (state.server);
	});
	const	user = useAppSelector((state) =>
	{
		return (state.controller.user);
	});

	const	[
		firstTriggerPassword,
		setPasswordFirstTrigger
	] = useState(false);

	const	[
		firstTriggerPasswordConfirm,
		setPasswordFirstTriggerConfirm
	] = useState(false);
	const	[
		errorValidation,
		setErrorValidation
	] = useState(new UserRegistrationChecker());

	const	[
		passwordValue,
		setPasswordValue
	] = useState("");

	const	[
		usernameValue,
		setUsernameValue
	] = useState(props.username);

	const	[
		uniquePassword,
		setUniquePassword
	] = useState(false);

	const
	[
		hasError,
		setHasError
	]	= useState(false);

	const
	[
		errorMessage,
		setErrorMessage
	]	= useState("An error");

	const	handleUniquePassword = () =>
	{
		setUniquePassword(true);
	};

	const	handlePasswordChangeValue = (
		event: React.ChangeEvent<HTMLInputElement>
	) =>
	{
		event.preventDefault();
		setPasswordValue(event.target.value);
		setPasswordFirstTrigger(true);
	};

	const	handleUsernameChangeValue = (
		event: React.ChangeEvent<HTMLInputElement>
	) =>
	{
		event.preventDefault();
		setUsernameValue(event.target.value);
	};

	const	[
		passwordConfirmValue,
		setPasswordConfirm
	] = useState("");

	const	handlePasswordConfirmChangeValue = (
		event: React.ChangeEvent<HTMLInputElement>
	) =>
	{
		event.preventDefault();
		setPasswordConfirm(event.target.value);
		setPasswordFirstTriggerConfirm(true);
	};

	const token = useAppSelector((state) =>
	{
		return (state.controller.user.bearerToken);
	});

	const	handleSubmit = (event: React.FormEvent<HTMLFormElement>) =>
	{
		event.preventDefault();
		setHasError(false);
		setErrorMessage("");
		const	data = new FormData(event.currentTarget);
		const	userSignup = new UserRegistration(data);
		userSignup.check();
		setErrorValidation(userSignup.errorTable);
		// console.log(errorValidation);
		const	asArray
			= Object.entries(userSignup.errorTable.getPlainObject());
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
		if (filtered.length === 0)
		{
			const	plainObj = userSignup.getPlainObject();
			const	objToSend = {
				username: plainObj.username,
				firstName: plainObj.firstName,
				lastName: plainObj.lastName,
				emailAddress: plainObj.emailAddress,
				password: plainObj.password,
				passwordConfirm: plainObj.passwordConfirm,
				uniquenessPassword: plainObj.uniquenessPassword,
				ft: user.ft
			};
			const	config = {
				headers: {
					"Authorization": token
				}
			};
			axios
			.post(server.uri + ":3000/user/register/step-one",
				objToSend,
				config
			)
			.then((response) =>
			{
				console.log(response);
				dispatch(setPassword(userSignup.password));
				dispatch(userRegistrationStepThree());
			})
			.catch((error: any) =>
			{
				setErrorMessage(error.response.data.info);
				setHasError(true);
			});
		}
	};

	const	disclamer = "Je suis sur de ne pas utiliser"
		+ " le meme mot de passe de connexion a l'intra 42";
	return (
		<Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
			<Grid container spacing={2}>
			<Grid item xs={12}>
					<TextField
						name="username"
						required
						fullWidth
						id="username"
						label="Username"
						// defaultValue={props.username}
						value={usernameValue}
						onChange={handleUsernameChangeValue}
						error={errorValidation.username}
						helperText={
							// NEED TO CHECK IS IT S USED
							errorValidation.username
								? "Username is required"
								: ""
						}
					/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField
						autoComplete="given-name"
						name="firstName"
						required
						fullWidth
						id="firstName"
						label="First Name"
						value={props.firstName}
						autoFocus
						error={errorValidation.firstName}
						helperText={
							errorValidation.firstName
								? "First name is required"
								: ""
						}
						contentEditable={false}
						variant="filled"
					/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField
						required
						fullWidth
						id="lastName"
						label="Last Name"
						value={props.lastName}
						name="lastName"
						autoComplete="family-name"
						error={errorValidation.lastName}
						helperText={
							errorValidation.lastName
								? "Last name is required"
								: ""
						}
						contentEditable={false}
						variant="filled"
					/>
				</Grid>
				<Grid item xs={12}>
				<TextField
						required
						fullWidth
						id="email"
						label="Email Address"
						value={props.email}
						name="email"
						autoComplete="email"
						error={errorValidation.email}
						helperText={
							errorValidation.email
								? "Email is required"
								: ""
						}
						contentEditable={false}
						variant="filled"
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
				<PasswordAlert
					password={passwordValue}
					firstTrigger={firstTriggerPassword}
					/>
				<Grid item xs={12}>
					<TextField
						required
						fullWidth
						name="passwordConfirm"
						label="Password confirm"
						type="password"
						id="passwordConfirm"
						autoComplete="new-password"
						value={passwordConfirmValue}
						onChange={handlePasswordConfirmChangeValue}
						error={errorValidation.password}
						helperText={
							errorValidation.password
								? "Please check password"
								: ""
						}
					/>
				</Grid>
				<PasswordAlert
					password={passwordValue}
					firstTrigger={firstTriggerPasswordConfirm}
					passwordConfirm={passwordConfirmValue}
					/>
				<Grid item xs={12}>
					<FormControlLabel
						control={
							<Checkbox
								required
								value="AgreeWithUniquenessOfPassword"
								color="primary"
								name="uniquePassword"
								onClick={handleUniquePassword}
							/>
						}
						label={disclamer}
					/>
					<UniqueAlert isUnique={uniquePassword} />
					{
						(hasError)
						? (<Alert severity="error" >
								{errorMessage}
							</Alert>)
						: <></>
					}
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
				Sign Up
			</Button>
			<Grid container justifyContent="flex-end">
				<Grid item>
				<Link href="/signin" variant="body2">
					Already have an account? Sign in
				</Link>
				</Grid>
			</Grid>
		</Box>
	);
};

export default FirstStepFormContent;
