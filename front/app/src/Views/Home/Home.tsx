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
			<h1>Welcome to our ft_transcendence project !</h1>
			<h2>It was made with love and tears by apayet, jcourtoi and nboratko.</h2>
			<h2>Here is a picture of a kitten:</h2>
			<img src="https://images.ctfassets.net/sfnkq8lmu5d7/1NaIFGyBn0qwXYlNaCJSEl/ad59ce5eefa3c2322b696778185cc749/2021_0825_Kitten_Health.jpg?w=1000&h=750&q=70&fm=webp" alt="Kitten" />
		</>);

	return (
		<>
			{header}
			{body}
		</>
	);
};

export default Home;
