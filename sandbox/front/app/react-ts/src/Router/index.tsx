/* eslint-disable max-statements */
import {
	BrowserRouter,
	Route,
	Routes,
} from "react-router-dom";
import Signup from "../components/Signup/Signup";
import TheGame from "../components/TheGame/TheGame";
import ReduxViewTest from "../components/ReduxViewTest";
import Signin from "../views/Signin";
import Logout from "../views/Logout";
import useSignupStarted from "../hooks/useSignupStarted";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import { resetRegistration } from "../store/controllerAction";


const	LoggedRouter = () =>
{
	return (
		<BrowserRouter >
			<Routes>
				<Route path="/" element={<h1>home view</h1>} />
				<Route path="/redux-test-view" element={<ReduxViewTest/>} />
				{/* <Route path="/the-game" element={<TheGame />} />
				<Route path="/signup" element={<Signup />} />
				<Route path="/signin" element={<Signin />} /> */}
				{/* no save route navigation */}
				<Route path="/logout" element={<Logout/>} />
				<Route path="*" element={<h1>Error 404</h1>} />
			</Routes>
		</BrowserRouter>
	);
};

const	VisitorRouter = () =>
{
	return (
		<BrowserRouter >
			<Routes>
				{/* Saved route last navigation */}
				<Route path="/" element={<h1>home view</h1>} />
				<Route path="/redux-test-view" element={<ReduxViewTest/>} />
				{/* no save route navigation */}
				<Route path="/signup" element={<Signup />} />
				<Route path="/signin" element={<Signin />} />
				<Route path="*" element={<h1>Error 404</h1>} />
			</Routes>
		</BrowserRouter>
	);
};

// const	CancelSignup = () =>
// {
// 	const	registrationState = useAppSelector((state) =>
// 	{
// 		return (state.controller.registration);
// 	});

// 	const	dispatch = useAppDispatch();

// 	if (registrationState.startedRegister === true
// 		&& registrationState.abortRequested === true)
// 		dispatch(resetRegistration());
// 	return (<>canceling registration</>);
// };

const	RegistrationRouter = () =>
{
	return (
		<BrowserRouter >
			<Routes>
				<Route path="*" element={<Signup />} />
			</Routes>
		</BrowserRouter>
	);
};

// return (<CustomRouter />);

/**
 * Need the logged feature and conditions logics 
 *  value from the store redux
 * 
 */
const	MainRouter: React.FC = () =>
{
	const	controller = useAppSelector((state) =>
	{
		return (state.controller);
	});
	const	dispatch = useAppDispatch();
	if (controller.user.isLoggedIn)
		return (<LoggedRouter />);
	else
	{
		if (controller.registration.startedRegister === true
			&& !controller.registration.abortRequested)
				return (<RegistrationRouter />);
		return (<VisitorRouter />);
	}
};

export default	MainRouter;
