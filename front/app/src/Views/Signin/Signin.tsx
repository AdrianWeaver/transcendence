import { useEffect } from "react";
import { useSavePrevPage } from "../../Router/Hooks/useSavePrevPage";
import MenuBar from "../../Component/MenuBar/MenuBar";
import { Typography } from "@mui/material";

const	Signin = () =>
{
	const	savePrevPage = useSavePrevPage();

	useEffect(() =>
	{
		savePrevPage("/signin");
	});

	return (
		<>
			<MenuBar />
			<Typography color="text.secondary">Signin</Typography>
		</>
	);
};

export default Signin;
