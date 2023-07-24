/* eslint-disable max-lines-per-function */

import Letter from "./Letter";

const	Title = () =>
{
	return (
		<div style={{display: "normal"}} className="crt">
			<div className="game-element gamefont titlefont"
			>
				PONG
				<span id="dev">
				</span>
			</div>
			<div className="game-element gamefont titlefont title2font">
				<Letter color="yellow" letter="f" />
				<Letter color="green" letter="t" />
				<Letter color="purple" letter="_" />
				<Letter color="orange" letter="t" />
				<Letter color="blue" letter="r" />
				<Letter color="green" letter="a" />
				<Letter color="red" letter="n" />
				<Letter color="yellow" letter="s" />
				<Letter color="green" letter="c" />
				<Letter color="purple" letter="e" />
				<Letter color="orange" letter="n" />
				<Letter color="blue" letter="d" />
				<Letter color="green" letter="e" />
				<Letter color="yellow" letter="n" />
				<Letter color="red" letter="c" />
				<Letter color="purple" letter="e" />
			</div>
			<div
				id="startbutton"
				className="game-element gamefont startfont"
			>
				<a href="./indexPong.html">
					Play
				</a>
			</div>
		</div>
	);
};

export default Title;
