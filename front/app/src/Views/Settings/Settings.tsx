import { useEffect } from "react";
import MenuBar from "../../Component/MenuBar/MenuBar";
import { useSavePrevPage } from "../../Router/Hooks/useSavePrevPage";

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
			<p>{"<Settings>"}</p>
		</>
	);
};

export default Settings;
