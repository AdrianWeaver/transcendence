import { useEffect } from "react";
import MenuBar from "../../Component/MenuBar/MenuBar";
import { useSavePrevPage } from "../../Router/Hooks/useSavePrevPage";

const	MyProfile = () =>
{
	const	savePrevPage = useSavePrevPage();

	useEffect(() =>
	{
		savePrevPage("/me/profile");
	});

	return (
		<>
			<MenuBar />
			<p>{"<MyProfile>"}</p>
		</>
	);
};

export default MyProfile;
