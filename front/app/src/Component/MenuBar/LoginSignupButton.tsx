
import { Button } from "@mui/material";

import { useNavigate } from "react-router-dom";

const	LoginSignupButton = () =>
{
	const	navigate = useNavigate();

	const	handleLoginButton = () =>
	{
		navigate("/signin");
	};

	const	handleSignupButton = () =>
	{
		navigate("/signup");
	};

	return (
		<>
			<Button onClick={handleLoginButton} color="inherit">Login</Button>
			<Button onClick={handleSignupButton} color="inherit">Signup</Button>
		</>
	);
};

export default LoginSignupButton;
