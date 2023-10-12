/* eslint-disable max-statements */
/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */
import { useEffect, useState } from "react";
import { useSavePrevPage } from "../../Router/Hooks/useSavePrevPage";
import MenuBar from "../../Component/MenuBar/MenuBar";
import { Alert, AlertTitle, Box, Button, Checkbox, FormControlLabel, Grid, List, ListItem, TextField } from "@mui/material";
import UserLoginChecker from "../../Object/UserLoginChecker";
import UserLogin from "../../Object/UserLogin";

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


const	Signin = () =>
{
	const	savePrevPage = useSavePrevPage();

	useEffect(() =>
	{
		savePrevPage("/signin");
	});

	const	[
		errorValidation,
		setErrorValidation
	] = useState(new UserLoginChecker());

	const	[
		passwordValue,
		setPasswordValue
	] = useState("");

	const	handlePasswordChangeValue = (
		event: React.ChangeEvent<HTMLInputElement>
	) =>
	{
		event.preventDefault();
		setPasswordValue(event.target.value);
	};

	const	handleSubmit = (event: React.FormEvent<HTMLFormElement>) =>
	{
		event.preventDefault();
		const	data = new FormData(event.currentTarget);
		const	userCheck = new UserLogin(data);
	};


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
							// value={props.username}
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
			</Box>
		</>
	);
};

export default Signin;
