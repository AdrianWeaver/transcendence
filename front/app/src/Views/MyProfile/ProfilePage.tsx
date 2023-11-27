/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
import MenuBar from "../../Component/MenuBar/MenuBar";
import { Grid } from "@mui/material";
import "./assets/index.css";
import LeftSide from "./components/LeftSide";
import RightSide from "./components/RightSide";
import { useAppDispatch, useAppSelector } from "../../Redux/hooks/redux-hooks";

const	ProfilePage = () =>
{
	const	dispatch = useAppDispatch();
	const	prevPage= useAppSelector((state) =>
	{
		return (state.controller.previousPage);
	});
	const	user = useAppSelector((state) =>
	{
		return (state.controller.user);
	});
	const	currentProfile = useAppSelector((state) =>
	{
		return (state.controller.user.chat.currentProfile);
	});
	const	userSelected = user.chat.users.find((elem) =>
	{
		return (elem.profileId === currentProfile);
	});
	let		online, status;
	if (userSelected !== undefined)
	{
		online = userSelected.online ? "online 🟢" : "offline 🔴";
		status = userSelected.status === "playing" ? "playing... 🏓" : online;
	}
	let	isFriend: boolean;
	isFriend = false;
	if (user.chat.friends)
	{	const	searchFriend = user.chat.friends.find((elem) =>
		{
			return (elem.profileIdFriend.toString() === userSelected?.profileId.toString()
				&& elem.profileIdOwner.toString() === user.id.toString());
		})
		if (searchFriend)
			isFriend = true;
		else
			isFriend = false;
	}
	return (
		<>
			<MenuBar />
			{
				<div className="wrapper">
					<Grid container>
						<Grid item xs={12} sm={6}>
								<LeftSide
									status={status}
									pseudo={userSelected?.name}
									imageUrl={userSelected?.avatar}
									defaultUrl="https://thispersondoesnotexist.com/"
									prevPage={prevPage}
									isMe={false}
									isFriend={isFriend}
									profileId={userSelected?.profileId}
								/>
						</Grid>
						<Grid item xs={12} sm={6}>
								<RightSide
									profileId={userSelected?.profileId}
									isMe={false}
									isFriend={isFriend}
									/>
						</Grid>
					</Grid>
				</div>
			}
		</>
	);
};

export default ProfilePage;