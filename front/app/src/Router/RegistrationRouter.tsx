import {
	BrowserRouter,
	Route,
	Routes,
}	from "react-router-dom";
import Signup from "../Views/Signup/Signup";

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
					path="*"
					element={<Signup/>}
				/>
			</Routes>
		</BrowserRouter>
	);
};

export default RegistrationRouter;
