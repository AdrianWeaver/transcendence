import MenuBar from "../../Component/MenuBar/MenuBar";
import { useSavePrevPage } from "../../Router/Hooks/useSavePrevPage";

const	Home = () =>
{
	useSavePrevPage("/");

	return (
		<>
			<MenuBar />
			<h1>home view</h1>
		</>
	);
};

export default Home;
