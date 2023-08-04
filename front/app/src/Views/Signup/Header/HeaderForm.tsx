import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Avatar, Typography } from "@mui/material";

const	HeaderForm = () =>
{
	return (
		<>
			<Avatar sx={
			{
				m: 1,
				bgcolor: "secondary.main"
			}}
			>
				<LockOutlinedIcon />
			</Avatar>
			<Typography component="h1" variant="h5">
				S'enregistrer
			</Typography>
		</>
	);
};

export default HeaderForm;
