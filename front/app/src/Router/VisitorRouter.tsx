/* eslint-disable max-lines-per-function */
import
{
	BrowserRouter,
	Route,
	Routes,
}	from "react-router-dom";
import Signup from "../Views/Signup/Signup";
import CancelRegister from "../Views/CancelRegister/CancelRegister";
import ReduxTestView from "../Views/ReduxTestView/ReduxTestView";
import Home from "../Views/Home/Home";
import Signin from "../Views/Signin/Signin";
import BaseViewFromViteJs from "../Views/BaseViewFromVitejs/BaseViewFromViteJs";
import TheGame from "../Views/TheGame/TheGame";

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
				<Route
					path="/signin"
					element={<Signin />}
				/>

				<Route
					path="/starter-pack"
					element={<BaseViewFromViteJs />}
				/>

				{/* no save route navigation prevent loop */}
				<Route
					path="/signup"
					element={<Signup />}
				/>

				{/* Must be a protected route with abortRequested 
					cannot be acceced with no register before
				*/}
				<Route
					path="/cancel"
					element={<CancelRegister />}
				/>

				<Route
					path="/the-game"
					element={<TheGame/>}
				/>

				
				{/* show 404 when route not found */}
				<Route
					path="*"
					element={<h1>Error 404: visitor router</h1>}
				/>
			</Routes>
		</BrowserRouter>
	);
};

export default	VisitorRouter;
