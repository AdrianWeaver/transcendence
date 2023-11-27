/* eslint-disable semi */
/* eslint-disable max-len */
/* eslint-disable max-statements */
import { useEffect } from "react";
import MenuBar from "../../Component/MenuBar/MenuBar";
import { useSavePrevPage } from "../../Router/Hooks/useSavePrevPage";
import { Box, Typography, CardMedia } from "@mui/material";
import React from "react";

const	Home: React.FC = () =>
{
	const	savePrevPage = useSavePrevPage();

	useEffect(() =>
	{
		savePrevPage("/");
	}, []);


	const header = <MenuBar />;

	const body = (
		<>
			<Box sx={{ mt: "1.875rem", align: "center"}}></Box>
			<Typography variant="h2" fontSize= "2.5rem" fontWeight= "bold" align="center" marginRight=".75rem" marginLeft=".75rem">Welcome to our <br/>ft_transcendence project !</Typography>
			<Typography variant="h3" fontSize= "1.625rem" align="center" padding="1.375rem">Which was made with love and tears by<br/>alambert, apayet, jcourtoi and nboratko</Typography>
			<Typography variant="h3" fontSize= ".875rem" align="center" padding=".75rem">(here's a picture of a kitten)</Typography>
			<Box sx={{ display: "block", mt: "20px"}}>
				<center>
					<img height="450px" src="https://images.ctfassets.net/sfnkq8lmu5d7/1NaIFGyBn0qwXYlNaCJSEl/ad59ce5eefa3c2322b696778185cc749/2021_0825_Kitten_Health.jpg?w=1000&h=750&q=70&fm=webp" alt="Kitten"/>
				</center>
			</Box>
		</>);

	return (
		<>
			{header}
			{body}
		</>
	);
};

export default Home;
