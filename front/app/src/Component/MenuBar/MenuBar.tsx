
import	AppBar from "@mui/material/AppBar";
import	Container from "@mui/material/Container";
import	Toolbar from "@mui/material/Toolbar";

import	AvatarMenu from "./AvatarMenu";
import	IconTitle from "./IconTitle";
import	HamburgerMenu from "./HamburgerMenu";
import	LargeMenu from "./LargeMenu";

import { useAppSelector } from "../../Redux/hooks/redux-hooks";
import LoginSignupButton from "./LoginSignupButton";


const	MenuBar = () =>
{
	let		jsxElementLogin;
	const	controllerState = useAppSelector((state) =>
	{
		return (state.controller);
	});

	if (controllerState.user.isLoggedIn)
		jsxElementLogin = <AvatarMenu />;
	else
		jsxElementLogin = <LoginSignupButton />;
	return (
		<AppBar position="static">
			<Container maxWidth="xl">
				<Toolbar disableGutters>
					<IconTitle display="hidde-small"/>
					<HamburgerMenu />
					<IconTitle display="hidde-medium" />
					<LargeMenu />
					{jsxElementLogin}
				</Toolbar>
			</Container>
		</AppBar>
	);
};

export default MenuBar;
