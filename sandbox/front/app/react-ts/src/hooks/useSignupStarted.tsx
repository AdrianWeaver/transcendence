import
{
	useLocation,
	useNavigate
}	from "react-router-dom";
import
{
	useAppSelector
}	from "./redux-hooks";
import
{
	useEffect
}	from "react";

const	useSignupStarted = () =>
{
	const	navigate = useNavigate();
	const	location = useLocation();
	const	registrationState = useAppSelector((state) =>
	{
		return (state.controller.registration);
	});

	useEffect(() =>
	{
		if (registrationState.startedRegister === true
			&& registrationState.abortRequested === false
			&& location.pathname !== "/signup")
			// navigate("/signup");
			console.log("Hello");
	},
	[
		navigate,
		location,
		registrationState
	]);
};

export default useSignupStarted;
