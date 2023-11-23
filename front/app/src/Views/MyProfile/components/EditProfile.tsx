/* eslint-disable max-len */
/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
import { useState } from "react";
import {
	Alert,
	AlertTitle,
	FormControlLabel,
	Grid,

	List,
	ListItem,
	TextField,
	Button,
	Checkbox,
	Box,
	Switch,
}	from "@mui/material";

import {
	useAppDispatch, useAppSelector } from "../../../Redux/hooks/redux-hooks";
import {
	hashPassword,
	registerInfosInBack,
	setDoubleAuth,
	setProfileMyView,
	updateChatUsers,
} from "../../../Redux/store/controllerAction";
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

type	EditProfileProps =
{
	setting: boolean
};

const	EditProfile = (props: EditProfileProps) =>
{
	const	dispatch = useAppDispatch();
	const	navigate = useNavigate();
	const	server = useAppSelector((state) =>
	{
		return (state.server);
	});
	const	user	= useAppSelector((state) =>
	{
		return (state.controller.user);
	});

	const	[
		errorValidation,
		setErrorValidation
	] = useState(new UserProfileEditChecker());

	const
	[
		required,
		setRequired
	] = useState(false);

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
		// verifier toute les informations
		if (filtered.length === 0)
		{
			if (user.username !== userChanges.username)
			{
				dispatch(updateChatUsers(user.id.toString(), userChanges.username));
				dispatch(registerInfosInBack(userChanges.username, required, "username"));
			}
			if (user.phoneNumber !== userChanges.phoneNumber || required !== user.doubleAuth)
				dispatch(registerInfosInBack(userChanges.phoneNumber, required, "phoneNumber"));
			if (props.setting)
				navigate("/");
			else
			{
				dispatch(setProfileMyView());
				navigate("/me/profile");
			}
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
						? "phone number is required (format +33612345632)"
						: ""
				}
			/>
		</Grid>
	);

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
						helperText= {
							errorValidation.username
								? "Username is required"
								: ""
						}
					/>
				</Grid>
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

				<Grid item xs={12} sm={12}>
				{
					(required)
					? fieldPhone
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
				Save changes
			</Button>
		</Box>
	);
};

export default EditProfile;
