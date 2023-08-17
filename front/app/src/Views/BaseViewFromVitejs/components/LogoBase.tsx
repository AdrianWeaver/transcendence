import reactLogo from "../assets/react.svg";
import viteLogo from "/vite.svg";

/**
 * There is two way to import this ressource SGV 
 * 
 * import reactLogo from "./assets/react.svg"; -> inside the srcs folder
 * import viteLogo from "/vite.svg"; -> inside the public folder 
 * 			(not started with "./" and with "/" == public ) 
 */
const	LogoBase = () =>
{
	return (
		<div>
			<a href="https://vitejs.dev" target="_blank">
				<img src={viteLogo} className="logo" alt="Vite logo" />
			</a>
			<a href="https://react.dev" target="_blank">
				<img src={reactLogo} className="logo react" alt="React logo" />
			</a>
		</div>
	);
};

export default LogoBase;
