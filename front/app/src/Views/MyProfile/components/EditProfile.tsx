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
	Switch,
}	from "@mui/material";

import	UserRegistration from "../../../Object/UserRegistration";
import UserRegistrationChecker from "../../../Object/UserRegistrationChecker";
import {
	useAppDispatch, useAppSelector } from "../../../Redux/hooks/redux-hooks";
import {
	hashPassword,
	registerInfosInBack,
	setDoubleAuth,
	setEmail,
	setPassword,
	setPhoneNumber,
	setProfileMyView,
	setPseudo,
	userRegistrationStepThree,
	userRegistrationStepTwo } from "../../../Redux/store/controllerAction";
import UserSecurityChecker from "../../../Object/UserSecurityChecker";
import UserSecurity from "../../../Object/UserSecurity";
import UserProfileEdit from "../../../Object/UserProfileEdit";
import UserProfileEditChecker from "../../../Object/UserProfileEditChecker";
import { useNavigate } from "react-router-dom";

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

type	EditProfileProps =
{
	setting: boolean
};

const	EditProfile = (props: EditProfileProps) =>
{
	const	dispatch = useAppDispatch();
	const	navigate = useNavigate();

	const	user	= useAppSelector((state) =>
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
	] = useState(new UserProfileEditChecker());

	const	[
		passwordValue,
		setPasswordValue
	] = useState("");

	const
	[
		passwordModified,
		setPasswordModified
	] = useState(false);

	const
	[
		required,
		setRequired
	] = useState(false);
	const	[
		uniquePassword,
		setUniquePassword
	] = useState(false);

	const	handleUniquePassword = () =>
	{
		setUniquePassword(true);
	};

	const	handlePasswordChangeValue = (
		event: React.ChangeEvent<HTMLInputElement>
	) =>
	{
		event.preventDefault();
		console.log("value pw", event.target.value, " length", event.target.value.length);
		if (event.target.value.length)
			setPasswordModified(true);
		else
			setPasswordModified(false);
		setPasswordValue(event.target.value);
		setPasswordFirstTrigger(true);
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

	const	handleSubmit = (event: React.FormEvent<HTMLFormElement>) =>
	{
		event.preventDefault();
		const	data = new FormData(event.currentTarget);

		const	userChanges = new UserProfileEdit(data, required, user);
		userChanges.check();
		setErrorValidation(userChanges.errorTable);
		const	asArray
			= Object.entries(userChanges.errorTable.getPlainObject());
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
		console.log("filtered", filtered);
		// verifier toute les informations
		if (filtered.length === 0)
		{
			if (user.username !== userChanges.username)
				dispatch(registerInfosInBack(userChanges.username, "username"));
			// NEED TO ENCRYPT IT IN THE DB AND HERE TOO
			if (user.password !== userChanges.password)
			{
				dispatch(setPassword(userChanges.password));
				dispatch(hashPassword(userChanges.password));
			}
			if (user.email !== userChanges.emailAddress)
				dispatch(registerInfosInBack(userChanges.emailAddress, "email"));
			if (user.phoneNumber !== userChanges.phoneNumber)
				dispatch(registerInfosInBack(userChanges.phoneNumber, "phoneNumber"));
			if (props.setting)
				navigate("/");
			else
			{
				dispatch(setProfileMyView());
				navigate("/me/profile");
			}
			console.log("num === ", user.phoneNumber);
		}
	};

	const	handleSwitch = (event: any) =>
	{
		const	checked = event.target?.checked;

		setRequired(checked);
		dispatch(setDoubleAuth(checked));
	};

	const	fieldPhone = (
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
						error={errorValidation.username}
						helperText={
							// NEED TO CHECK IS IT S USED
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
						id="email"
						label="Email Address"
						name="email"
						autoComplete="email"
						error={errorValidation.email}
						helperText={
							errorValidation.email
								? "Email is required"
								: ""
						}
					/>
				</Grid>
				<Grid item xs={12} sm={12} >
				<Grid item xs={12} sm={12} >
					<FormControlLabel
						value="doubleAuthentification"
						control={
							<Switch
								defaultChecked={user.doubleAuth}
								color="primary"
								onClick={handleSwitch} />
						}
						label="Double Authentification"
						labelPlacement="start"
					/>
				</Grid>
				</Grid>

				<Grid item xs={12} sm={12}>
				{
					(required)
					? fieldPhone
					: <></>
				}
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
					{
						(passwordModified)
						? <Grid item xs={12}>
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
						</Grid>
						: <></>
					}
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
				Save changes
			</Button>
		</Box>
	);
};

export default EditProfile;
