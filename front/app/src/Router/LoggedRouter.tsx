/* eslint-disable max-lines-per-function */
import {
	BrowserRouter,
	Navigate,
	Route,
	Routes,
} from "react-router-dom";
import Home from "../Views/Home/Home";
import ReduxTestView from "../Views/ReduxTestView/ReduxTestView";
import BaseViewFromViteJs from "../Views/BaseViewFromVitejs/BaseViewFromViteJs";
import Logout from "../Views/Logout/Logout";
import MyProfile from "../Views/MyProfile/MyProfile";
import Settings from "../Views/Settings/Settings";

import TestBall from "../Views/TestBall/TestBall";

import GameSetup from "../Views/GameSetup/GameSetup";


import ChatLayout from "../Views/Chat/ChatLayout";
import ProfilePage from "../Views/MyProfile/ProfilePage";
import MyActiveGame from "../Views/MyActiveGame/MyActiveGame";
import MyStats from "../Views/MyStats/MyStats";
import Stats from "../Views/MyStats/OtherUserStats";
import GlobalStats from "../Views/MyStats/GlobalStats";
import Signin from "../Views/Signin/Signin";
import SigninDoubleAuth from "../Views/Signin/SigninDoubleAuth";
import { NavigationTwoTone } from "@mui/icons-material";
import MyAchievements from "../Views/Achievements/MyAchievements";
import Achievements from "../Views/Achievements/Achievements";
import CancelRegister from "../Views/CancelRegister/CancelRegister";


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
					path="/signin-double-auth"
					element={<NavigationTwoTone to ="/" />}
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
					path="/my-stats"
					element={<MyStats />}
				/>
				<Route
					path="/stats"
					element={<Stats />}
				/>
				<Route
					path="/global-stats"
					element={<GlobalStats />}
				/>
				<Route
					path="/my-achievements"
					element={<MyAchievements />}
				/>
				<Route
					path="/achievements"
					element={<Achievements />}
				/>
				<Route
					path="/cancel"
					element={<CancelRegister />}
				/>
				<Route
					path="*"
					element={<Navigate to="/"/>}
				/>
			</Routes>
		</BrowserRouter>
	);
};

export default	LoggedRouter;
