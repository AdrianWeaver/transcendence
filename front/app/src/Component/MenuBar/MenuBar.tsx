/* eslint-disable max-lines-per-function */

import	AppBar from "@mui/material/AppBar";
import	Container from "@mui/material/Container";
import	Toolbar from "@mui/material/Toolbar";

import	AvatarMenu from "./AvatarMenu";
import	IconTitle from "./IconTitle";
import	HamburgerMenu from "./HamburgerMenu";
import	LargeMenu from "./LargeMenu";

import { useAppSelector } from "../../Redux/hooks/redux-hooks";
import LoginSignupButton from "./LoginSignupButton";
import { useDispatch } from "react-redux";
import { setCurrentProfile } from "../../Redux/store/controllerAction";


const	MenuBar = () =>
{
	const	controllerState = useAppSelector((state) =>
	{
		return (state.controller);
	});

	return (
		<AppBar position="static">
			<Container maxWidth="xl">
				<Toolbar disableGutters>
					<IconTitle display="hidde-small"/>
					<HamburgerMenu />
					<IconTitle display="hidde-medium" />
					<LargeMenu />
					{
						(controllerState.user.isLoggedIn)
						? <AvatarMenu />
						: <LoginSignupButton />
					}
				</Toolbar>
			</Container>
		</AppBar>
	);
};

export default MenuBar;
