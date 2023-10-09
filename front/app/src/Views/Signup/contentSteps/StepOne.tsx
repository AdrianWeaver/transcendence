import { useAppSelector } from "../../../Redux/hooks/redux-hooks";
import FirstStepFormContent from "./FirstStepFormContent";

const	StepOne = () =>
{
	const	controller = useAppSelector((state) =>
	{
		return (state.controller);
	});
	return (
		<>
			<FirstStepFormContent
				username={controller.user.username}
				email={controller.user.email}
				firstName="Johanna"
				lastName="Courtois" />
		</>
	);
};

export default StepOne;
