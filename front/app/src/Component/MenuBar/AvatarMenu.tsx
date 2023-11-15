/* eslint-disable max-len */
/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
import	React, { useEffect } from "react";
import	Box from "@mui/material/Box";
import	Tooltip from "@mui/material/Tooltip";
import	IconButton from "@mui/material/IconButton";
import	Avatar from "@mui/material/Avatar";
import	Menu from "@mui/material/Menu";
import	MenuItem from "@mui/material/MenuItem";
import	Typography from "@mui/material/Typography";

import	{ settings, settingsLinks } from "./config/SettingsItem";

import strToPascalCase from "./extras/strToPascalCase";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../Redux/hooks/redux-hooks";
// import MyAvatar from "../../Views/MyProfile/components/MyAvatar";
import { setCurrentProfile } from "../../Redux/store/controllerAction";


const	AvatarMenu = () =>
{
	const	navigate = useNavigate();
	const	dispatch = useAppDispatch();
	const	user = useAppSelector((state) =>
	{
		return (state.controller.user);
	});
	let myAvatar;

	if (user.avatar !== undefined)
			myAvatar = user.avatar;
	else
		myAvatar = "https://thispersondoesnotexist.com/";
	const [
		anchorElUser,
		setAnchorElUser
	] = React.useState<null | HTMLElement>(null);

	useEffect(() =>
	{
		console.log(user.chat.currentProfile);
	}, [user]);

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
		const	linkId = settings.findIndex((elem) =>
		{
			return (elem === text);
		});
		setAnchorElUser(null);
		dispatch(setCurrentProfile(user.id.toString()));
		navigate(settingsLinks[linkId]);
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
						src={myAvatar}
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
