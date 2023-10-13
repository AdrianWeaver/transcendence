
/* eslint-disable curly */
/* eslint-disable max-statements */
/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */

import { Avatar, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";

const CurrentlyTalkingFriend = () =>
{
	const currentlyTalkingFriendDataFake = {
		name: "Earl Hickey",
		avatar: "https://pbs.twimg.com/profile_images/956695054126665728/0zl_Ejq2_400x400.jpg",
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
