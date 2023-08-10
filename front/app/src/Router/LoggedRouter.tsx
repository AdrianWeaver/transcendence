/* eslint-disable max-lines-per-function */
import {
	BrowserRouter,
	Route,
	Routes,
} from "react-router-dom";
import Home from "../Views/Home/Home";
import ReduxTestView from "../Views/ReduxTestView/ReduxTestView";
import BaseViewFromViteJs from "../Views/BaseViewFromVitejs/BaseViewFromViteJs";

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
					element={<Home />}
				/>
				<Route
					path="/redux-test-view"
					element={<ReduxTestView />}
				/>

				{/* no save route navigation */}
				<Route
					path="/logout"
					element={<p>{"<Logout>"}</p>}
				/>
				<Route
					path="/play-game"
					element={<p>{"<PlayGame>"}</p>}
				/>
				<Route
					path="/starter-pack"
					element={<BaseViewFromViteJs />}
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
