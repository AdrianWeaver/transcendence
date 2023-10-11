/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../Redux/hooks/redux-hooks";
import { useSavePrevPage } from "../../../Router/Hooks/useSavePrevPage";
import LeftSide from "./LeftSide";
import { Avatar, Typography } from "@mui/material";

type	TitleProps =
{
	name: string,
};

const	Title = (props: TitleProps) =>
{
	const	navigate = useNavigate();

	// const	savePrevPage = useSavePrevPage();
	let	prevPage: string;

	prevPage= useAppSelector((state) =>
	{
		return (state.controller.previousPage);
	});
	if (prevPage === "/me/profile")
		prevPage = "/";
	const	handleLeaveProfile = () =>
	{
		navigate(prevPage);
	};
	// TEST
	return (
		<>
			<header className="chat__mainHeader">
				<Typography variant="h3">
					{props.name}'s profile
				</Typography>
			</header>
				<button className="leaveProfile__btn"
					onClick={handleLeaveProfile}>
				Leave profile
				</button>
		</>
	);
};


export default Title;
