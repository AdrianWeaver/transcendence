/* eslint-disable curly */
/* eslint-disable max-statements */
/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */

import
{
	Grid,
	ListItem,
	ListItemText,
	ListItemTextProps
} from "@mui/material";
import InvitationCard from "./InvitationCard";

declare module "@mui/material/ListItemText"
{
	interface ListItemTextProps {
		align?: "left" | "center" | "right";
	}
}

type MessageItemProps = {
	key?: number,
	align?: ListItemTextProps,
	sender: "me" | "other" | "server",
	message: string,
	date: string
};

const MessageItem = (props: MessageItemProps) => {
	let align: "right" | "center" | "left" | undefined;

	switch (props.sender)
	{
		case "me":
			align = "right";
			break;
		case "other":
			align = "left";
			break;
		case "server":
			align = "center";
			break;
		default:
			align = "center";
			break;
	}
	if (props.message === "!play pong" && props.sender === "server")
		return (
			<ListItem key={props.key}>
				<Grid container>
					<Grid item xs={12}>
						<ListItemText
							align={align}
							color="primary"
						>
							<InvitationCard />
						</ListItemText>
					</Grid>
					<Grid item xs={12}>
						<ListItemText
							align={align}
							secondary={props.date}
						>
						</ListItemText>
					</Grid>
				</Grid>
			</ListItem>
		);
	else
		return (
			<ListItem key={props.key}>
				<Grid container>
					<Grid item xs={12}>
						<ListItemText
							align={align}
							color="primary"
							primary={props.message}
						>
						</ListItemText>
					</Grid>
					<Grid item xs={12}>
						<ListItemText
							align={align}
							secondary={props.date}
						>
						</ListItemText>
					</Grid>
				</Grid>
			</ListItem>
		);
};

export default MessageItem;