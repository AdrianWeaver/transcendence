import
{
	useAppDispatch,
	useAppSelector
}	from "../../Redux/hooks/redux-hooks";

import { userRequestRegistration } from "../../Redux/store/controllerAction";

export const	useRedirectRegistration = () =>
{
	const	controller = useAppSelector((state) =>
	{
		return (state.controller);
	});
	const	dispatch = useAppDispatch();

	if (controller.registration.startedRegister === false
		&& controller.registration.step === 0)
		dispatch(userRequestRegistration());
};

// export default useRedirectRegistration;
