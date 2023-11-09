/* eslint-disable max-lines-per-function */
import {
	BrowserRouter,
	Navigate,
	Outlet,
	Route,
	Routes,
} from "react-router-dom";
import Home from "../Views/Home/Home";
import ReduxTestView from "../Views/ReduxTestView/ReduxTestView";
import BaseViewFromViteJs from "../Views/BaseViewFromVitejs/BaseViewFromViteJs";
import Logout from "../Views/Logout/Logout";
import MyProfile from "../Views/MyProfile/MyProfile";
import Settings from "../Views/Settings/Settings";
import PlayGame from "../Views/PlayGame/PlayGame";
import GameCanvas from "../Views/GameCanvas/GameCanvas";
import TestBall from "../Views/TestBall/TestBall";

import GameSetup from "../Views/GameSetup/GameSetup";

// import Chat from "../Views/Chat/Chat";
import { useAppSelector } from "../Redux/hooks/redux-hooks";
import { Landing } from "../Views/Chat/Landing";
import ChatLayout from "../Views/Chat/ChatLayout";
import { useDispatch } from "react-redux";
import ProfilePage from "../Views/MyProfile/ProfilePage";
import MyActiveGame from "../Views/MyActiveGame/MyActiveGame";


/**
 * This is the router for a logged user
 * */
const	LoggedRouter = () =>
{
	const	user = useAppSelector((state) =>
	{
		return (state.controller.user);
	});

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
					element={<Logout />}
				/>

				<Route
					path="/me/profile"
					element={<MyProfile />}
				/>

				<Route
					path="/profile"
					element={<ProfilePage />}
				/>

				<Route
					path="/me/settings"
					element={<Settings />}
				/>
				<Route
					path="/play-game"
					element={<TestBall />}
					// element={<PlayGame />}
				/>
				<Route
					path="/starter-pack"
					element={<BaseViewFromViteJs />}
				/>

				<Route
					path="/signin"
					element={<Navigate to="/"/>}
				/>
				<Route
					path="/signup"
					element={<Navigate to="/me/profile"/>}
				/>
				<Route
					path="the-game"
					element={<TestBall />}
					// element={<GameCanvas />}
				/>
				<Route
					path="game-setup"
					element={<GameSetup />}
				/>
				<Route
					path="test-ball"
					element={<TestBall />}
				/>
				<Route
					path="the-chat"
					element={<ChatLayout />}
				/>
				<Route
					path="the-chat-layout"
					element={<ChatLayout />}
				/>
				<Route
					path="my-active-games"
					element={<MyActiveGame />}
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
