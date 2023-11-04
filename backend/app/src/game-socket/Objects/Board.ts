/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
import Game from "./GameServe";
import Dimension from "./Dimension";

// import { createRef } from "react";

class Board
{
	public borderStyle: string;
	public backgroundColor: string;
	public irlWidth: number;
	public irlHeight: number;
	public irlRatio: number;
	// public canvasRef: React.RefObject<HTMLCanvasElement> | null;
	public canvas: HTMLCanvasElement | null;
	public ctx: CanvasRenderingContext2D | null | undefined;
	public dim: Dimension;
	public game: Game | undefined;
	public setHeight: () => number;
	public updateSizeAfterResize: () => void;
	public registerEvents: () => void;
	public init: () => void;

	public getSeralizable: () => any;

	public constructor()
	{
		this.borderStyle = "1px solid";
		this.backgroundColor = "#FFF";
		this.irlWidth = 274;
		this.irlHeight = 152.5;
		this.irlRatio = this.irlHeight / this.irlWidth;
		this.dim = new Dimension();
		this.game = undefined;
		this.setHeight = () =>
		{
			this.dim.height = this.irlRatio * this.dim.width;
			return (this.dim.height);
		};
		this.updateSizeAfterResize = () =>
		{
			const	prevWidth = this.dim.width;
			const	prevHeight = this.dim.height;
			const	windowWidth = window.innerWidth;
			const	canvasWidth = windowWidth * 0.66;
			const	canvasHeight = this.setHeight();

			this.dim.width = canvasWidth;
			this.dim.height = canvasHeight;

			const	multiplicatorWidth = this.dim.width / prevWidth;
			const	multiplicatorHeight = this.dim.height / prevHeight;

			if (this.game && this.game.playerOne)
			{
				this.game.playerOne.pos.x = this.game.playerOne.pos.x
											* multiplicatorWidth;
				this.game.playerOne.pos.y = this.game.playerOne.pos.y
											* multiplicatorHeight;
				this.game.playerOne.racket.defineRacketSize();
			}
			if (this.game && this.game.playerTwo)
			{
				this.game.playerTwo.pos.x = this.game.playerTwo.pos.x
											* multiplicatorWidth;
				this.game.playerTwo.pos.y = this.game.playerTwo.pos.y
											* multiplicatorHeight;
				this.game.playerTwo.racket.defineRacketSize();
			}
			if (this.game && this.game.ball)
			{
				this.game.ball.pos.x *= multiplicatorWidth;
				this.game.ball.pos.y *= multiplicatorHeight;
			}
		};
		// eslint-disable-next-line max-statements
		this.init = () =>
		{
			this.dim.width = 4096;
			this.setHeight();
			if (this.game)
			{
				this.game.initPlayers();
				this.game.ball.init();
			}
			else
				console.error(this.game);
		};

		this.getSeralizable = () =>
		{
			return ({
				borderStyle: this.borderStyle,
				backgroundColor: this.backgroundColor,
				irlWidth: this.irlWidth,
				irlHeight: this.irlHeight,
				irlRatio: this.irlRatio,
				dim: this.dim,
				// game: this.game,
			});
		};
	}
}

export default Board;
