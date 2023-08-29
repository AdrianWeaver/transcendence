import { useEffect } from "react";
import MenuBar from "../../Component/MenuBar/MenuBar";
import { useSavePrevPage } from "../../Router/Hooks/useSavePrevPage";
import { Typography } from "@mui/material";

const	Home = () =>
{
	const	savePrevPage = useSavePrevPage();

	useEffect(() =>
	{
		savePrevPage("/");
	});

	return (
		<>
			<MenuBar />
			<Typography variant="h4" color="text.secondary">
				Home
			</Typography>
		</>
	);
};

export default Home;
