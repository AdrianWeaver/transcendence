/* eslint-disable curly */
/* eslint-disable no-use-before-define */
/* eslint-disable max-len */
/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
import {
	Alert,
	AlertTitle,
	Button,
	Card,
	CardActionArea,
	CardContent,
	CardMedia,
	LinearProgress,
	Typography,
}	from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import coalitionImage from "../assets/coalitions_v1.jpg";
import { checkQueryParams } from "../extras/checkQueryParams";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks/redux-hooks";
import { registerClientWithCode, setRegistrationProcessStart, setUserData, userRegistrationStepTwo, verifyToken } from "../../../Redux/store/controllerAction";
import { UserModel } from "../../../Redux/models/redux-models";

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
						Creation of your account information...
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

const	getUrlFT = () =>
{
	return ("https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-8aa9db498628bfc0f7404bee5a48f6b5da74bd58af97184135e3e1018af58563&redirect_uri=http%3A%2F%2Flocalhost%3A3001&response_type=code");
};

const	StepZero = () =>
{
	const	query = useLocation();
	const	imgSource = coalitionImage;
	const	dispatch = useAppDispatch();

	const	[
		visible,
		setVisible
	] = useState(locationIsARedirectedPage(query.pathname));

	const	user = useAppSelector((state) =>
	{
		return (state.controller.user);
	});

	const	step = useAppSelector((state) =>
	{
		return (state.controller.registration.step);
	});

	const
	[
		renderComponent,
		setRenderComponent,
	]	= useState(<></>);

	const
	[
		displayRedirect,
		setDiplayRedirect
	] = useState(<></>);

	const	openSameTab = () =>
	{
		window.open(getUrlFT(), "_self");
	};

	useEffect(() =>
	{
		const timer = setTimeout(() =>
		{
			setVisible(false);
		}, 3000);
		return (() =>
		{
			clearTimeout(timer);
		});
	});

	const	responseQuery = checkQueryParams(query);
	const	alertInfo = AlertComponent(responseQuery);
	if (responseQuery.code)
	{
		dispatch(registerClientWithCode(responseQuery.code));
	}
	if (user.bearerToken !== "undefined")
	{
		dispatch(verifyToken());
		dispatch(userRegistrationStepTwo());
	}

	useEffect(() =>
	{
		if (visible)
			setDiplayRedirect(
				<>
					<Alert severity="warning">
						Veuillez continuer les etapes.
						Vous venez d'etre redirige
					</Alert>
				</>
			);
	}, [visible]);

	useEffect(() =>
	{
		if (step === 0)
		{
			setRenderComponent(
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
					{displayRedirect}
					{alertInfo}
				</Card>
			);
		}
		else
			setRenderComponent(<></>);
	},
	[
		step,
	]);
	return (
		renderComponent
	);
};

export default StepZero;
