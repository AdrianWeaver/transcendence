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
	avatar: string | ((url: string) => string)
};

const	Title = (props: TitleProps) =>
{
	const	navigate = useNavigate();

	const	savePrevPage = useSavePrevPage();
	const	controller = useAppSelector((state) =>
	{
		return (state.controller);
	});
	const	handleLeaveProfile = () =>
	{
		navigate(controller.previousPage);
	};
	// TEST
	return (
		<>
			<header className="chat__mainHeader">
				<Avatar
					alt={props.name}
					src={props.avatar}
					sx=
					{{
						width: 50,
						height: 50
					}}
				/>
				<Typography variant="h3">{props.name}'s profile</Typography>
				<button className="leaveProfile__btn"
					onClick={handleLeaveProfile}>
				X
				</button>
			</header>
		</>
	);
};


export default Title;
