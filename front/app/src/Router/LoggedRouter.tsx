/* eslint-disable max-lines-per-function */
import {
	BrowserRouter,
	Route,
	Routes,
} from "react-router-dom";

/**
 * This is the router for a logged user
 * */
const	LoggedRouter = () =>
{
	return (
		<BrowserRouter >
			<Routes>
				{/* need to save route navigation */}
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
					path="/logout"
					element={<p>{"<Logout>"}</p>}
				/>
				<Route
					path="*"
					element={<h1>Error 404: Logged User</h1>}
				/>
			</Routes>
		</BrowserRouter>
	);
};

export default	LoggedRouter;
