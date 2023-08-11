import { useEffect } from "react";
import MenuBar from "../../Component/MenuBar/MenuBar";
import { useSavePrevPage } from "../../Router/Hooks/useSavePrevPage";

const	TheGame = () =>
{
	const	savePrevPage = useSavePrevPage();

	useEffect(() =>
	{
		savePrevPage("/play-game");
	});
	return (
		<>
			<MenuBar />
			<p>The Game</p>
		</>
	);
};

export default TheGame;
