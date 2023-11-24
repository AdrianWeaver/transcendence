/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
import
{
	BrowserRouter,
	Navigate,
	Route,
	Routes,
	useNavigate,
}	from "react-router-dom";
import Signup from "../Views/Signup/Signup";
import CancelRegister from "../Views/CancelRegister/CancelRegister";
import ReduxTestView from "../Views/ReduxTestView/ReduxTestView";
import Home from "../Views/Home/Home";
import Signin from "../Views/Signin/Signin";
import BaseViewFromViteJs from "../Views/BaseViewFromVitejs/BaseViewFromViteJs";
// import Chat from "../Views/Chat/Chat";
// import ChatLayout from "../Views/Chat/ChatLayout";
import MyStats from "../Views/MyStats/MyStats";
import SigninDoubleAuth from "../Views/Signin/SigninDoubleAuth";
import { persistor } from "../Redux/store";
import { useSavePrevPage } from "./Hooks/useSavePrevPage";


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
					path="/signin-double-auth"
					element={<SigninDoubleAuth />}
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
					path="the-chat"
					element={<Navigate to="/"/>}
				/>
				<Route
					path="/my-stats"
					element={<MyStats />}
				/>
				<Route
					path="/undefined"
					element={<UndefinedHandler/>}
				/>
				<Route
					path="*"
					element={<Navigate to="/"/>}
				/>


			</Routes>
		</BrowserRouter>
	);
};

export default	VisitorRouter;
