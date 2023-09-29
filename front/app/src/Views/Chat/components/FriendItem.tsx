
/* eslint-disable curly */
/* eslint-disable max-statements */
/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */

import { Avatar, ListItem, ListItemIcon, ListItemText } from "@mui/material";

type FriendItemProps = {
	name: string;
	avatar?: string;
	online?: boolean;
	key?: number;
};

const FriendItem = (props: FriendItemProps) =>
{
	const status = props.online ? "online 💚" : "🔴";

	return (
		<ListItem
			button
			key={props.key}
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
