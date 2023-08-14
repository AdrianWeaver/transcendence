import { useAppDispatch, useAppSelector } from "../../Redux/hooks/redux-hooks";
import { resetRegistration } from "../../Redux/store/controllerAction";

export const	useAbortRequest = () =>
{
	const	registration = useAppSelector((state) =>
	{
		return (state.controller.registration);
	});
	const	dispatch = useAppDispatch();

	if (registration.startedRegister === true
		&& registration.abortRequested === true)
		dispatch(resetRegistration());
};
