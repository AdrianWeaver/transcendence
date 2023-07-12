
/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */

import
{
	Avatar,
	Box,
	FormControlLabel,
	TextField,
	Typography,
	Button
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useState } from "react";


const	mainStyle = {
	marginTop: 8,
	display: "flex",
	flexDirection: "column",
	alignItems: "center"
};

const	avatarStyle = {
	m: 1,
	bgcolor: "secondary.main"
};

const	Signin = () =>
{
	const
	[
		login,
		setLogin
	] = useState("Your Login");

	const
	[
		password,
		setPassword
	] = useState("Your Password");

	const	handleSubmit = (event: React.MouseEvent<HTMLFormElement>) =>
	{
		event.preventDefault();
		const	currentTarget = event.currentTarget as HTMLFormElement;
		const	data = new FormData(currentTarget);
		console.log(data);
	};

	return (
		<>
			<Box sx={mainStyle}>
				<Avatar sx={avatarStyle}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Sign in
				</Typography>
			</Box>
			<Box
				component="form"
				onSubmit={handleSubmit}
				noValidate
				sx={{mt: 1}}
			>
				<TextField
					margin="normal"
					required
					fullWidth
					id="login"
					label="Login"
					name="login"
					autoComplete="login"
					autoFocus
				/>
				<TextField
					margin="normal"
					required
					fullWidth
					name="password"
					label="Password"
					type="password"
					id="password"
					autoComplete="password"
				/>
				<FormControlLabel
					control= {
						<Checkbox
							value="Se souvenir de moi"
							color="primary"
						/>
					}
					label="Se souvenir de moi"
				/>
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
					Se connecter
				</Button>
			</Box>
		</>
	);
};

export default Signin;
