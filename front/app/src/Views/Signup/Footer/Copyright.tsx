/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { useAppDispatch } from "../../../Redux/hooks/redux-hooks";
import {
	setAbortRequestedValue,
	setPreviousPage,
	setRequestHomeLink
} from "../../../Redux/store/controllerAction";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const	Copyright = () =>
{
	const	dispatch = useAppDispatch();
	const	navigate = useNavigate();

	const
	[
		alreadyClicked,
		setAlreadyClicked
	] = useState(false);

	const	handleClick = (event: React.MouseEvent<HTMLAnchorElement>) =>
	{
		event.preventDefault();
		if (alreadyClicked === false)
		{
			setAlreadyClicked(true);
			dispatch(setAbortRequestedValue(true));
			dispatch(setPreviousPage("/"));
			dispatch(setRequestHomeLink(true));
			navigate("/cancel");
		}
	};

	return (
	<>
		<Typography
			variant="body2"
			color="text.secondary"
			align="center"
			sx={{mt: 5}}
		>
			<Link
				onClick={handleClick}
				color="inherit"
				href="http://localhost:3001"
			>
				{"ft_transcendence "}
			</Link>
			{
				new Date().getFullYear()
			}
			{"."}
		</Typography>
	</>
	);
};

export default Copyright;
