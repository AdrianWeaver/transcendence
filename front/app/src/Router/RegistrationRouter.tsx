/* eslint-disable max-statements */
import {
	BrowserRouter,
	Navigate,
	Route,
	Routes,
	useNavigate,
}	from "react-router-dom";
import Signup from "../Views/Signup/Signup";
import { useSavePrevPage } from "./Hooks/useSavePrevPage";
import { persistor } from "../Redux/store";
import CancelRegister from "../Views/CancelRegister/CancelRegister";

const	UndefinedHandler = () =>
{
	const	savePrevPage = useSavePrevPage();
	const	navigate = useNavigate();

	savePrevPage("/signin");
	setTimeout(() =>
	{
		persistor.purge();
		navigate("/signin");
	}, 1500);
	return (<>redirection vous etes deja enregistre</>);
};

/**
 * The registration router redirect always on signup until esc
 * or locatioon storage cleaned
 */
const	RegistrationRouter = () =>
{
	return (
		<BrowserRouter >
			<Routes>
				<Route
					path="/undefined"
					element={<UndefinedHandler/>}
				/>
					<Route
					path="/cancel"
					element={<CancelRegister />}
				/>
				<Route
					path="*"
					element={<Signup/>}
				/>
			</Routes>
		</BrowserRouter>
	);
};

export default RegistrationRouter;
