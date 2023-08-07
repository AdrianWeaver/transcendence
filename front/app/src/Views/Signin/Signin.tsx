import { useSavePrevPage } from "../../Router/Hooks/useSavePrevPage";

const	Signin = () =>
{
	useSavePrevPage("/signin");
	return (<p>Signin</p>);
};

export default Signin;
