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

type	CopyrightProps =
{
	uri: string
}

const	Copyright = (props: CopyrightProps) =>
{
	const	dispatch = useAppDispatch();
	const	navigate = useNavigate();
	const	url = props.uri + ":3001";
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
				// href={url}
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
