import MenuBar from "../../Component/MenuBar/MenuBar";
import { useSavePrevPage } from "../../Router/Hooks/useSavePrevPage";

const	ReduxTestView = () =>
{
	useSavePrevPage("/redux-test-view");

	return (
		<>
			<MenuBar />
			<p>{"<ReduxViewTest>"}</p>
		</>
	);
};

export default ReduxTestView;
