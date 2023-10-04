/* eslint-disable max-len */
import { Typography } from "@mui/material";

type	InfosProps =
{
	lastName: string,
	firstName: string,
};

const	Infos = (props: InfosProps) =>
{
	return (
		<>
			<Typography variant="h4" component="h4">
				INFOS
			</Typography>
			<Typography>
				{props.firstName} {props.lastName}
			</Typography>
		</>
	);
};

export default Infos;
