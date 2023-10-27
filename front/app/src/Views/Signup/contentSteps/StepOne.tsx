/* eslint-disable max-lines-per-function */
/* eslint-disable curly */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-statements */
/* eslint-disable max-len */
import { useState } from "react";
import { useAppSelector } from "../../../Redux/hooks/redux-hooks";
import FirstStepFormContent from "./FirstStepFormContent";
import FirstStepFormContentNoData from "./FirstStepFormContentNoData";

const	StepOne = () =>
{
	const	user = useAppSelector((state) =>
	{
		return (state.controller.user);
	});

	return (
		<>
			{
				(user.email && user.firstName && user.lastName && user.username)
				? <FirstStepFormContent
					username={user.username}
					email={user.email}
					firstName={user.firstName}
					lastName={user.lastName} />
				: <FirstStepFormContentNoData />
			}
		</>
	);
};

export default StepOne;
