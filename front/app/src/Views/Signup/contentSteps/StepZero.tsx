/* eslint-disable curly */
/* eslint-disable no-use-before-define */
/* eslint-disable max-len */
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
import { useLocation, useNavigate } from "react-router-dom";

import coalitionImage from "../assets/coalitions_v1.jpg";
import { checkQueryParams } from "../extras/checkQueryParams";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks/redux-hooks";
import { registerClientWithCode, userRegistrationStepTwo, verifyToken } from "../../../Redux/store/controllerAction";
import { useSavePrevPage } from "../../../Router/Hooks/useSavePrevPage";

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

const	StepZero = () =>
{
	const	query = useLocation();
	const	imgSource = coalitionImage;
	const	dispatch = useAppDispatch();
	const	navigate = useNavigate();
	const	savePrevPage = useSavePrevPage();

	const	abort = useAppSelector((state) =>
	{
		return (state.controller.registration.abortRequested);
	});

	useEffect(() =>
	{
		savePrevPage("/signin");
		if (abort === true)
		{
			
			navigate("/cancel");
		}
	}, [abort]);

	const	ftUrl = useAppSelector((state) =>
	{
		return (state.server.links.authApiUrl);
	});
	const
	[
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
		window.open(ftUrl, "_self");
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
	useEffect(() =>
	{
		if (responseQuery.code)
		{
			dispatch(registerClientWithCode(responseQuery.code));
		}
	}, [responseQuery])

	// eslint-disable-next-line eqeqeq
	useEffect(() =>
	{
		if (user.bearerToken !== "undefined" && user.bearerToken !== undefined && !user.alreadyExists)
		{
			dispatch(verifyToken());
			dispatch(userRegistrationStepTwo());
		}
	}, [user])


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

	// const	handleNoFt = () =>
	// {
	// 	dispatch(setFt(false));
	// 	axios
	// 	.post(uri + ":3000/user/register-forty-three")
	// 	.then((data) =>
	// 	{
	// 		dispatch(setUserData(data.data));
	// 		dispatch(userRegistrationStepTwo());
	// 	})
	// 	.catch((err) =>
	// 	{
	// 		console.error(err);
	// 	});
	// };
	useEffect(() =>
	{
		if (step === 0)
		{
			setRenderComponent(
				<>
					{/* ONLY TO HELP TEST FROM HOME */}
					{/* <Button onClick={handleNoFt}>Register without 42</Button> */}
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
				</>
			);
		}
		else
			setRenderComponent(<></>);
	}, [step]);

	return (renderComponent);
};

export default StepZero;
