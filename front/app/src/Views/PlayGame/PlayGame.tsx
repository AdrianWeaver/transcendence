import { useEffect } from "react";
import MenuBar from "../../Component/MenuBar/MenuBar";
import { useSavePrevPage } from "../../Router/Hooks/useSavePrevPage";

const	PlayGame = () =>
{
	const	savePrevPage = useSavePrevPage();

	useEffect(() =>
	{
		savePrevPage("/play-game");
	});

	return (
		<>
			<MenuBar />
			<p>{"<PlayGame>"}</p>
		</>
	);
};

export default PlayGame;
