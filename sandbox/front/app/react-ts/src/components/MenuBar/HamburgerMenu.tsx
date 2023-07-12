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
import pages from "./config/PagesItem";

const	boxStyleSmall = {
	flexGrow: 1,
	display: displayStyle.mediumHidden,
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

export default HamburgerMenu;
