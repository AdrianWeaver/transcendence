import { Avatar, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { useAppDispatch } from "../../Redux/hooks/redux-hooks";
import { setActiveConversationId } from "../../Redux/store/controllerAction";

type TestProps =
{
	index: number,
	name: string,
	avatar: string,
	isFriend: boolean,
	status: string,
	online: boolean
}

const	Test = (props: TestProps) =>
{
	// const	dispatch = useAppDispatch();
let status;
status = props.online ? "💚" : "🔴";
if (props.status === "playing" && props.online)
	status = "🏓";
return (
	<>
		<ListItem key={props.index} >
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
		</>
);
		}

export default Test;