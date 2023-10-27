/* eslint-disable max-statements */
import { useEffect } from "react";
import MenuBar from "../../Component/MenuBar/MenuBar";
import { useSavePrevPage } from "../../Router/Hooks/useSavePrevPage";
import { useAppDispatch } from "../../Redux/hooks/redux-hooks";
import
{
	verifyTokenAnonymousUser
}	from "../../Redux/store/anonymousUserAction";

// import DropZoneImage from "../../Component/DropZoneImage/DropZoneImage";
import UpdateMyProfilePicture
	from "../../Component/DropZoneImage/UpdateMyProfilePicture";


const	Home = () =>
{
	const	savePrevPage = useSavePrevPage();
	const	dispatch = useAppDispatch();

	dispatch(verifyTokenAnonymousUser());
	useEffect(() =>
	{
		savePrevPage("/");
	}, []);


	const header = <MenuBar />;

	const body = (
		<>
			<h1>home view</h1>
		</>);

	return (
		<>
			{header}
			{body}
		</>
	);
};

export default Home;
