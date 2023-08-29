/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
import	React from "react";
import	Box from "@mui/material/Box";
import	IconButton from "@mui/material/IconButton";
import	MenuIcon from "@mui/icons-material/Menu";
import	Menu from "@mui/material/Menu";
import	MenuItem from "@mui/material/MenuItem";
import	Typography from "@mui/material/Typography";

import displayStyle from "./config/DisplayStyle";

import { pagesVisitor, pagesLinksVisitor } from "./config/PagesItemVisitors";
import strToPascalCase from "./extras/strToPascalCase";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../Redux/hooks/redux-hooks";
import { pagesLogged, pagesLinksLogged } from "./config/PagesItemLogged";

const	boxStyleSmall = {
	flexGrow: 1,
	display: displayStyle.mediumHidden,
};

const	HamburgerMenu = () =>
{
	const	navigate = useNavigate();
	const	isLogged = useAppSelector((state) =>
	{
		return (state.controller.user.isLoggedIn);
	});
	const	[
		anchorElNav,
		setAnchorElNav
	] = React.useState<null | HTMLElement>(null);

	const	handleCloseNavMenu = () =>
	{
		setAnchorElNav(null);
	};

	const	handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) =>
	{
		setAnchorElNav(event.currentTarget);
	};

	const	handleOnClickVisitor = (event: React.MouseEvent<HTMLElement>) =>
	{
		const	elem = event.currentTarget as HTMLElement;
		const	text = strToPascalCase(elem.innerText);
		const	linkId = pagesVisitor.findIndex((elem) =>
		{
			return (elem === text);
		});
		navigate(pagesLinksVisitor[linkId]);
		setAnchorElNav(null);
	};

	const	handleOnClickLogged = (event: React.MouseEvent<HTMLElement>) =>
	{
		const	elem = event.currentTarget as HTMLElement;
		const	text = strToPascalCase(elem.innerText);
		const	linkId = pagesLogged.findIndex((elem) =>
		{
			return (elem === text);
		});
		navigate(pagesLinksLogged[linkId]);
		setAnchorElNav(null);
	};

	const	Visitors = pagesVisitor.map((page) =>
	{
		return (
			<MenuItem
				key={page}
				onClick={handleOnClickVisitor}
			>
				<Typography
					textAlign="center" color="text.secondary" //JO WAS HERE
				>
					{page}
				</Typography>
			</MenuItem>
		);
	});

	const	LoggedUsers = pagesLogged.map((page) =>
	{
		return (
			<MenuItem
				key={page}
				onClick={handleOnClickLogged}
			>
				<Typography
					textAlign="center"
				>
					{page}
				</Typography>
			</MenuItem>
		);
	});

	return (
		<Box sx={boxStyleSmall}>
			<IconButton
				size="large"
				aria-label="account of current user"
				aria-controls="menu-appbar"
				// aria-aria-haspopup="true"
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
				(isLogged)
				? LoggedUsers
				: Visitors
			}
			</Menu>
		</Box>
	);
};

export default HamburgerMenu;
