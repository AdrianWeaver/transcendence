/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
import {
	Alert,
	AlertTitle,
	Card,
	CardActionArea,
	CardContent,
	CardMedia,
	LinearProgress,
	Typography,
}	from "@mui/material";
import { useEffect, useState } from "react";
import { redirect, useLocation } from "react-router-dom";

import coalitionImage from "../assets/coalitions_v1.jpg";
import { checkQueryParams } from "../extras/checkQueryParams";

const	getText = () =>
{
	return (
		"Afin de pouvoir vous connecter a transcendence vous devez "
		+ "pouvoir vous connecter a votre compte etudiant");
};

type	linkIntraModel = {
	message?: string,
	error?: string,
	code?: string,
	errorDescription?: string,
	redirected?: boolean
};

const	AlertComponent = (responseQuery: linkIntraModel) =>
{
	let	alertInfo;

	if (responseQuery.message)
		alertInfo = (
			<>
				<Alert severity="info">
					{
						responseQuery.message
					}
				</Alert>
			</>
		);
	if (responseQuery.error)
		alertInfo = (
			<>
				<Alert severity="error">
					<AlertTitle>
						{
							responseQuery.error
						}
					</AlertTitle>
					{
						responseQuery.errorDescription
					}
				</Alert>
			</>
		);
	if (responseQuery.code)
			alertInfo = (
				<>
					<Alert severity="success">
						Checking connection to server...
					</Alert>
					<LinearProgress />
				</>
			);
	return (alertInfo);
};


const	locationIsARedirectedPage = (pathname: string) =>
{
	if (pathname)
		if (pathname === "/signup")
			return (false);
		else
			return (true);
	return (true);
};

const	StepZero = () =>
{
	const	query = useLocation();
	const	imgSource = coalitionImage;

	const	[
		visible,
		setVisible
	] = useState(locationIsARedirectedPage(query.pathname));


	const	url = "https://api.intra.42.fr";
	const	openSameTab = () =>
	{
		window.open(url, "_self");
	};

	useEffect(() =>
	{
		const timer = setTimeout(() =>
		{
			console.log("Just set visible to false");
			setVisible(false);
		}, 3000);
		return (() =>
		{
			clearTimeout(timer);
		});
	});

	const	displayRedirect = (<>
		<Alert severity="warning">
			Veuillez continuer les etapes.
			Vous venez d'etre redirige
		</Alert>
	</>);

	const	responseQuery = checkQueryParams(query);
	const	alertInfo = AlertComponent(responseQuery);

	console.log("Redirected Query", responseQuery.redirected);

	return (
		<Card sx={{ m: 5}}>
			<CardActionArea
				onClick={openSameTab}
			>
				<CardMedia
					component="img"
					height="140"
					image={imgSource}
					alt="Image of intranet"
					/>
					<CardContent>
						<Typography
							gutterBottom
							variant="h5"
							component="div"
						>
							Connexion intra 42
						</Typography>
						<Typography
							variant="body2"
							color="text.secondary"
						>
							{
								getText()
							}
						</Typography>
					</CardContent>
			</CardActionArea>
			{(visible) ? displayRedirect : <></>}
			{alertInfo}
		</Card>
	);
};

export default StepZero;
