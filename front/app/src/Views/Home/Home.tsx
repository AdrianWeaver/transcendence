/* eslint-disable max-statements */
import { useEffect } from "react";
import MenuBar from "../../Component/MenuBar/MenuBar";
import { useSavePrevPage } from "../../Router/Hooks/useSavePrevPage";

const	Home = () =>
{
	const	savePrevPage = useSavePrevPage();

	// dispatch(verifyTokenAnonymousUser());
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
