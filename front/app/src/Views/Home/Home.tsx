/* eslint-disable max-statements */
import { useEffect } from "react";
import MenuBar from "../../Component/MenuBar/MenuBar";
import { useSavePrevPage } from "../../Router/Hooks/useSavePrevPage";
// import DropZoneImage from "../../Component/DropZoneImage/DropZoneImage";
import UpdateMyProfilePicture
	from "../../Component/DropZoneImage/UpdateMyProfilePicture";

const	Home = () =>
{
	const	savePrevPage = useSavePrevPage();

	useEffect(() =>
	{
		savePrevPage("/");
	});

	const header = <MenuBar />;

	const body = (
		<>
			<h1>home view</h1>
		</>);

	return (
		<>
			{header}
			{body}
			<UpdateMyProfilePicture />
		</>
	);
};

export default Home;
