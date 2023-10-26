import { Grid } from "@mui/material";

export type	SpacerProps = {
	space: number
};

const	Spacer = (props: SpacerProps) =>
{
	return (
		<Grid item xs={props.space}></Grid>
	);
};

export default Spacer;
