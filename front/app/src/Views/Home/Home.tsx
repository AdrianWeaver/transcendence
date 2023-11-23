/* eslint-disable semi */
/* eslint-disable max-len */
/* eslint-disable max-statements */
import { useEffect } from "react";
import MenuBar from "../../Component/MenuBar/MenuBar";
import { useSavePrevPage } from "../../Router/Hooks/useSavePrevPage";
import { Avatar, Typography } from "@mui/material";
import { Image } from "@mui/icons-material";

const	Home = () =>
{
	const	savePrevPage = useSavePrevPage();

	// dispatch(verifyTokenAnonymousUser());
	useEffect(() =>
	{
		savePrevPage("/");
	}, []);


	const header = <MenuBar />;

	const body = (
		<>
			<Typography variant="h2" align="center">Welcome to our ft_transcendence project !</Typography>
			<Typography variant="h3" align="center">It was made with love and tears by alambert, apayet, jcourtoi and nboratko.</Typography>
			<Typography variant="h3" align="center">Here is a picture of a kitten:</Typography>
			<center>
				<img src="https://images.ctfassets.net/sfnkq8lmu5d7/1NaIFGyBn0qwXYlNaCJSEl/ad59ce5eefa3c2322b696778185cc749/2021_0825_Kitten_Health.jpg?w=1000&h=750&q=70&fm=webp" alt="Kitten"/>
			</center>
		</>);

	return (
		<>
			{header}
			{body}
		</>
	);
};

export default Home;
