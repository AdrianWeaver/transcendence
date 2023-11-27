/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
import { useEffect } from "react";
import MenuBar from "../../Component/MenuBar/MenuBar";
import { useSavePrevPage } from "../../Router/Hooks/useSavePrevPage";
import { Grid } from "@mui/material";
import "./assets/index.css";
import LeftSide from "./components/LeftSide";
import RightSide from "./components/RightSide";
import { useAppDispatch, useAppSelector } from "../../Redux/hooks/redux-hooks";
import EditProfile from "./components/EditProfile";
import UpdateMyProfilePicture from "../../Component/DropZoneImage/UpdateMyProfilePicture";
import { getAchievements } from "../../Redux/store/controllerAction";

const	MyProfile = () =>
{
	const	savePrevPage = useSavePrevPage();
	const	dispatch = useAppDispatch();
	const	prevPage= useAppSelector((state) =>
	{
		return (state.controller.previousPage);
	});
	const	user = useAppSelector((state) =>
	{
		return (state.controller.user);
	});

	useEffect(() =>
	{
		dispatch(getAchievements("myself"));
		if (user.profile.editView)
		{
			savePrevPage("/me/profile");
		}
	});

	return (
		<>
			<MenuBar />
			{
				(user.profile.editView)
				? 	<EditProfile
						setting={false} />
				: <div className="wrapper">
					<Grid container>
						<Grid item xs={12} sm={6}>
								<LeftSide
									status={""}
									pseudo={user.username}
									imageUrl={user.avatar}
									defaultUrl="https://thispersondoesnotexist.com/"
									prevPage={prevPage}
									isMe={true}
									isFriend={true}
									profileId={user.id.toString()}
								/>
						</Grid>
						<Grid item xs={12} sm={6}>
								<RightSide
									profileId={user.id.toString()}
									isMe={true}
									/>
						</Grid>
					</Grid>
				</div>
			}
		</>
	);
};

export default MyProfile;
