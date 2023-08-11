import { useEffect } from "react";
import { useSavePrevPage } from "../../Router/Hooks/useSavePrevPage";
import MenuBar from "../../Component/MenuBar/MenuBar";

const	Signin = () =>
{
	const	savePrevPage = useSavePrevPage();

	useEffect(() =>
	{
		savePrevPage("/signin");
	});

	return (
		<>
			<MenuBar />
			<p>Signin</p>
		</>
	);
};

export default Signin;
