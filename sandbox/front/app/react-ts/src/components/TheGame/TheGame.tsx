/* eslint-disable max-classes-per-file */
/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */

import Canvas from "../Canvas/Canvas";
import MenuBar from "../MenuBar/MenuBar";
import Title from "./Title";


import "./customStyle.css";

const	AnimatedBackground = () =>
{
	return (
		<>
			<Canvas	/>
		</>
	);
};

const	TheGame = () =>
{
	return (
		<>
			<MenuBar />
			{/* <Title />  */}
			{/* <Background /> */}
			<AnimatedBackground />
			{/* <div
				className="game-element gamefont devfont"
			>
				by
				<a
					className="devlink"
					href="./index.html"
				>
					JEAAN
				</a>
				<br />
				<br />
				<span>
					&copy; 2023
				</span>&nbsp;
			</div> */}
		</>
	);
};

export default TheGame;
