
/* eslint-disable curly */
/* eslint-disable max-statements */
/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */

import { Avatar, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";

const CurrentlyTalkingFriend = () =>
{
	const currentlyTalkingFriendDataFake = {
		name: "John Wick",
		avatar: "https://material-ui.com/static/images/avatar/1.jpg",
	};

	return (
		<List>
			<ListItem
				button
				key={currentlyTalkingFriendDataFake.name}
			>
				<ListItemIcon>
					<Avatar
						alt={currentlyTalkingFriendDataFake.name}
						src={currentlyTalkingFriendDataFake.avatar}
					/>
				</ListItemIcon>
				<ListItemText primary={currentlyTalkingFriendDataFake.name}>
				</ListItemText>
			</ListItem>
		</List>
	);
};

export default CurrentlyTalkingFriend;
