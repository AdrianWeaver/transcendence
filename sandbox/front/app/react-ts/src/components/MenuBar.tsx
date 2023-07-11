/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
import {
	AppBar,
	Box,
	Container,
	IconButton,
	Menu,
	Toolbar,
	Typography,
	MenuItem,
	Button,
	Tooltip,
	Avatar
} from "@mui/material";

import { TypographyVariant } from "@mui/material/Typography";

import	GamePadIcon from "@mui/icons-material/Gamepad";
import	MenuIcon from "@mui/icons-material/Menu";
import React from "react";

const	displayStyle = {
	smallHidden:
	{
		xs: "none",
		md: "flex"
	},
	mediumHidden:
	{
		xs: "flex",
		md: "none"
	}
};

const	titleStyle = {
	mr: 2,
	display:
	{
		fontFamily: "monospace",
		fontWeight: 700,
		letterSpacing: ".3rem",
		color: "inherit",
		textDecoration: "none"
	}
};

const	boxStyleSmall = {
	flexGrow: 1,
	display: displayStyle.mediumHidden,
};

const	pages = [
	"Home",
	"Launch Game",
	"LeaderBoard"
];

const settings = [
	"Profile",
	"Account",
	"Dashboard",
	"Logout"
];

type	DisplayProps = {
	display: string
};

const	IconTitle = (props: DisplayProps) =>
{
	let	sxDyn;
	let	sxDyntitle;
	let	variantTitle: TypographyVariant | undefined;

	if (props.display === "hidde-small")
	{
		sxDyn = {
			display: displayStyle.smallHidden,
			mr: 1
		};
		sxDyntitle = {
			...titleStyle,
			display: displayStyle.smallHidden
		};
		variantTitle = undefined;
	}
	else
	{
		sxDyn = {
			display: displayStyle.mediumHidden,
			mr: 1,
		};
		sxDyntitle = {
			...titleStyle,
			display: displayStyle.mediumHidden,
			flexGrow: 1
		};
		variantTitle = "h5";
	}
	return (
		<>
			<GamePadIcon sx={sxDyn}/>
			<Typography sx={sxDyntitle} variant={variantTitle}>
				42_transcendence
			</Typography>
		</>
	);
};

const	AvatarMenu = () =>
{
	const [
		anchorElUser,
		setAnchorElUser
	] = React.useState<null | HTMLElement>(null);

	const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) =>
	{
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseUserMenu = () =>
	{
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
							<Typography textAlign="center">
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

const	HamburgerMenu = () =>
{
	const	[
		anchorElNav,
		setAnchorElNav
	] = React.useState<null | HTMLElement>(null);

	const handleCloseNavMenu = () =>
	{
		setAnchorElNav(null);
	};

	const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) =>
	{
		setAnchorElNav(event.currentTarget);
	};

	return (
		<Box sx={boxStyleSmall}>
			<IconButton
				size="large"
				aria-label="account of current user"
				aria-controls="menu-appbar"
				aria-aria-haspopup="true"
				onClick={handleOpenNavMenu}
				color="inherit"
			>
				<MenuIcon />
			</IconButton>
			<Menu
				id="menu-appbar"
				anchorEl={anchorElNav}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "left"
				}}
				keepMounted
				transformOrigin={{
					vertical: "top",
					horizontal: "left"
				}}
				open={Boolean(anchorElNav)}
				onClose={handleCloseNavMenu}
				sx= {{ display: displayStyle.mediumHidden}}
			>
			{
				pages.map((page) =>
				{
					return (
						<MenuItem
							key={page}
							// onClick
						>
							<Typography
								textAlign="center"
							>
								{page}
							</Typography>
						</MenuItem>
					);
				})
			}
			</Menu>
		</Box>
	);
};

const	LargeMenu = () =>
{
	const	sxDyn = {
		display: displayStyle.smallHidden,
		flexGrow: 1,
	};

	return (
		<Box sx={sxDyn}>
			{
				pages.map((page) =>
				{
					return(
						<Button
							key={page}
							// onClick={close nav menu}
							sx={
							{
								my: 2,
								color: "white",
								display: "block"
							}}
						>
						{page}
						</Button>
					);
				})
			}
		</Box>
	);
};

const	MenuBar = () =>
{
	return (
		<AppBar position="static">
			<Container maxWidth="xl">
				<Toolbar disableGutters>
					<IconTitle display="hidde-small"/>
					<HamburgerMenu />
					<IconTitle display="hidde-medium" />
					<LargeMenu />
					<AvatarMenu />
				</Toolbar>
			</Container>
		</AppBar>
	);
};

export default MenuBar;
