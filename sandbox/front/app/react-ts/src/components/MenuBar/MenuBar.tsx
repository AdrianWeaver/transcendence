import	AppBar from "@mui/material/AppBar";
import	Container from "@mui/material/Container";
import	Toolbar from "@mui/material/Toolbar";

import	AvatarMenu from "./AvatarMenu";
import	IconTitle from "./IconTitle";
import	HamburgerMenu from "./HamburgerMenu";
import	LargeMenu from "./LargeMenu";


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
