import { useEffect } from "react";
import MenuBar from "../../Component/MenuBar/MenuBar";
import { useSavePrevPage } from "../../Router/Hooks/useSavePrevPage";

const	ReduxTestView = () =>
{
	const	savePrevPage = useSavePrevPage();

	useEffect(() =>
	{
		savePrevPage("/redux-test-view");
	});

	return (
		<>
			<MenuBar />
			<p>{"<ReduxViewTest>"}</p>
		</>
	);
};

export default ReduxTestView;
