/* eslint-disable max-statements */
import { useNavigate } from "react-router-dom";
import MenuBar from "../../Component/MenuBar/MenuBar";
import { useAppSelector } from "../../Redux/hooks/redux-hooks";
import { useDispatch } from "react-redux";
import { ContactsOutlined } from "@mui/icons-material";
import { logOffUser } from "../../Redux/store/controllerAction";
import { Button } from "@mui/material";

const	Logout = () =>
{
	const	navigate = useNavigate();
	const	controller = useAppSelector((state) =>
	{
		return (state.controller);
	});
	const	dispatch = useDispatch();

	const	logUserOut = () =>
	{
		dispatch(logOffUser());
		navigate("/");
	};

	return (
		<>
			<MenuBar />
			<Button onClick={logUserOut}>Log out</Button>
		</>
	);
};

export default Logout;
