/* eslint-disable max-len */
import { Typography } from "@mui/material";

type	LeftSideProps =
{
	status: string,
	pseudo: string,
	lastName: string,
	firstName: string,
};

const	LeftSide = (props: LeftSideProps) =>
{
	return (
		<>
			<Typography variant="h4" component="h4">
				INFORMATIONS
			</Typography>
			<Typography>
				Pseudo: {props.pseudo} is {props.status}
			</Typography>
			<Typography>
				Fullname: {props.firstName} {props.lastName}
			</Typography>
		</>
	);
};

export default LeftSide;
