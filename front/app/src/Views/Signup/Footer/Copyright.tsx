import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

const	Copyright = () =>
{
	return (
	<>
		<Typography
			variant="body2"
			color="text.secondary"
			align="center"
			sx={{mt: 5}}
		>
			<Link
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
