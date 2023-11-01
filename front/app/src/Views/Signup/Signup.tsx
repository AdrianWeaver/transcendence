/* eslint-disable max-len */
/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
import
{
	Box,
	Button,
	Container,
}	from "@mui/material";

import
{
	useRedirectRegistration
}	from "../../Router/Hooks/useRedirectRegistration";
import EscButton from "./Header/EscButton";
import { useAppSelector } from "../../Redux/hooks/redux-hooks";
import HeaderForm from "./Header/HeaderForm";
import Copyright from "./Footer/Copyright";
import StepOne from "./contentSteps/StepOne";
import StepTwo from "./contentSteps/StepTwo";
import HorizontalStepper from "./Header/HorizontalStepper";
import StepZero from "./contentSteps/StepZero";
import { useEffect } from "react";

const	styleMainBox = {
	marginTop: 8,
	display: "flex",
	flexDirection: "column",
	alignItems: "center"
};

const	Signup = () =>
{
	let		content;

	content= <></>;
	const	controllerState = useAppSelector((state) =>
	{
		return (state.controller);
	});
	const	redirectRegistration = useRedirectRegistration();
	const	stepper = controllerState.registration.step;

	useEffect(()=>
	{
		redirectRegistration();
	});

	if (stepper === 0)
		content = <StepZero />;
	else if (stepper === 1)
		content = <StepOne />;
	else if (stepper === 2)
		content = <StepTwo />;
	else
		content = <></>;
	return (
		<>
			<EscButton />
			<Container component="main" maxWidth="sm">
				<Box sx={styleMainBox}>
					<HeaderForm />
					<HorizontalStepper activeStep={stepper} />
				</Box>
				{ content }
				<Copyright />
			</Container>
		</>
	);
};

export default Signup;
