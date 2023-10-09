/* eslint-disable max-len */
import { Avatar, Typography } from "@mui/material";
import MyAvatar from "./MyAvatar";

type	LeftSideProps =
{
	status: string,
	pseudo: string,
	imageUrl: string | ((url: string) => string)
	defaultUrl: string
};

const	LeftSide = (props: LeftSideProps) =>
{
	return (
		<>
		<div className="left">
			<MyAvatar
				pseudo={props.pseudo}
				defaultUrl={props.defaultUrl}
				imageUrl={props.imageUrl} />
			<Typography>
					{props.pseudo} is {props.status}
			</Typography>
		</div>
		</>
	);
};

export default LeftSide;
