import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import {setActiveView} from "../store/controllerAction";

const ReduxViewTest = () =>
{
	const	dispatch = useAppDispatch();
	const	activeView = useAppSelector((state) =>
	{
		return (state.controller.activeView);
	});
	const	handleClick = () =>
	{
		dispatch(setActiveView("ChangedToAnotherView"));
	};
	return (
		<div>
			<h1>ReduxViewTest : {activeView}</h1>
			<button type="button" onClick={handleClick}>
				Click to change view
			</button>
		</div>
	);
};

export default ReduxViewTest;
