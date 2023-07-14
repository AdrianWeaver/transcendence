/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
import {

	Alert,
	AlertTitle,
	Box,
	Button,
	Card,
	CardActionArea,
	CardContent,
	CardMedia,
	Container,
	LinearProgress,
	Step,
	StepLabel,
	Stepper,
	Typography,
} from "@mui/material";
import Copyright from "./Copyright";


import HeaderForm from "./HeaderForm";
import FirstStepFormContent from "./FirstStepFormContent";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks";
import { userRequestRegistration } from "../../store/controllerAction";
import { useLocation } from "react-router-dom";
import { useState } from "react";

const	styleMainBox = {
	marginTop: 8,
	display: "flex",
	flexDirection: "column",
	alignItems: "center"
};

type	HorizontalStepperProps = {
	activeStep: number
};

const	steps = [
	"Informations Generales",
	"Couplage Intra 42",
	"Securite"
];

const	HorizontalStepper = (props: HorizontalStepperProps) =>
{
	return (
		<Box
			sx={
			{
				width: "100%",
				m: 2
			}}
		>
			<Stepper activeStep={props.activeStep}>
			{
				steps.map((step) =>
				{
					return (
						<Step key={step}>
							<StepLabel>{step}</StepLabel>
						</Step>
					);
				})
			}
			</Stepper>
		</Box>
	);
};

const	checkQuery = (query: string) =>
{
	let		buffer;
	let		error;
	let		message;

	buffer = query.split("?");
	if (buffer.length === 1)
	{
		console.log("no response - not clicked yet");
		return (
			{
				message:
				"Veuillez cliquez, vous allez etres redirige"
					+ " sur la page de connexion"
			});
	}
	buffer = buffer[1];
	const	params = buffer.split("&");
	if (params.length === 2)
	{
		console.log("response error append", params);
		if (params[0].split("=").length !== 2)
			error = {error: "malformed_query"};
		else
			error = {error: params[0].split("=")[1]};
		if (params[1].split("=").length !== 2)
			console.log("malformed");
		else
			error = {
				...error,
				errorDescription: params[1].split("=")[1].split("+").join(" ")
			};
		console.log("Results error", error);
		return (error);
	}
	else if (params.length === 1)
	{
		console.log("Code is provied");
		if (params[0].split("=").length !== 2)
			message = {error: "malformed_query"};
		else
			message = { code: params[0].split("=")[1]};
		console.log("Response parsed ", message);
		return (message);
	}
	else
	{
		console.log("Something went wrong");
		return ({
			error: "malformed_query",
		});
	}
};

const	SecondStepForm = () =>
{
	let		alertInfo;
	const	[
		codeApi,
		setCodeApi
	] = useState("unsetted");
	const	imgSource
	= "https://placehold.co/345x140?text=Change+me+UX+Click-here";

	const	url = "https://api.intra.42.fr/oauth/a";
	const	openInNewTab = () =>
	{
		// need to get proper url from server
		window.open(url, "_self");
	};

	const	query = useLocation();
	// const	code = queryParams.get();
	const	responseQuery = checkQuery(query.search);
	console.info("Params", responseQuery);
	if (responseQuery.message)
		alertInfo = (
			<Alert severity="info">
				{ responseQuery.message}
			</Alert>);
	if (responseQuery.error )
		alertInfo = (
			<Alert severity="error">
				<AlertTitle>
					{responseQuery.error}
				</AlertTitle>
				{responseQuery.errorDescription}
			</Alert>);
	if (responseQuery.code)
	{
			alertInfo = (
				<>
					<Alert severity="success">
						Checking connection to server...
					</Alert>
					<LinearProgress />
				</>
			);
	}
	return (
		<Card sx={{ m: 5}}>
			<CardActionArea
				onClick={openInNewTab}
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
								"Afin de pouvoir profiter pleinement de "
								+ " toutes les fonctionnalites de "
								+ " Transcendence il est nescessaire"
								+ " de se connecter"
								+ " a l'intra de 42"
							}
						</Typography>
					</CardContent>
			</CardActionArea>
			{alertInfo}
		</Card>
	);
};

const	Signup = () =>
{
	let		rendering;
	const	dispatch = useAppDispatch();
	const	controllerState = useAppSelector((state) =>
	{
		return (state.controller);
	});
	if (controllerState.registration.startedRegister === false)
		if (controllerState.registration.step === 0)
			dispatch(userRequestRegistration());
	const stepper = controllerState.registration.step;
	if (stepper === 0)
		rendering = <FirstStepFormContent />;
	if (stepper === 1)
		rendering = <SecondStepForm/>;

	return (
		<>
			<Container component="main" maxWidth="xs">
				<Box sx={styleMainBox}>
					<HeaderForm />
					<HorizontalStepper activeStep={stepper} />
				</Box>
				{
					rendering
				}
				<Copyright />
			</Container>
		</>
	);
};

export default Signup;
