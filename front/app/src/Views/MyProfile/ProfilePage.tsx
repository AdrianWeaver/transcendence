/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
import MenuBar from "../../Component/MenuBar/MenuBar";
import { Grid } from "@mui/material";
import "./assets/index.css";
import LeftSide from "./components/LeftSide";
import RightSide from "./components/RightSide";
import { useAppSelector } from "../../Redux/hooks/redux-hooks";
// import EditProfile from "./components/EditProfile";
// import { addUserAsFriend, setProfileEditView } from "../../Redux/store/controllerAction";

const	ProfilePage = () =>
{
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
	if (currentProfile === "undefined" || currentProfile === undefined || currentProfile === "")
		throw new Error("currentProfile undefined");
	console.log("Current Profile", currentProfile);
	const	userSelected = user.chat.users.find((elem) =>
	{
		return (elem.profileId === currentProfile);
	});
	if (userSelected === undefined)
		throw new Error("user profile doesnt exist");
	console.log(userSelected.name, "'s profile !!!");
	const	online = userSelected.online ? "online 🟢" : "offline 🔴";
	const	status = userSelected.status === "playing" ? "playing... 🏓" : online;
	return (
		<>
			<MenuBar />
			{
				// (user.profile.editView)
				// ? 	<EditProfile
				// 		setting={false} />
				<div className="wrapper">
					<Grid container>
						<Grid item xs={12} sm={6}>
								<LeftSide
									status={status}
									pseudo={userSelected.name}
									imageUrl={userSelected.avatar}
									defaultUrl="https://thispersondoesnotexist.com/"
									prevPage={prevPage}
									isMe={false}
									isFriend={user.chat.currentProfileIsFriend}
								/>
						</Grid>
						<Grid item xs={12} sm={6}>
								<RightSide
									profileId={userSelected.profileId}
									isMe={false}
									/>
						</Grid>
					</Grid>
				</div>
			}
		</>
	);
};

export default ProfilePage;
