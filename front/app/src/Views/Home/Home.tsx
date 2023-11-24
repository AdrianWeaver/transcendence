/* eslint-disable semi */
/* eslint-disable max-len */
/* eslint-disable max-statements */
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
	}, []);


	const header = <MenuBar />;

	const body = (
		<>
			<Typography variant="h2" align="center" marginTop="1.875rem" marginRight=".75rem" marginLeft=".75rem" fontSize="2.5rem" fontWeight="bold">Welcome to our <br/>ft_transcendence project !</Typography>
			<Typography variant="h3" align="center" padding="1.375rem" fontSize="1.625rem">Which was made with love and tears by<br/>alambert, apayet, jcourtoi and nboratko</Typography>
			<Typography variant="h3" align="center" padding=".75rem" fontSize=".875rem" >(here's a picture of a kitten)</Typography>
			<center>
				<img display= "block" marginTop="20px" height="450px" src="https://images.ctfassets.net/sfnkq8lmu5d7/1NaIFGyBn0qwXYlNaCJSEl/ad59ce5eefa3c2322b696778185cc749/2021_0825_Kitten_Health.jpg?w=1000&h=750&q=70&fm=webp" alt="Kitten"/>
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
