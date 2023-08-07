/* eslint-disable max-lines-per-function */
import
{
	BrowserRouter,
	Route,
	Routes,
}	from "react-router-dom";
import Signup from "../Views/Signup/Signup";
import CancelRegister from "../Views/Signup/CancelRegister";
import ReduxTestView from "../Views/ReduxTestView/ReduxTestView";
import Home from "../Views/Home/Home";
import Signin from "../Views/Signin/Signin";

/**
 * This is unauth router
 * 
 */
const	VisitorRouter = () =>
{
	return (
		<BrowserRouter >
			<Routes>
				{/* Saved route last navigation */}
				<Route
					path="/"
					element={<Home />}
				/>
				<Route
					path="/redux-test-view"
					element={<ReduxTestView />}
				/>

				{/* no save route navigation */}
				<Route
					path="/signup"
					element={<Signup />}
				/>
				<Route
					path="/signin"
					element={<Signin />}
				/>

				{/* Must be a protected route with abortRequested 
					cannot be acceced with no register before
				*/}
				<Route
					path="/cancel"
					element={<CancelRegister />}
				/>
				<Route
					path="*"
					element={<h1>Error 404: visitor router</h1>}
				/>
			</Routes>
		</BrowserRouter>
	);
};

export default	VisitorRouter;
