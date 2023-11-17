
// /* eslint-disable no-alert */
// /* eslint-disable curly */
// /* eslint-disable max-statements */
// /* eslint-disable max-len */
// /* eslint-disable max-lines-per-function */
// import
// {
// 	List
// } from "@mui/material";

// import {
// 	useAppDispatch,
// 	useAppSelector
// } from "../../../Redux/hooks/redux-hooks";
// import {
// 	setActiveConversationId}	from "../../../Redux/store/controllerAction";
// import MessageItem from "./MessageItem";

// const MessagesArea = () =>
// {
// 	let displayMessageArray;

// 	displayMessageArray = [
// 	{
// 		sender: "server",
// 		message: "Not initiliazed",
// 		date: "09:30"
// 	},
// 	];
// 	const users = useAppSelector((state) =>
// 	{
// 		return (state.controller.user.chat.users);
// 	});

// 	const activeId = useAppSelector((state) =>
// 	{
// 		return (state.controller.user.chat.activeConversationId);
// 	});

// 	const userActiveIndex = users.findIndex((elem) =>
// 	{
// 		return (elem.id === activeId);
// 	});
// 	if (userActiveIndex === -1)
// 	{
// 		displayMessageArray = [
// 			{
// 				sender: "server",
// 				message: "Ce client n'existe pas",
// 				date: "09:30"
// 			},
// 		];
// 	}
// 	return (
// 		<>
// 			<List
// 				sx={{
// 					height: "70vh",
// 					overflowY: "auto"
// 				}}
// 			>
// 				{
// 					displayMessageArray.map((elem, key) =>
// 					{
// 						return (
// 							<MessageItem
// 								key={key}
// 								date={elem.date}
// 								sender={elem.sender as "me" | "other" | "server"}
// 								message={elem.message}
// 							/>
// 						);
// 					})
// 				}
// 			</List>
// 		</>
// 	);
// };

// export default	MessagesArea;
