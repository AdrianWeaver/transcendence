import { useSavePrevPage } from "../../Router/Hooks/useSavePrevPage";

const	Home = () =>
{
	useSavePrevPage("/");

	return (<h1>home view</h1>);
};

export default Home;
