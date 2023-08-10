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

import	{ settings, settingsLinks } from "./config/SettingsItem";

import	{ useAppDispatch } from "../../Redux/hooks/redux-hooks";
import	{ logOffUser } from "../../Redux/store/controllerAction";
import strToPascalCase from "./extras/strToPascalCase";
import { useNavigate } from "react-router-dom";

const	AvatarMenu = () =>
{
	const	navigate = useNavigate();
	const [
		anchorElUser,
		setAnchorElUser
	] = React.useState<null | HTMLElement>(null);

	const	handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) =>
	{
		setAnchorElUser(event.currentTarget);
	};

	const	handleCloseUserMenu = () =>
	{
		setAnchorElUser(null);
	};

	const	handleOnClickUserMenu = (event: React.MouseEvent<HTMLElement>) =>
	{
		const	elem = event.currentTarget as HTMLElement;
		const	text = strToPascalCase(elem.innerText);
		console.log(text);
		const	linkId = settings.findIndex((elem) =>
		{
			return (elem === text);
		});
		console.log("linkId", linkId);
		navigate(settingsLinks[linkId]);
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
							onClick={handleOnClickUserMenu}
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
