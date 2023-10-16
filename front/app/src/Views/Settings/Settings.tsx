import { useEffect } from "react";
import MenuBar from "../../Component/MenuBar/MenuBar";
import { useSavePrevPage } from "../../Router/Hooks/useSavePrevPage";
import EditProfile from "../MyProfile/components/EditProfile";

const	Settings = () =>
{
	const	savePrevPage = useSavePrevPage();

	useEffect(() =>
	{
		savePrevPage("/me/settings");
	});

	return (
		<>
			<MenuBar />
			<EditProfile
				setting={true} />
		</>
	);
};

export default Settings;
