/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
import	React from "react";
import	Box from "@mui/material/Box";
import	Tooltip from "@mui/material/Tooltip";
import	IconButton from "@mui/material/IconButton";
import	Avatar from "@mui/material/Avatar";
import	Menu from "@mui/material/Menu";
import	MenuItem from "@mui/material/MenuItem";
import	Typography from "@mui/material/Typography";

import	settings from "./config/SettingsItem";

import { useAppDispatch } from "../../hooks/redux-hooks";
import { logOffUser } from "../../store/controllerAction";

const	AvatarMenu = () =>
{
	const	dispatch = useAppDispatch();

	const [
		anchorElUser,
		setAnchorElUser
	] = React.useState<null | HTMLElement>(null);

	const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) =>
	{
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseUserMenu = (event: React.MouseEvent<HTMLElement>) =>
	{
		event.preventDefault();

		const clickedElement = event.target as HTMLElement;
		if (clickedElement.textContent === "Logout")
			dispatch(logOffUser());
		setAnchorElUser(null);
	};

	return (
		<Box sx={{flexGrow: 0}}>
			<Tooltip title="Open settings">
				<IconButton
					onClick={handleOpenUserMenu}
					sx={{ p: 0}}
				>
					<Avatar
						alt="image profile"
						src="https://thispersondoesnotexist.com/"
					/>
				</IconButton>
			</Tooltip>
			<Menu
				sx={{ mt: "45px" }}
				id="menu-appbar"
				anchorEl={anchorElUser}
				anchorOrigin={
				{
					vertical: "top",
					horizontal: "right",
				}}
				keepMounted
				transformOrigin={
				{
					vertical: "top",
					horizontal: "right",
				}}
				open={Boolean(anchorElUser)}
				onClose={handleCloseUserMenu}
			>
			{
				settings.map((setting) =>
				{
					return (
						<MenuItem
							key={setting}
							onClick={handleCloseUserMenu}
						>
							<Typography
								textAlign="center"
							>
								{setting}
							</Typography>
						</MenuItem>
					);
				})
			}
			</Menu>
		</Box>
	);
};

export default AvatarMenu;
