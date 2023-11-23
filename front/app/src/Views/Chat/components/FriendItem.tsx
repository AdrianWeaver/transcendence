
/* eslint-disable curly */
/* eslint-disable max-statements */
/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */

import { Avatar, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { useAppSelector } from "../../../Redux/hooks/redux-hooks";

type FriendItemProps = {
	name: string;
	avatar?: string;
	online?: boolean;
	status?: string;
	// key?: React.Key;
	ind?: number;
	isFriend?: boolean;
};

/**
 * @deprecated
 * @param props 
 * @returns 
 */
const FriendItem = (props: FriendItemProps) =>
{
	return (<></>);
	let status;
	console.log(" FRIEND ITEM ", props);
	status = props.online ? "💚" : "🔴";
	if (props.status === "playing" && props.online)
		status = "🏓";
	return (
		<ListItem key={props.key}>
		{/* <ListItem > */}
			<ListItemIcon>
				<Avatar
					alt={props.name}
					src={props.avatar}
				/>
			</ListItemIcon>
			<ListItemText primary={props.name}>
				{props.name}
			</ListItemText>
			{
				(props.isFriend)
				? <ListItemText
						secondary={status}
						sx={{ align: "right" }}
				></ListItemText>
				: <></>
			}
		</ListItem>
	);
};

export default FriendItem;
