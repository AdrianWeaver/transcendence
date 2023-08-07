/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
import React, { createContext } from 'react';
import { useEffect, useRef } from "react";
import { useAppSelector } from "../../hooks/redux-hooks";
import UseWindowSize from "../Canvas/UseWindowSize";

import Game from "./objects/Game";
import Board from "./objects/Board";
import Ball from "./objects/Ball";
import Net from "./objects/Net";
import Player from "./objects/Player";
import Racket from "./objects/Racket";
import Position from "./objects/Position";
import Dimension from "./objects/Dimension";
import { renderMatches } from 'react-router-dom';

/* docu https://css-tricks.com/using-requestanimationframe-with-react-hooks/*/
const	GameCanvas = () =>
{
	const	size = useAppSelector((state) =>
	{
		return (state.controller.canvas);
	});
	UseWindowSize();

	const game = new Game();
	game.board.game = game;

	let actionKeyPress;
	actionKeyPress = -1;

	game.ball.game = game;
	game.net.game = game;


	const	canvasRef = useRef<HTMLCanvasElement>(null);
	game.board.canvasRef = canvasRef;

	const startButtonRef = useRef<HTMLInputElement>(null);
	const startButton = startButtonRef.current;
	const pauseButtonRef = useRef<HTMLInputElement>(null);
	const pauseButton = pauseButtonRef.current;
	const resumeButtonRef = useRef<HTMLInputElement>(null);
	const resumeButton = resumeButtonRef.current;

	const	update = () =>
	{
		game.playerOne.updatePlayerPosition();
		game.playerTwo.updatePlayerPosition();
		game.ball.update();
	}

	const clear = () =>
	{
		if (game.board.ctx)
		{
			game.board.ctx.fillStyle = "#fff";
			game.board.ctx?.clearRect(0, 0, game.board.dim.width, game.board.dim.height);
		}
	}

	const	keyHookDown = (e) =>
	{
		switch (e.keyCode)
		{
			case 38: // fleche up
				game.actionKeyPress = 38;
				break; 
			case 40: // fleche down
				game.actionKeyPress = 40;
				break;
			case 83: //S
				game.actionKeyPress = 83;
				break;
			case 87: //W
				game.actionKeyPress = 87;
				break;
			default:
				break;
		}
	}

	const	keyHookReleased = (e) =>
	{
		game.actionKeyPress = -1;
	}

	useEffect(() =>
	{
		let requestId: number;
		const canvas = canvasRef.current;
		const ctx = canvas?.getContext("2d");
		game.board.canvas = canvas;
		game.board.ctx = ctx;
		game.board.init();
		addEventListener("keydown", keyHookDown);
		addEventListener("keyup", keyHookReleased);
		startButton?.addEventListener('click', function(){
			// let startAudio = document.querySelector('#startSound');
			// startAudio.play();
			game.continueAnimating = true;
			game.startDisplayed = false;
		});
	
		pauseButton?.addEventListener('click',function(){
			game.continueAnimating = false;
		});
	
		resumeButton?.addEventListener('click',function(){
			game.continueAnimating = true;
		});

		const	render = () =>
		{
			clear();
			update();

			game.board.ctx?.beginPath();
			if (game.board.ctx)
			{
				game.board.ctx.fillStyle = "#F5F5DC";
				game.board.ctx.fillRect(0, 0, game.board.dim.width, game.board.dim.height);
			}
			game.net.render();
			game.ball.render();
			game.playerOne.render();
			game.playerTwo.render();
			game.playerOne.renderScore();
			game.playerTwo.renderScore();
			if (game.startDisplayed == true)
				game.displayStartMessage();
			requestId = requestAnimationFrame(render);
		};
		requestId = requestAnimationFrame(render);
		return (() =>
		{
			cancelAnimationFrame(requestId);
		});
	});

	// startButton?.addEventListener('click',function(){
	// 	// let startAudio = document.querySelector('#startSound');
	// 	// startAudio.play();
	// 	game.continueAnimating = true;
	// 	game.startDisplayed = false;
	// });

	// pauseButton?.addEventListener('click',function(){
	// 	game.continueAnimating = false;
	// });

	// resumeButton?.addEventListener('click',function(){
	// 	game.continueAnimating = true;
	// });

	return (
		<>
			<div>
				FT_TRANSCENDANCE
			</div>
			<div>
				<input type="button" value="START" ref={startButtonRef} />
			</div>
			<div>
				<canvas
					height={game.board.canvas?.height}
					width={game.board.canvas?.width}
					ref={game.board.canvasRef}
				>
				</canvas>
			</div>
			<div>
				<input type="button" value="PAUSE" ref={pauseButtonRef} />
				<input type="button" value="RESUME" ref={resumeButtonRef} />
			</div>
		</>
	);
	// }
	// else
	// {
	// 	window.alert();
	// }
};

export default GameCanvas;
