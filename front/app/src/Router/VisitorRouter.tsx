/* eslint-disable max-lines-per-function */
import
{
	BrowserRouter,
	Route,
	Routes,
}	from "react-router-dom";
import Signup from "../Views/Signup/Signup";
import CancelRegister from "../Views/Signup/CancelRegister";

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
					element={<h1>home view</h1>}
				/>
				<Route
					path="/redux-test-view"
					element={<p>{"<ReduxViewTest>"}</p>}
				/>

				{/* no save route navigation */}
				<Route
					path="/signup"
					element={<Signup />}
				/>
				<Route
					path="/signin"
					element={<p>{"<Signin />"}</p>}
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
