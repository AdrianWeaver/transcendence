
/* eslint-disable curly */
/* eslint-disable max-statements */
/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */

import { Avatar, ListItem, ListItemIcon, ListItemText } from "@mui/material";

type FriendItemProps = {
	name: string;
	avatar?: string;
	online?: boolean;
	status?: string;
	key?: number;
	ind?: number;
};

const FriendItem = (props: FriendItemProps) =>
{
	let status;

	status = props.online ? "online 💚" : "🔴";
	if (props.status === "playing" && props.online)
		status = "playing.. 🏓";
	return (
		<ListItem
			button
			key={props.ind}
		>
			<ListItemIcon>
				<Avatar
					alt={props.name}
					src={props.avatar}
				/>
			</ListItemIcon>
			<ListItemText primary={props.name}>
				{props.name}
			</ListItemText>
			<ListItemText
				secondary={status}
				sx={{ align: "right" }}
			>
			</ListItemText>
		</ListItem>
	);
};

export default FriendItem;
