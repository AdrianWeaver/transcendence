import {
	BrowserRouter,
	Route,
	Routes,
} from "react-router-dom";
import { useAppSelector } from "../hooks/redux-hooks";
import Signup from "../components/Signup/Signup";
import TheGame from "../components/TheGame/TheGame";
import ReduxViewTest from "../components/ReduxViewTest";
import Signin from "../views/Signin";
import Logout from "../views/Logout";

const	CustomRouter = () =>
{
	return (
		<BrowserRouter >
			<Routes>
				<Route path="/" element={<h1>home view</h1>} />
				<Route path="/redux-test-view" element={<ReduxViewTest/>} />
				<Route path="/the-game" element={<TheGame />} />
				<Route path="/signup" element={<Signup />} />
				<Route path="/signin" element={<Signin />} />
				<Route path="/logout" element={<Logout/>} />
				<Route path="*" element={<h1>Error 404</h1>} />
			</Routes>
		</BrowserRouter>
	);
};

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

/**
 * Need the logged feature and conditions logics 
 *  value from the store redux
 * 
 */
const	MainRouter: React.FC = () =>
{
	const	registrationStarted = useAppSelector((state) =>
	{
		return (state.controller.registration.startedRegister);
	});
	if (registrationStarted)
		return (<RegistrationRouter />);
	else
		return (<CustomRouter />);
};

export default MainRouter;
