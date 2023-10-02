import { useEffect } from "react";
import MenuBar from "../../Component/MenuBar/MenuBar";
import { useSavePrevPage } from "../../Router/Hooks/useSavePrevPage";

import data from "./realFakeData.json";

const	MyProfile = () =>
{
	const	savePrevPage = useSavePrevPage();

	console.log(data);

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
