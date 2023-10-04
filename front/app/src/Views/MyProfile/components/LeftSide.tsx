/* eslint-disable max-len */
import { Avatar, Typography } from "@mui/material";

type	LeftSideProps =
{
	status: string,
	pseudo: string,
	avatar: string | ((url: string) => string)
};

const	LeftSide = (props: LeftSideProps) =>
{
	return (
		<>
		<div className="left">
			<Avatar
				alt={props.pseudo}
				src={props.avatar}
				sx=
				{{
					width: 70,
					height: 70
				}}
			/>
			<Typography>
					{props.pseudo} is {props.status}
			</Typography>
		</div>
		</>
	);
};

export default LeftSide;
