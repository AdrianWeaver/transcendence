import { useEffect } from "react";
import { useSavePrevPage } from "../../Router/Hooks/useSavePrevPage";

const	Signin = () =>
{
	const	savePrevPage = useSavePrevPage();

	useEffect(() =>
	{
		savePrevPage("/signin");
	});

	return (<p>Signin</p>);
};

export default Signin;
