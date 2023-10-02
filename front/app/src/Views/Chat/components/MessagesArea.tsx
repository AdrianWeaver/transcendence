/* eslint-disable no-alert */
/* eslint-disable curly */
/* eslint-disable max-statements */
/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */

import
{
	useAppDispatch,
	useAppSelector
}	from "../../../Redux/hooks/redux-hooks";

import
{
	setActiveConversationId,
}	from "../../../Redux/store/controllerAction";

import { List } from "@mui/material";

import MessageItem from "./MessageItem";

const MessagesArea = () =>
{
	let displayMessageArray;

	displayMessageArray = [
	{
		sender: "server",
		message: "Not initiliazed",
		date: "09:30"
	},
	];
	const	dispatch = useAppDispatch();

	const users = useAppSelector((state) =>
	{
		return (state.controller.user.chat.users);
	});

	const activeId = useAppSelector((state) =>
	{
		return (state.controller.user.chat.activeConversationId);
	});

	const userActiveIndex = users.findIndex((elem) =>
	{
		return (elem.id === activeId);
	});
	if (userActiveIndex === -1)
	{
		displayMessageArray = [
			{
				sender: "server",
				message: "Ce client n'existe pas",
				date: "09:30"
			},
		];
	}
	else
	{
		const msgRoom = users[userActiveIndex].msgRoom;
		let i;

		i = 0;
		while (msgRoom.length)
		{
			if (msgRoom[i].id === activeId)
			{
				displayMessageArray = msgRoom[i].content;
				break;
			}
			i++;
		}
		if (i === msgRoom.length)
		{
			dispatch(setActiveConversationId(activeId));
			displayMessageArray = [
				{
					sender: "server",
					message: "Conversation with " + activeId,
					date: "09:30"
				},
			];
		}
	}
	return (
		<>
			<List
				sx={{
					height: "70vh",
					overflowY: "auto"
				}}
			>
				{
					displayMessageArray.map((elem, key) =>
					{
						return (
							<MessageItem
								key={key}
								date={elem.date}
								sender={elem.sender as "me" | "other" | "server"}
								message={elem.message}
							/>
						);
					})
				}
			</List>
		</>
	);
};

export default MessagesArea;
