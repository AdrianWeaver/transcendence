/* eslint-disable curly */
/* eslint-disable max-statements */
/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */

import
{
	Grid,
	ListItem,
	ListItemText,
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
	ind?: number,
	// align?: ListItemTextProps,
	sender: "me" | "other" | "server",
	message: string,
	date: string
};

const MessageItem = (props: MessageItemProps) =>
{
	let align: "right" | "center" | "left";
	const	messageToSplit = props.message.split("&");
	const	playPong = messageToSplit[0];
	const	message = messageToSplit[1];
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
	if (playPong === "/playPong" && props.sender === "server")
		return (
			<ListItem key={props.ind}>
				<Grid container>
					<Grid item xs={12}>
						<ListItemText
							align={align}
							color="primary"
						>
							<InvitationCard
								message={message} />
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
			<ListItem key={props.ind}>
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
