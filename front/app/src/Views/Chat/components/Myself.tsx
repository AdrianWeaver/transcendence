
/* eslint-disable curly */
/* eslint-disable max-statements */
/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */

import { Avatar, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { useAppSelector } from "../../../Redux/hooks/redux-hooks";

const Myself = () =>
{
	const	myself = useAppSelector((state) =>
	{
		return (state.controller.user);
	});
	const myselfData = {
		name: myself.username,
		avatar: myself.avatar
		// name: "Earl Hickey",
		// avatar: "https://pbs.twimg.com/profile_images/956695054126665728/0zl_Ejq2_400x400.jpg",
	};

	return (
		<List>
			<ListItem
				key={myselfData.name}
			>
				<ListItemIcon>
					<Avatar
						alt={myselfData.name}
						src={myselfData.avatar}
					/>
				</ListItemIcon>
				<ListItemText primary={myselfData.name}>
				</ListItemText>
			</ListItem>
		</List>
	);
};

export default Myself;
