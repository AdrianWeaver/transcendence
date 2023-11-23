/* eslint-disable max-len */
/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
import { useState } from "react";
import {
	FormControlLabel,
	Grid,
	TextField,
	Button,
	Box,
	Switch,
}	from "@mui/material";

import {
	useAppDispatch, useAppSelector } from "../../../Redux/hooks/redux-hooks";
import {
	registerInfosInBack,
	setDoubleAuth,
	setProfileMyView,
	updateChatUsers,
} from "../../../Redux/store/controllerAction";
import UserProfileEdit from "../../../Object/UserProfileEdit";
import UserProfileEditChecker from "../../../Object/UserProfileEditChecker";
import { useNavigate } from "react-router-dom";
import UpdateMyProfilePicture from "../../../Component/DropZoneImage/UpdateMyProfilePicture";

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
		if (filtered.length === 0)
		{
			if (user.username !== userChanges.username)
			{
				dispatch(updateChatUsers(user.id.toString(), userChanges.username));
				dispatch(registerInfosInBack(userChanges.username, required, "username"));
			}
			// NEED TO ENCRYPT IT IN THE DB AND HERE TOO
			console.log("CHANGES ", userChanges);
			if (user.phoneNumber !== userChanges.phoneNumber || required !== user.doubleAuth)
				dispatch(registerInfosInBack(userChanges.phoneNumber, required, "phoneNumber"));
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
						helperText={
							// NEED TO CHECK IS IT S USED
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
				<UpdateMyProfilePicture />
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
